"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const getMiniteSecond_1 = __importDefault(require("../../function/getMiniteSecond"));
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("재생")
        .setDescription("음악을 재생해요")
        .addStringOption((f) => f
        .setName("제목")
        .setDescription("노래 제목을 입력해 주세요")
        .setRequired(true)
        .setMaxLength(100)),
    ephemeral: true,
    async execute(interaction) {
        const title_option = interaction.options.getString("제목", true);
        if (!interaction.member.voice.channel) {
            interaction.editReply({ content: `**음성채널에 접속해 주세요**` });
            setTimeout(() => {
                interaction?.deleteReply().catch(() => { });
            }, 3000);
            return;
        }
        let player = interaction.client.moon.players.get(interaction.guild.id);
        if (!player) {
            player = interaction.client.moon.players.create({
                guildId: interaction.guild.id,
                voiceChannel: interaction.member.voice.channel.id,
                textChannel: interaction.channel.id,
            });
        }
        else {
            player.setTextChannel(interaction.channel.id);
            if (player.voiceChannel != interaction.member.voice.channel?.id) {
                setTimeout(() => {
                    interaction?.deleteReply().catch(() => { });
                }, 3000);
                return interaction.editReply({
                    content: `**<#${player.voiceChannel}> 에서만 사용할 수 있습니다**`,
                });
            }
        }
        if (!player.connected) {
            player.connect({ setDeaf: true, setMute: false });
        }
        const search = await interaction.client.moon.search(title_option);
        if (search.loadType == "error" || search.loadType == "empty") {
            setTimeout(() => {
                interaction?.deleteReply().catch(() => { });
            }, 3000);
            return interaction.editReply({
                content: `**요청하신 곡을 찾을 수 없습니다**`,
            });
        }
        for (const track of search.tracks) {
            track.setRequester({
                name: interaction.user.tag,
                iconURL: interaction.member.displayAvatarURL(),
            });
        }
        if (search.loadType == "playlist") {
            setTimeout(() => {
                interaction?.deleteReply().catch(() => { });
            }, 3000);
            interaction.editReply({
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
            setTimeout(() => {
                interaction?.deleteReply().catch(() => { });
            }, 1000 * 30);
            const msg = await interaction.editReply({
                embeds: [selectMusicEmbed],
                components: [selectMenuActionRow, buttonActionRow],
            });
            const selectMusicFilter = (i) => i.user.id == interaction.user.id;
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
                    interaction.deleteReply();
                    selectMusicIndex = -1;
                }
                // selectmenu.options.map((f) => (f.data.default = false));
                // selectmenu.options.filter(
                //   (f) => f.data.value == selectMusicIndex.toString()
                // )[0].data.default = true;
            });
            selectMusicCollect.on("end", async () => {
                if (selectMusicIndex == -1)
                    return;
                player = interaction.client.moon.players.get(interaction.guild.id);
                if (player) {
                    if (!player.playing) {
                        interaction.deleteReply();
                    }
                    else {
                        setTimeout(() => {
                            interaction?.deleteReply().catch(() => { });
                        }, 3000);
                        interaction.editReply({
                            embeds: [],
                            components: [],
                            content: `**[${search.tracks[selectMusicIndex].title}](<${search.tracks[selectMusicIndex].url}>) (${(0, getMiniteSecond_1.default)(search.tracks[selectMusicIndex].duration)}) 을/를 추가합니다**`,
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
    },
};
