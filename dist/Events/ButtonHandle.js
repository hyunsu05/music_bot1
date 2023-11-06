"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    name: discord_js_1.Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton() && !interaction.isAnySelectMenu())
            return;
        if (interaction.channel?.type == discord_js_1.ChannelType.DM || !interaction.guild) {
            interaction.reply({
                content: `**버튼은 개인 메시지에서 사용하실 수 없습니다**`,
            });
            return;
        }
        const button = interaction.client.buttons.get(interaction.customId.split("_")[0]);
        if (!button)
            return;
        try {
            await button.execute(interaction);
        }
        catch (error) {
            console.log(`${interaction.customId.split("_")[0]} 버튼 실행 중 오류 발생`);
            console.log(error);
        }
    },
};
