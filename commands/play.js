const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior, StreamType, AudioPlayerStatus } = require('@discordjs/voice');
const { video_info, stream_from_info, setToken } = require('play-dl');

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
            await interaction.deferReply();
            const query = interaction.options.getString('query');
            const voiceChannel = interaction.member.voice.channel;
            if (!voiceChannel) {
                const embed = new EmbedBuilder()
                    .setTitle('🎹play')
                    .setDescription('You need to be in a voice channel to play music');
                await interaction.editReply({ embeds: [embed] });
                return;
            }
            await setToken({
                youtube: {
                    cookie: process.env.YT_COOKIE,
                },
            });
            const songInfo = await video_info(query);
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            });
            const player = createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Pause,
                },
            });
            const streamInfo = await stream_from_info(songInfo, { discordPlayerCompatibility: true, quality: 2 });
            const resource = createAudioResource(streamInfo.stream, { inputType: StreamType.Arbitrary, inlineVolume: true });
            resource.volume.setVolume(0.2);
            player.play(resource);
            connection.subscribe(player);
            const embed = new EmbedBuilder()
                .setTitle('🎹play')
                .setDescription(`Now playing: [${songInfo.video_details.title}](${songInfo.video_details.url})`);
            await interaction.editReply({ embeds: [embed] });

            player.on(AudioPlayerStatus.Idle, () => {
                connection.destroy();
            });
        } catch (error) {
            console.error(error);
            const errorEmbed = new EmbedBuilder()
                .setTitle('❌Error')
                .setDescription('There was an error while trying to play the song');
            await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
        }
    },
};