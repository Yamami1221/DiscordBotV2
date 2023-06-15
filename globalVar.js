const fs = require('fs');

try {
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

    const musicPlayerDatasRaw = fs.readFileSync(musicPlayerDatasPath);
    const musicPlayerDatasParsed = JSON.parse(musicPlayerDatasRaw);
    const musicPlayerDatas = new Map(Object.entries(musicPlayerDatasParsed));
    const verifiedDatasRaw = fs.readFileSync(verifiedDatasPath);
    const verifiedDatasParsed = JSON.parse(verifiedDatasRaw);
    const verifiedDatas = new Map(Object.entries(verifiedDatasParsed));
    const welcomeDatasRaw = fs.readFileSync(welcomeDatasPath);
    const welcomeDatasParsed = JSON.parse(welcomeDatasRaw);
    const welcomeDatas = new Map(Object.entries(welcomeDatasParsed));
    module.exports = { musicPlayerDatas, verifiedDatas, welcomeDatas, musicPlayerDatasPath, verifiedDatasPath, welcomeDatasPath };
} catch (error) {
    console.error(error);
}