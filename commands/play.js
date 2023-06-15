const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a by link or search')
        .addStringOption(option =>
            option
                .setName('query')
                .setDescription('The song url or search query')
                .setRequired(true),
        ),
    async execute(interaction) {
        try {
            interaction.deferReply({ ephemeral: true });
            const embed = new EmbedBuilder()
                .setTitle('🎹 Play')
                .setDescription('This command is not implemented yet');
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            const errorEmbed = new EmbedBuilder()
                .setTitle('❌Error')
                .setDescription('There was an error while trying to play the song');
            await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
        }
    },
};