const { Events, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;
        if (message.channel.type === ChannelType.DM) return;
        if (message.content.startsWith('!ping')) {
            const roundTripLatency = Date.now() - message.createdTimestamp;
            const APIlatency = message.client.ws.ping;
            const embed = new EmbedBuilder()
                .setTitle('🏓Pong!')
                .setDescription(`Roundtrip latency: **${roundTripLatency}ms**\n API latency: **${APIlatency}ms**`);
            await message.channel.send({ embeds: [embed] });
            return;
        }
    },
};