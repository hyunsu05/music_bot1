"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: "skipTrack",
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const command = interaction.client.commands.get("스킵");
        await command.execute(interaction);
        // const player = interaction.client.moon.players.get(interaction.guild.id);
        // if (!player) {
        //   setTimeout(() => {
        //     interaction?.deleteReply().catch(() => {});
        //   }, 3000);
        //   return interaction.editReply({
        //     content: `**음악을 재생하고 있지 않아요**`,
        //   });
        // }
        // if (player.voiceChannel != interaction.member.voice.channel?.id) {
        //   setTimeout(() => {
        //     interaction?.deleteReply().catch(() => {});
        //   }, 3000);
        //   return interaction.editReply({
        //     content: `**<#${player.voiceChannel}> 에서만 사용할 수 있습니다**`,
        //   });
        // }
        // setTimeout(() => {
        //   interaction?.deleteReply().catch(() => {});
        // }, 3000);
        // interaction.editReply({
        //   content: `**[${player.current.title}](<${player.current.url}>)을/를 스킵했어요**`,
        // });
        // player.skip();
    },
};
