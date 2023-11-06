"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const updateDjMessage_1 = __importDefault(require("../function/updateDjMessage"));
exports.default = {
    name: "trackEnd",
    type: "moon",
    async execute(player, track) {
        (0, updateDjMessage_1.default)(player.guildId);
    },
};
