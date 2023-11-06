"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    name: discord_js_1.Events.VoiceStateUpdate,
    async execute(oldState, newState) {
        const oldChannel_members = oldState.channel?.members.keys();
        if (oldChannel_members) {
            const oldMembers_id = Array.from(oldChannel_members);
            if (oldMembers_id.includes(oldState.client.user.id) &&
                oldState.channel?.members.filter((f) => !f.user.bot).size == 0) {
                let player = oldState.client.moon.players.get(oldState.guild.id);
                if (player) {
                    setTimeout(() => {
                        player = oldState.client.moon.players.get(oldState.guild.id);
                        if (oldState.channel?.members.filter((f) => !f.user.bot).size == 0 &&
                            player) {
                            if (process.env.AUTOPLAY == "1") {
                                player.setAutoPlay(false);
                            }
                            player.stop();
                        }
                    }, 10 * 1000);
                }
            }
        }
    },
};
