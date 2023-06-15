const { Events, EmbedBuilder } = require('discord.js');
const fs = require('fs');

const { musicPlayerDatas, musicPlayerDatasPath } = require('../globalVar');

module.exports = {
    name: Events.GuildDelete,
    async execute(guild) {
        console.log(`Left a guild: ${guild.name}`);
        const embed = new EmbedBuilder()
            .setTitle('👋Bye!')
            .setDescription('Bye! Thanks for having me in your server!\nHope to see you again!');
        await guild.systemChannel.send({ embeds: [embed] });
        musicPlayerDatas.delete(guild.id);
        const guildMusicPlayerDataObject = Object.fromEntries(musicPlayerDatas);
        fs.writeFileSync(musicPlayerDatasPath, JSON.stringify(guildMusicPlayerDataObject, null, 4));
    },
};