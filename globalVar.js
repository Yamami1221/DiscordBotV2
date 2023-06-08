const fs = require('fs');

try {
    const verifiedDatasPath = './data/verifiedDatas.json';
    const verifySessionsPath = './data/verifySessions.json';
    const welcomeDatasPath = './data/welcomeDatas.json';

    if (!fs.existsSync('./data')) {
        fs.mkdirSync('./data');
    }

    if (!fs.existsSync(verifiedDatasPath)) {
        fs.writeFileSync(verifiedDatasPath, JSON.stringify({}));
    }

    if (!fs.existsSync(verifySessionsPath)) {
        fs.writeFileSync(verifySessionsPath, JSON.stringify({}));
    }

    if (!fs.existsSync(welcomeDatasPath)) {
        fs.writeFileSync(welcomeDatasPath, JSON.stringify({}));
    }

    const verifiedDatasRaw = fs.readFileSync(verifiedDatasPath);
    const verifiedDatasParsed = JSON.parse(verifiedDatasRaw);
    const verifiedDatas = new Map(Object.entries(verifiedDatasParsed));
    const verifySessionsRaw = fs.readFileSync(verifySessionsPath);
    const verifySessionsParsed = JSON.parse(verifySessionsRaw);
    const verifySessions = new Map(Object.entries(verifySessionsParsed));
    const welcomeDatasRaw = fs.readFileSync(welcomeDatasPath);
    const welcomeDatasParsed = JSON.parse(welcomeDatasRaw);
    const welcomeDatas = new Map(Object.entries(welcomeDatasParsed));
    module.exports = { verifiedDatas, verifySessions, welcomeDatas, verifiedDatasPath, verifySessionsPath, welcomeDatasPath };
} catch (error) {
    console.error(error);
}