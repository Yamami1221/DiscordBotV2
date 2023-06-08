const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const { verifiedDatas } = require('../globalVar');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Get verified to access the server'),
    async execute(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true });
            if (!verifiedDatas.has(interaction.guild.id)) {
                const embed = new EmbedBuilder()
                    .setTitle('✅Verify')
                    .setDescription('This server has not set verification system yet');
                await interaction.editReply({ embeds: [embed] });
                return;
            } else {
                const verifyData = verifiedDatas.get(interaction.guild.id);
                const role = interaction.guild.roles.cache.get(verifyData.verifiedRoleId);
                if (interaction.member.roles.cache.has(role.id)) {
                    const embed = new EmbedBuilder()
                        .setTitle('✅Verify')
                        .setDescription('You are already verified');
                    await interaction.editReply({ embeds: [embed] });
                    return;
                } else {
                    interaction.member.roles.add(role);
                    const embed = new EmbedBuilder()
                        .setTitle('✅Verify')
                        .setDescription('You are now verified');
                    await interaction.editReply({ embeds: [embed] });
                    return;
                }
            }
        } catch (error) {
            console.error(error);
            const errorEmbed = new EmbedBuilder()
                .setTitle('❌Error')
                .setDescription('There was an error while trying to verify you');
            await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
        }
    },
};