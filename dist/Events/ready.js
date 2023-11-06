"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    name: discord_js_1.Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`[준비 완료] ${client.user.tag}`);
        client.moon.init(client.user.id);
    },
};
