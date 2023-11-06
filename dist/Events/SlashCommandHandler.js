"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    name: discord_js_1.Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand() &&
            !interaction.isMessageContextMenuCommand())
            return;
        if (interaction.channel?.type == discord_js_1.ChannelType.DM || !interaction.guild) {
            return interaction.reply({
                content: `**명령어는 개인 메시지에서 사용하실 수 없습니다**`,
            });
        }
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command)
            return;
        if (!command.dfr) {
            await interaction.deferReply({
                ephemeral: command.ephemeral == true ? true : false,
            });
        }
        try {
            await command.execute(interaction);
        }
        catch (error) {
            console.log(`${interaction.commandName} 명령어 실행 중 오류 발생`);
            console.log(error);
        }
    },
};
