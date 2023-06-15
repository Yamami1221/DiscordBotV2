const { Events } = require('discord.js');
const fs = require('fs');

const { musicPlayerDatas, musicPlayerDatasPath } = require('../globalVar');

module.exports = {
    name: Events.GuildDelete,
    async execute(guild) {
        musicPlayerDatas.delete(guild.id);
        const guildMusicPlayerDataObject = Object.fromEntries(musicPlayerDatas);
        fs.writeFileSync(musicPlayerDatasPath, JSON.stringify(guildMusicPlayerDataObject, null, 4));
    },
};