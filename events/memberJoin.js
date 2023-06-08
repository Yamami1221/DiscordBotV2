const { Events, EmbedBuilder } = require('discord.js');

const { welcomeDatas } = require('../globalVar');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        try {
            if (!welcomeDatas.has(member.guild.id)) return;
            const welcomeData = welcomeDatas.get(member.guild.id);
            const welcomeChannel = member.guild.channels.cache.find(channel => channel.id === welcomeData.welcomeChannelId);
            const embed = new EmbedBuilder()
                .setTitle('Welcome!')
                .setDescription(`Welcome to **${member.guild.name}** ,<@${member.user.id}>! ${welcomeData.welcomeMessage}`);
            await welcomeChannel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
        }
    },
};