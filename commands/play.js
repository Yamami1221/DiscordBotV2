const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection, NoSubscriberBehavior, StreamType, AudioPlayerStatus } = require('@discordjs/voice');

const { video_info, stream_from_info, playlist_info, search, audioPlayerDatas, musicPlayerDatas, validate } = require('../globalVar');

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
            const voiceChannel = interaction.member?.voice?.channel;
            if (!voiceChannel) {
                const embed = new EmbedBuilder()
                    .setTitle('🎹play')
                    .setDescription('You need to be in a voice channel to play music');
                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }
            if (voiceChannel.type !== ChannelType.GuildVoice) {
                const embed = new EmbedBuilder()
                    .setTitle('🎹play')
                    .setDescription('You need to be in a voice channel to play music');
                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }
            const connection = getVoiceConnection(interaction.guildId);
            let guildMusicPlayer = musicPlayerDatas.get(interaction.guildId);
            if (!guildMusicPlayer) {
                const musicPlayer = {
                    queue: [],
                    isPlaying: false,
                    volume: 0.2,
                    loop: false,
                    autoPlay: false,
                    sound8d: false,
                    nightcore: false,
                    vaporwave: false,
                    bassboost: false,
                    timer: null,
                };
                musicPlayerDatas.set(interaction.guildId, musicPlayer);
                guildMusicPlayer = musicPlayerDatas.get(interaction.guildId);
            }
            if (connection && guildMusicPlayer.queue.length > 0) {
                if (connection.joinConfig.channelId == voiceChannel.id) {
                    try {
                        await interaction.deferReply();
                        await searchSong(interaction);
                    } catch (error) {
                        console.error(error);
                        const errorEmbed = new EmbedBuilder()
                            .setTitle('❌Error')
                            .setDescription('There was an error while trying to get the song info');
                        await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
                    }
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle('🎹play')
                        .setDescription('You need to be in the same voice channel as me to play music');
                    await interaction.reply({ embeds: [embed], ephemeral: true });
                }
            } else {
                await interaction.deferReply();
                await searchSong(interaction);
                playSong(interaction);
            }
        } catch (error) {
            console.error(error);
            const errorEmbed = new EmbedBuilder()
                .setTitle('❌Error')
                .setDescription('There was an error while trying to play the song');
            await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
        }
    },
};

async function searchSong(interaction) {
    try {
        const query = interaction.options.getString('query');
        const guildMusicPlayer = musicPlayerDatas.get(interaction.guildId);
        if (await validate(query) == 'yt_video') {
            const songInfo = await video_info(query);
            const songData = {
                info: songInfo,
                requester: interaction.user,
            };
            guildMusicPlayer.queue.push(songData);
            const embed = new EmbedBuilder()
                .setTitle('🎹play')
                .setDescription(`Added to queue: [${songInfo.video_details.title}](${songInfo.video_details.url})`)
                .setThumbnail(songInfo.video_details.thumbnails[songInfo.video_details.thumbnails.length - 1].url)
                .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.avatarURL() });
            await interaction.editReply({ embeds: [embed] });
        } else if (await validate(query) == 'yt_playlist') {
            const playlistInfo = await playlist_info(query, { incomplete: true });
            const embed1 = new EmbedBuilder()
                .setTitle('🎹play')
                .setDescription(`Adding to queue: [${playlistInfo.title}](${playlistInfo.url})`)
                .setThumbnail(playlistInfo.thumbnail || playlistInfo.videos[0].thumbnail)
                .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.avatarURL() });
            await interaction.editReply({ embeds: [embed1] });
            for (const video of playlistInfo.videos) {
                const songInfo = await video_info(video.url);
                const songData = {
                    info: songInfo,
                    requester: interaction.user,
                };
                guildMusicPlayer.queue.push(songData);
            }
        } else if (await validate(query) == 'search') {
            const searchResults = await search(query, { limit: 1 });
            const songInfo = await video_info(searchResults[0].url);
            const songData = {
                info: songInfo,
                requester: interaction.user,
            };
            guildMusicPlayer.queue.push(songData);
            const embed = new EmbedBuilder()
                .setTitle('🎹play')
                .setDescription(`Added to queue: [${songInfo.video_details.title}](${songInfo.video_details.url})`)
                .setThumbnail(songInfo.video_details.thumbnails[songInfo.video_details.thumbnails.length - 1].url)
                .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.avatarURL() });
            await interaction.editReply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
                .setTitle('🎹play')
                .setDescription('Sorry, I could not find the song you were looking for');
            await interaction.editReply({ embeds: [embed], ephemeral: true });
        }
    } catch (error) {
        console.error(error);
        const errorEmbed = new EmbedBuilder()
            .setTitle('❌Error')
            .setDescription('There was an error while trying to get the song info');
        await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
    }
}

