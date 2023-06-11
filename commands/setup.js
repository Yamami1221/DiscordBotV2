const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');

const { welcomeDatas, verifiedDatas, welcomeDatasPath, verifiedDatasPath } = require('../globalVar');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('setup the bot settings')
        .addSubcommand(subcommand =>
            subcommand
                .setName('welcome')
                .setDescription('setup the welcome channel')
                .addChannelOption(option =>
                    option
                        .setName('welcome')
                        .setDescription('the channel to send the welcome message in')
                        .setRequired(true),
                )
                .addStringOption(option =>
                    option
                        .setName('message')
                        .setDescription('the welcome message')
                        .setRequired(true),
                ),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('verifysystem')
                .setDescription('setup the verified system')
                .addRoleOption(option =>
                    option
                        .setName('verifiedrole')
                        .setDescription('the Verified role')
                        .setRequired(true),
                )
                .addChannelOption(option =>
                    option
                        .setName('verifychannel')
                        .setDescription('the channel to send the verify message in')
                        .setRequired(true),
                ),
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'welcome') {
            await interaction.deferReply({ ephemeral: true });
            try {
                if (welcomeDatas.has(interaction.guildId)) {
                    const embed = new EmbedBuilder()
                        .setTitle('🔨Setup')
                        .setDescription('Welcome channel already set');
                    await interaction.editReply({ embeds: [embed] });
                } else {
                    const welcomeChannel = interaction.options.getChannel('welcome');
                    const welcomeMessage = interaction.options.getString('message');

                    const data = {
                        welcomeChannelId: welcomeChannel.id,
                        welcomeMessage: welcomeMessage,
                    };
                    welcomeDatas.set(interaction.guild.id, data);

                    const welcomeChannelObject = Object.fromEntries(welcomeDatas);
                    fs.writeFileSync(welcomeDatasPath, JSON.stringify(welcomeChannelObject, null, 4));

                    const embed = new EmbedBuilder()
                        .setTitle('🔨Setup')
                        .setDescription(`Welcome channel set to <#${welcomeChannel.id}>`);
                    await interaction.editReply({ embeds: [embed] });
                }
            } catch (error) {
                console.error(error);
                const errorEmbed = new EmbedBuilder()
                    .setTitle('❌Error')
                    .setDescription('There was an error while setting up the welcome channel');
                await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
            }
        } else if (subcommand === 'roles') {
            await interaction.deferReply({ ephemeral: true });
            try {
                if (verifiedDatas.has(interaction.guildId)) {
                    const embed = new EmbedBuilder()
                        .setTitle('🔨Setup')
                        .setDescription('Verified roles already set');
                    await interaction.editReply({ embeds: [embed] });
                } else {
                    const verifiedRole = interaction.options.getRole('verified');

                    const data = {
                        verifiedRoleId: verifiedRole.id,
                    };
                    verifiedDatas.set(interaction.guild.id, data);

                    const verifiedRolesObject = Object.fromEntries(verifiedDatas);
                    fs.writeFileSync(verifiedDatasPath, JSON.stringify(verifiedRolesObject, null, 4));

                    const embed = new EmbedBuilder()
                        .setTitle('🔨Setup')
                        .setDescription(`Verified role set to <@&${verifiedRole.id}>`);
                    await interaction.editReply({ embeds: [embed] });
                }
            } catch (error) {
                console.error(error);
                const errorEmbed = new EmbedBuilder()
                    .setTitle('❌Error')
                    .setDescription('There was an error while setting up the verified roles');
                await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    },
};