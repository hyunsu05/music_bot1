"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (timestamp) => {
    const minutes = Math.floor(timestamp / 60000);
    const seconds = Math.floor((timestamp % 60000) / 1000);
    const music_duration = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    return music_duration;
};
