const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');

const { welcomeDatas, verifiedDatas, welcomeDatasPath, verifiedDatasPath } = require('../globalVar');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reset')
        .setDescription('reset the bot settings')
        .addSubcommand(subcommand =>
            subcommand
                .setName('welcome')
                .setDescription('reset the welcome channel'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('roles')
                .setDescription('reset the verified system'))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'welcome') {
            try {
                await interaction.deferReply({ ephemeral: true });
                if (welcomeDatas.has(interaction.guildId)) {
                    welcomeDatas.delete(interaction.guildId);
                    const welcomeDatasObject = Object.fromEntries(welcomeDatas);
                    fs.writeFileSync(welcomeDatasPath, JSON.stringify(welcomeDatasObject, null, 4));
                    const embed = new EmbedBuilder()
                        .setTitle('🔄Reset')
                        .setDescription('Welcome channel reset');
                    await interaction.editReply({ embeds: [embed] });
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle('🔄Reset')
                        .setDescription('Welcome channel not set');
                    await interaction.editReply({ embeds: [embed] });
                }
            } catch (error) {
                console.error(error);
                const errorEmbed = new EmbedBuilder()
                    .setTitle('❌Error')
                    .setDescription('There was an error while resetting the welcome channel');
                await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
            }
        } else if (subcommand === 'roles') {
            try {
                await interaction.deferReply({ ephemeral: true });
                if (verifiedDatas.has(interaction.guildId)) {
                    verifiedDatas.delete(interaction.guildId);
                    const verifiedRolesObject = Object.fromEntries(verifiedDatas);
                    fs.writeFileSync(verifiedDatasPath, JSON.stringify(verifiedRolesObject, null, 4));
                    const embed = new EmbedBuilder()
                        .setTitle('🔄Reset')
                        .setDescription('Verified roles reset');
                    await interaction.editReply({ embeds: [embed] });
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle('🔄Reset')
                        .setDescription('Verified roles not set');
                    await interaction.editReply({ embeds: [embed] });
                }
            } catch (error) {
                console.error(error);
                const errorEmbed = new EmbedBuilder()
                    .setTitle('❌Error')
                    .setDescription('There was an error while resetting the verified roles');
                await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    },
};