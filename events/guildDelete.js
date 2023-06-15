const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildDelete,
    async execute(guild) {
        console.log(`Left a guild: ${guild.name}`);
        const embed = new EmbedBuilder()
            .setTitle('👋Bye!')
            .setDescription('Bye! Thanks for having me in your server!\nHope to see you again!');
        await guild.systemChannel.send({ embeds: [embed] });
    },
};