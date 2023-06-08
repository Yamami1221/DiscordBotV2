const { Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
        const guildcount = await client.shard.fetchClientValues('guilds.cache.size');
        client.user.setPresence({
            activities: [{ name: `/help | ${guildcount.reduce((acc, guildCount) => acc + guildCount, 0)} Server`, type: ActivityType.Playing }],
            status: 'online',
        });
    },
};