"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const getMiniteSecond_1 = __importDefault(require("../function/getMiniteSecond"));
let dj_messageF;
exports.default = {
    name: discord_js_1.Events.MessageCreate,
    async execute(message) {
        if (!message.guild ||
            message.channel.type != discord_js_1.ChannelType.GuildText ||
            !message.member)
            return;
        if (process.env.MUSIC_CHANNEL_ID.split(" ").includes(message.channel.id)) {
            if (!message.author.bot) {
                const title_option = message.content;
                if (!message.member.voice.channel) {
                    message.channel.send({ content: `**음성채널에 접속해 주세요**` });
                    return;
                }
                let player = message.client.moon.players.get(message.guild.id);
                if (!player) {
                    player = message.client.moon.players.create({
                        guildId: message.guild.id,
                        voiceChannel: message.member.voice.channel.id,
                        textChannel: message.channel.id,
                    });
                    await message.channel.bulkDelete(100, true);
                    const dj_embed = new discord_js_1.EmbedBuilder({ title: "DJ 보드 🎛️" })
                        .setColor("Purple")
                        .setImage("https://i.imgur.com/p4eTRCz.png");
                    const dj_message_send = await message.channel.send({
                        embeds: [dj_embed],
                    });
                    dj_messageF = dj_message_send.id;
                    globalThis.dj_message.set(message.guild.id, dj_messageF);
                }
                else {
                    player.setTextChannel(message.channel.id);
                    if (player.voiceChannel != message.member.voice.channel?.id) {
                        return message.channel.send({
                            content: `**<#${player.voiceChannel}> 에서만 사용할 수 있습니다**`,
                        });
                    }
                }
                if (!player.connected) {
                    player.connect({ setDeaf: true, setMute: false });
                }
                const search = await message.client.moon.search(title_option);
                if (search.loadType == "error" || search.loadType == "empty") {
                    return message.channel.send({
                        content: `**요청하신 곡을 찾을 수 없습니다**`,
                    });
                }
                for (const track of search.tracks) {
                    track.setRequester({
                        name: message.author.tag,
                        iconURL: message.member.displayAvatarURL(),
                    });
                }
                if (search.loadType == "playlist") {
                    message.channel.send({
                        content: `**\`${search.playlistInfo?.name}\` 플레이리스트를 추가합니다**`,
                    });
                    for (const track of search.tracks) {
                        player.queue.add(track);
                    }
                    if (process.env.AUTOPLAY == "1") {
                        player.setAutoPlay(false);
                    }
                    if (!player.playing) {
                        player.play();
                    }
                }
                else {
                    const selectmenu = new discord_js_1.StringSelectMenuBuilder()
                        .setCustomId(`playCommandSelectMusic`)
                        .setMinValues(1)
                        .setMaxValues(1)
                        .setPlaceholder("노래를 선택해 주세요");
                    const cancelButton = new discord_js_1.ButtonBuilder()
                        .setCustomId("cancelMusicSelect")
                        .setLabel("취소")
                        .setStyle(discord_js_1.ButtonStyle.Danger);
                    for (let i = 0; i < (search.tracks.length > 10 ? 10 : search.tracks.length); i++) {
                        selectmenu.addOptions(new discord_js_1.StringSelectMenuOptionBuilder({
                            value: `${i}`,
                            label: `${i + 1}. ${search.tracks[i].title.slice(0, 80)} (${(0, getMiniteSecond_1.default)(search.tracks[i].duration)})`,
                        }));
                    }
                    const selectMenuActionRow = new discord_js_1.ActionRowBuilder({ components: [selectmenu] });
                    const buttonActionRow = new discord_js_1.ActionRowBuilder({ components: [cancelButton] });
                    const selectMusicEmbed = new discord_js_1.EmbedBuilder({
                        title: `**재생할 노래를 선택해 주세요**`,
                    })
                        .setColor("Green")
                        .setFooter({
                        text: "아무 동작이 없으면 10초 뒤 자동으로 1번 노래가 선택됩니다",
                    });
                    const msg = await message.channel.send({
                        embeds: [selectMusicEmbed],
                        components: [selectMenuActionRow, buttonActionRow],
                    });
                    const selectMusicFilter = (i) => i.user.id == message.author.id;
                    const selectMusicCollect = msg.createMessageComponentCollector({
                        max: 1,
                        time: 10 * 1000,
                        filter: selectMusicFilter,
                    });
                    let selectMusicIndex = 0;
                    selectMusicCollect.on("collect", async (i) => {
                        if (i.isStringSelectMenu()) {
                            // selectMenu
                            selectMusicIndex = Number(i.values[0]);
                            await i.deferUpdate();
                        }
                        else {
                            // Button
                            msg?.delete().catch(() => { });
                            selectMusicIndex = -1;
                        }
                    });
                    selectMusicCollect.on("end", async () => {
                        if (selectMusicIndex == -1)
                            return;
                        msg?.delete().catch(() => { });
                        if (!message.guild) {
                            return;
                        }
                        player = message.client.moon.players.get(message.guild.id);
                        if (player) {
                            if (player.playing) {
                                message.channel
                                    .send({
                                    embeds: [],
                                    components: [],
                                    content: `**${search.tracks[selectMusicIndex].title} (${(0, getMiniteSecond_1.default)(search.tracks[selectMusicIndex].duration)}) 을/를 추가합니다**`,
                                })
                                    .then((f) => {
                                    setTimeout(() => {
                                        f?.delete().catch(() => { });
                                    }, 3000);
                                });
                            }
                            player.queue.add(search.tracks[selectMusicIndex]);
                            if (process.env.AUTOPLAY == "1") {
                                player.setAutoPlay(true);
                            }
                            if (!player.playing) {
                                player.play();
                            }
                        }
                    });
                }
            }
            if (message.author.bot) {
                setTimeout(() => {
                    if (!message.guild)
                        return;
                    if (message.id == dj_message.get(message.guild.id))
                        return;
                    message?.delete().catch(() => { });
                }, 10000);
            }
            else {
                setTimeout(() => {
                    message?.delete().catch(() => { });
                }, 5000);
            }
        }
    },
};
