const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildCreate,
    async execute(guild) {
        console.log(`Joined a new guild: ${guild.name}`);
        const embed = new EmbedBuilder()
            .setTitle('👋Hello!')
            .setDescription(`Hello! I'm **${guild.client.user.username}**. Thanks for inviting me to your server!`);
        await guild.systemChannel.send({ embeds: [embed] });
    },
};