"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const index_1 = __importDefault(require("../index"));
exports.default = {
    name: discord_js_1.Events.Raw,
    async execute(data) {
        index_1.default.moon.packetUpdate(data);
    },
};
