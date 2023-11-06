"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
const discord_js_1 = require("discord.js");
const getMiniteSecond_1 = __importDefault(require("../function/getMiniteSecond"));
const updateDjMessage_1 = __importDefault(require("../function/updateDjMessage"));
exports.default = {
    name: "trackStart",
    type: "moon",
    async execute(player, current) {
        if (process.env.AUTOPLAY == "1") {
            player.setAutoPlay(true);
        }
        music_lapse.set(player.guildId, Date.now());
        const ClientUser = index_1.default.user;
        const textChannel = index_1.default.guilds.cache
            .get(player.guildId)
            ?.channels.cache.get(player.textChannel);
        if (textChannel && textChannel.type == discord_js_1.ChannelType.GuildText) {
            const embed = new discord_js_1.EmbedBuilder({
                title: `음악을 재생해요 🎶`,
            })
                .setDescription(`**[${current.title}](${current.url}) (${(0, getMiniteSecond_1.default)(current.duration)})**`)
                .setThumbnail(current.artworkUrl)
                .setColor("Purple")
                .setFooter({
                text: `신청자 : ${current.requester?.name || ClientUser.tag}`,
                iconURL: current.requester?.iconURL || ClientUser.displayAvatarURL(),
            });
            textChannel.send({ embeds: [embed] }).then((f) => {
                setTimeout(() => {
                    f?.delete().catch(() => { });
                }, 3000);
            });
        }
        (0, updateDjMessage_1.default)(player.guildId);
    },
};
