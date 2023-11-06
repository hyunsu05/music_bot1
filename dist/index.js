"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
const path_1 = require("path");
const moonlink_js_1 = require("moonlink.js");
const packageJson = require("../package.json");
globalThis.dj_message = new Map();
globalThis.music_lapse = new Map();
class clientStr extends discord_js_1.Client {
    constructor() {
        super({
            intents: [131071],
            sweepers: {
                ...discord_js_1.Options.DefaultSweeperSettings,
                messages: {
                    interval: 600,
                    filter: () => (message) => !message.guild ||
                        !globalThis.dj_message.get(message.guild.id) ||
                        globalThis.dj_message.get(message.guild.id) != message.id,
                },
            },
        });
        this.moon = new moonlink_js_1.MoonlinkManager([{ host: "127.0.0.1", port: 2333, secure: false, password: "dazzy" }], {}, (guild, sPayload) => {
            this.guilds.cache.get(guild)?.shard.send(JSON.parse(sPayload));
        });
    }
    async checkUpdate() {
        await fetch("https://raw.githubusercontent.com/dazzypark/discord_music_bot/master/package.json").then(async (f) => {
            const jsonContent = await f.json();
            if (jsonContent.version != packageJson.version) {
                console.log(`새로운 패치가 있습니다 - 이 패치는 보안 강화와 버그 수정을 포함합니다 (${jsonContent.version}v -> ${packageJson.version}v)\nhttps://github.com/dazzypark/discord_music_bot 링크에서 봇을 다시 다운로드 해주세요`);
                process.exit();
            }
        });
    }
    async commandsLoad() {
        this.commands = new discord_js_1.Collection();
        const commnads_push_only = [];
        (0, fs_1.readdirSync)((0, path_1.join)(__dirname, "Commands")).forEach((dirs) => {
            const commands = (0, fs_1.readdirSync)((0, path_1.join)(__dirname, `Commands/${dirs}`)).filter((files) => files.endsWith(".js"));
            for (const file of commands) {
                const command = require((0, path_1.join)(__dirname, `Commands/${dirs}/${file}`)).default;
                command.category = dirs;
                this.commands.set(command.data.name, command);
                commnads_push_only.push(command.data.toJSON());
                delete require.cache[require.resolve((0, path_1.join)(__dirname, `Commands/${dirs}/${file}`))];
            }
        });
        const rest = new discord_js_1.REST({ version: "10" }).setToken(process.env.TOKEN);
        try {
            await rest.put(discord_js_1.Routes.applicationCommands(process.env.CLIENT_ID), {
                body: commnads_push_only,
            });
        }
        catch (error) {
            console.error(error);
        }
    }
    eventsLoad() {
        const eventFiles = (0, fs_1.readdirSync)((0, path_1.join)(__dirname, `Events`)).filter((file) => file.endsWith(".js"));
        for (const file of eventFiles) {
            const event = require((0, path_1.join)(__dirname, `Events/${file}`)).default;
            if (event) {
                if (event.type == "moon") {
                    this.moon.on(event.name, (...args) => event.execute(...args));
                }
                else {
                    if (event.once == true) {
                        this.once(event.name, (...args) => event.execute(...args));
                    }
                    else {
                        this.on(event.name, (...args) => event.execute(...args));
                    }
                }
                delete require.cache[require.resolve((0, path_1.join)(__dirname, `Events/${file}`))];
            }
        }
    }
    buttonsLoad() {
        this.buttons = new discord_js_1.Collection();
        const buttonFiles = (0, fs_1.readdirSync)((0, path_1.join)(__dirname, `Buttons`)).filter((file) => file.endsWith(".js"));
        for (const file of buttonFiles) {
            const button = require((0, path_1.join)(__dirname, `Buttons/${file}`)).default;
            this.buttons.set(button.name, button);
            delete require.cache[require.resolve((0, path_1.join)(__dirname, `Buttons/${file}`))];
        }
    }
    async start() {
        this.login(process.env.TOKEN);
        this.checkUpdate();
        this.commandsLoad();
        this.eventsLoad();
        this.buttonsLoad();
    }
}
process.on("uncaughtException", function (exception) {
    console.log("[GLOBAL] 에러남");
    console.log(exception);
});
const client = new clientStr();
client.start();
exports.default = client;