async function playSong(interaction) {
    const guildMusicPlayer = musicPlayerDatas.get(interaction.guildId);
    const songData = guildMusicPlayer.queue[0];
    if (!songData) {
        guildMusicPlayer.isPlaying = false;
        guildMusicPlayer.timer = setTimeout(() => {
            const connection = getVoiceConnection(interaction.guildId);
            if (connection) {
                connection.destroy();
            }
        }, 30 * 1000);
        audioPlayerDatas.delete(interaction.guildId);
        return;
    }
    const songInfo = songData.info;
    const voiceConnection = getVoiceConnection(interaction.guildId);
    let audioPlayerData = audioPlayerDatas.get(interaction.guildId);
    if (!audioPlayerData) {
        const apd = {
            audioPlayer: null,
            resource: null,
        };
        audioPlayerDatas.set(interaction.guildId, apd);
        audioPlayerData = audioPlayerDatas.get(interaction.guildId);
    }
    if (!voiceConnection) {
        const connection = joinVoiceChannel({
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });
        audioPlayerData.audioResource = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause,
            },
        });
        connection.subscribe(audioPlayerData.audioPlayer);
        const stream = await stream_from_info(songInfo, { discordPlayerCompatibility: true, quality: 2 });
        audioPlayerData.resource = createAudioResource(stream.stream, {
            inputType: StreamType.Arbitrary,
            inlineVolume: true,
        });
        audioPlayerData.resource.volume.setVolume(guildMusicPlayer.volume);
        audioPlayerData.audioPlayer.play(audioPlayerData.resource);
        guildMusicPlayer.isPlaying = true;

        const embed = new EmbedBuilder()
            .setTitle('🎹play')
            .setDescription(`Now playing: [${songInfo.video_details.title}](${songInfo.video_details.url})`)
            .setThumbnail(songInfo.video_details.thumbnails[songInfo.video_details.thumbnails.length - 1].url)
            .setFooter({ text: `Requested by ${songData.requester.tag}`, iconURL: songData.requester.avatarURL() });
        await interaction.channel.send({ embeds: [embed] });
    } else {
        const connection = getVoiceConnection(interaction.guildId);
        const stream = await stream_from_info(songInfo, { discordPlayerCompatibility: true, quality: 2 });
        audioPlayerData.resource = createAudioResource(stream.stream, {
            inputType: StreamType.Arbitrary,
            inlineVolume: true,
        });
        audioPlayerData.resource.volume.setVolume(guildMusicPlayer.volume);
        audioPlayerData.audioPlayer.play(audioPlayerData.resource);
        connection.subscribe(audioPlayerData.audioPlayer);
        guildMusicPlayer.isPlaying = true;

        const embed = new EmbedBuilder()
            .setTitle('🎹play')
            .setDescription(`Now playing: [${songInfo.video_details.title}](${songInfo.video_details.url})`)
            .setThumbnail(songInfo.video_details.thumbnails[songInfo.video_details.thumbnails.length - 1].url)
            .setFooter({ text: `Requested by ${songData.requester.tag}`, iconURL: songData.requester.avatarURL() });
        await interaction.channel.send({ embeds: [embed] });
    }

    audioPlayerData.audioPlayer.on(AudioPlayerStatus.Idle, async () => {
        if (guildMusicPlayer.loop) {
            playSong(interaction);
            return;
        }
        if (guildMusicPlayer.autoPlay) {
            if (guildMusicPlayer.queue.length > 1) {
                guildMusicPlayer.queue.shift();
                playSong(interaction);
            } else {
                const relatedVideos = guildMusicPlayer.queue.shift();
                const relatedVideo = relatedVideos.related_videos[0];
                const relatedVideoInfo = await video_info(relatedVideo.url);
                const relatedVideoData = {
                    info: relatedVideoInfo,
                    requester: interaction.user,
                };
                guildMusicPlayer.queue.push(relatedVideoData);
                playSong(interaction);
            }
        }
    });
}