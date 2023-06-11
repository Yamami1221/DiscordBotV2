const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Delete messages in a channel')
        .addIntegerOption(option =>
            option
                .setName('amount')
                .setDescription('Amount of messages to delete')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setDMPermission(false),
    async execute(interaction) {
        try {
            await interaction.deferReply();
            const amount = interaction.options.getInteger('amount');
            const messages = await interaction.channel.messages.fetch({ limit: amount + 1 });
            await interaction.channel.bulkDelete(messages);
            const embed = new EmbedBuilder()
                .setTitle('🗑Clear')
                .setDescription(`Deleted ${messages.size - 1} messages`);
            const reply = await interaction.channel.send({ embeds: [embed] });
            setTimeout(() => {
                if (interaction.channel.messages.cache.has(reply.id)) {
                    reply.delete();
                }
            }, 5000);
        } catch (error) {
            console.error(error);
            const errorEmbed = new EmbedBuilder()
                .setTitle('❌Error')
                .setDescription('An error occured while deleting messages');
            await interaction.channel.send({ embeds: [errorEmbed] });
        }
    },
};