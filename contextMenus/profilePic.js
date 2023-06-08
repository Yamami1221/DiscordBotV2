const { ContextMenuCommandBuilder, EmbedBuilder, ApplicationCommandType } = require('discord.js');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Profile Picture')
        .setType(ApplicationCommandType.User)
        .setDMPermission(false),
    async execute(interaction) {
        await interaction.deferReply();
        const targetUser = interaction.guild.members.cache.get(interaction.targetId);
        const embed = new EmbedBuilder()
            .setTitle(`${targetUser.user.username}'s Profile Picture`)
            .setImage(targetUser.user.displayAvatarURL({ dynamic: true, size: 4096 }))
            .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();
        await interaction.editReply({ embeds: [embed] });
    },
};