"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
const discord_js_1 = require("discord.js");
const updateDjMessage_1 = __importDefault(require("../function/updateDjMessage"));
exports.default = {
    name: "queueEnd",
    type: "moon",
    async execute(player, current) {
        const textChannel = index_1.default.guilds.cache
            .get(player.guildId)
            ?.channels.cache.get(player.textChannel);
        if (textChannel && textChannel.type == discord_js_1.ChannelType.GuildText) {
            const embed = new discord_js_1.EmbedBuilder({
                title: `음악이 모두 끝났어요 🛑`,
            }).setColor("Green");
            textChannel.send({ embeds: [embed] }).then((f) => {
                setTimeout(() => {
                    f?.delete().catch(() => { });
                }, 3000);
            });
        }
        await player.destroy();
        (0, updateDjMessage_1.default)(player.guildId);
    },
};
