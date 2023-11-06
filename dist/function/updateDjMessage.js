"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const index_1 = __importDefault(require("../index"));
const getMiniteSecond_1 = __importDefault(require("./getMiniteSecond"));
exports.default = (guilId) => {
    const ClientUser = index_1.default.user;
    const player = index_1.default.moon.players.get(guilId);
    const guild = index_1.default.guilds.cache.get(guilId);
    if (!guild)
        return;
    const dj_messageF = dj_message.get(guilId);
    if (!dj_messageF)
        return;
    const message = guild.channels.cache.find((f) => process.env.MUSIC_CHANNEL_ID.split(" ").includes(f.id)).messages.cache.get(dj_messageF);
    if (!message) {
        return;
    }
    if (!player || !player.current) {
        const dj_embed = new discord_js_1.EmbedBuilder({ title: "DJ 보드 🎛️" })
            .setColor("Purple")
            .setImage("https://i.imgur.com/p4eTRCz.png");
        message.edit({ embeds: [dj_embed], components: [] });
        return;
    }
    const nowMusic = player.current;
    const dj_embed = new discord_js_1.EmbedBuilder({ title: "DJ 보드 🎛️" })
        .setColor("Purple")
        .setTitle(`음악 재생 중 🎵`)
        .setDescription(`**[${nowMusic.title}](${nowMusic.url}) (${(0, getMiniteSecond_1.default)(nowMusic.duration)})**`)
        .setFooter({
        text: `신청자 : ${nowMusic.requester?.name || ClientUser.tag}`,
        iconURL: nowMusic.requester?.iconURL || ClientUser.displayAvatarURL(),
    })
        .setImage(nowMusic.artworkUrl);
    const seeQueueButton = new discord_js_1.ButtonBuilder()
        .setLabel("대기열")
        .setCustomId("seeQueue")
        .setStyle(discord_js_1.ButtonStyle.Primary)
        .setEmoji("🗒");
    const skipTrackButton = new discord_js_1.ButtonBuilder()
        .setLabel("스킵")
        .setCustomId("skipTrack")
        .setStyle(discord_js_1.ButtonStyle.Primary)
        .setEmoji("▶️");
    const stopQueueButton = new discord_js_1.ButtonBuilder()
        .setLabel("정지")
        .setCustomId("stopQueue")
        .setStyle(discord_js_1.ButtonStyle.Danger)
        .setEmoji("🛑");
    const buttons_Actionrow = new discord_js_1.ActionRowBuilder({
        components: [seeQueueButton, skipTrackButton, stopQueueButton],
    });
    message.edit({ embeds: [dj_embed], components: [buttons_Actionrow] });
};
