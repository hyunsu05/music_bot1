"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const getMiniteSecond_1 = __importDefault(require("../../function/getMiniteSecond"));
function numberToTwoLength(inputNumber) {
    return inputNumber < 10 ? `0${inputNumber}` : inputNumber.toString();
}
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("대기열")
        .setDescription("음악 대기열을 확인합니다"),
    async execute(interaction) {
        const player = interaction.client.moon.players.get(interaction.guild.id);
        if (!player) {
            setTimeout(() => {
                interaction?.deleteReply().catch(() => { });
            }, 3000);
            return interaction.editReply({
                content: `**음악을 재생하고 있지 않아요**`,
            });
        }
        console.log(player.queue);
        const queues = // @ts-ignore
         player.queue.db.data
            .queue?.[interaction.guild.id];
        if (!queues && !player.current?.title) {
            setTimeout(() => {
                interaction?.deleteReply().catch(() => { });
            }, 3000);
            return interaction.editReply({
                content: `**음악을 재생하고 있지 않아요**`,
            });
        }
        const nowMusic = player.current;
        const startTime = music_lapse.get(player.guildId) || 0;
        const resultSecond = Math.floor((Date.now() - startTime) / 1000);
        const lapse_minutes = numberToTwoLength(Math.floor(resultSecond / 60));
        const lapse_seconds = numberToTwoLength(resultSecond % 60);
        const embed = new discord_js_1.EmbedBuilder({ title: "플레이리스트 🎶" })
            .setColor("Blue")
            .setThumbnail(nowMusic.artworkUrl);
        let playlist_stringMap = [];
        playlist_stringMap.push(`재생중 :: [${nowMusic.title}](${nowMusic.url}) (${(0, getMiniteSecond_1.default)(nowMusic.duration)})`);
        playlist_stringMap.push(`현재 구간 : [${lapse_minutes}:${lapse_seconds}](${nowMusic.url}&t=${resultSecond}s)`);
        if (queues) {
            playlist_stringMap.push(" ");
            for (let i = 0; i < (queues.length > 10 ? 10 : queues.length); i++) {
                playlist_stringMap.push(`${i + 1}. [${queues[i].title}](${queues[i].url}) (${(0, getMiniteSecond_1.default)(queues[i].duration)})`);
            }
        }
        embed.setDescription(`**${playlist_stringMap.join("\n")}**`);
        interaction.editReply({ embeds: [embed] });
        setTimeout(() => {
            interaction?.deleteReply().catch(() => { });
        }, 60 * 1000);
    },
};
