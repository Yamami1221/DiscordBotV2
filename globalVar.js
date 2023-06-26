const fs = require('fs');

try {
    const { video_info, stream_from_info, playlist_info, search, validate, setToken, getFreeClientID, is_expired, refreshToken } = require('play-dl');
    (async () => {
        const SOclientID = await getFreeClientID();
        await setToken({
            youtube: {
                cookie: process.env.YT_COOKIE,
            },
            spotify : {
                client_id: process.env.SPOTIFY_CLIENT_ID,
                client_secret: process.env.SPOTIFY_CLIENT_SECRET,
                refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
                market: 'TH',
            },
            soundcloud : {
                client_id: SOclientID,
            },
        });
        if (is_expired()) {
            await refreshToken();
        }
    })();

    const musicPlayerDatasPath = './data/musicPlayerDatas.json';
    const verifiedDatasPath = './data/verifiedDatas.json';
    const welcomeDatasPath = './data/welcomeDatas.json';

    if (!fs.existsSync('./data')) {
        fs.mkdirSync('./data');
    }

    if (!fs.existsSync(musicPlayerDatasPath)) {
        fs.writeFileSync(musicPlayerDatasPath, JSON.stringify({}));
    }

    if (!fs.existsSync(verifiedDatasPath)) {
        fs.writeFileSync(verifiedDatasPath, JSON.stringify({}));
    }

    if (!fs.existsSync(welcomeDatasPath)) {
        fs.writeFileSync(welcomeDatasPath, JSON.stringify({}));
    }

    const audioPlayerDatas = new Map();
    const musicPlayerDatasRaw = fs.readFileSync(musicPlayerDatasPath);
    const musicPlayerDatasParsed = JSON.parse(musicPlayerDatasRaw);
    const musicPlayerDatas = new Map(Object.entries(musicPlayerDatasParsed));
    const verifiedDatasRaw = fs.readFileSync(verifiedDatasPath);
    const verifiedDatasParsed = JSON.parse(verifiedDatasRaw);
    const verifiedDatas = new Map(Object.entries(verifiedDatasParsed));
    const welcomeDatasRaw = fs.readFileSync(welcomeDatasPath);
    const welcomeDatasParsed = JSON.parse(welcomeDatasRaw);
    const welcomeDatas = new Map(Object.entries(welcomeDatasParsed));
    module.exports = { video_info, stream_from_info, playlist_info, validate, search, audioPlayerDatas, musicPlayerDatas, verifiedDatas, welcomeDatas, musicPlayerDatasPath, verifiedDatasPath, welcomeDatasPath };
} catch (error) {
    console.error(error);
}