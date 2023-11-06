"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: "seeQueue",
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const command = interaction.client.commands.get("대기열");
        await command.execute(interaction);
    },
};
