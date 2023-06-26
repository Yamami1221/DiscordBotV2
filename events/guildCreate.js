const { Events, EmbedBuilder } = require('discord.js');
const fs = require('fs');

const { musicPlayerDatas, musicPlayerDatasPath } = require('../globalVar');

module.exports = {
    name: Events.GuildCreate,
    async execute(guild) {
        const embed = new EmbedBuilder()
            .setTitle('👋Hello!')
            .setDescription(`Hello! I'm **${guild.client.user.username}**. Thanks for inviting me to your server!`);
        await guild.systemChannel.send({ embeds: [embed] });
        const guildMusicPlayer = {
            queue: [],
            isPlaying: false,
            volume: 0.2,
            loop: false,
            autoPlay: false,
            sound8d: false,
            nightcore: false,
            vaporwave: false,
            bassboost: false,
            timer: null,
        };
        musicPlayerDatas.set(guild.id, guildMusicPlayer);
        const guildMusicPlayerDataObject = Object.fromEntries(musicPlayerDatas);
        fs.writeFileSync(musicPlayerDatasPath, JSON.stringify(guildMusicPlayerDataObject, null, 4));
    },
};