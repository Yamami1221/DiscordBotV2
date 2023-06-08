const fs = require('fs');

try {
    const verifiedRolesPath = './data/verifiedRoles.json';
    const verifySessionsPath = './data/verifySessions.json';
    const welcomeDatasPath = './data/welcomeDatas.json';

    if (!fs.existsSync('./data')) {
        fs.mkdirSync('./data');
    }

    if (!fs.existsSync(verifiedRolesPath)) {
        fs.writeFileSync(verifiedRolesPath, JSON.stringify({}));
    }

    if (!fs.existsSync(verifySessionsPath)) {
        fs.writeFileSync(verifySessionsPath, JSON.stringify({}));
    }

    if (!fs.existsSync(welcomeDatasPath)) {
        fs.writeFileSync(welcomeDatasPath, JSON.stringify({}));
    }

    const verifiedRolesRaw = fs.readFileSync(verifiedRolesPath);
    const verifiedRolesParsed = JSON.parse(verifiedRolesRaw);
    const verifiedRoles = new Map(Object.entries(verifiedRolesParsed));
    const verifySessionsRaw = fs.readFileSync(verifySessionsPath);
    const verifySessionsParsed = JSON.parse(verifySessionsRaw);
    const verifySessions = new Map(Object.entries(verifySessionsParsed));
    const welcomeDatasRaw = fs.readFileSync(welcomeDatasPath);
    const welcomeDatasParsed = JSON.parse(welcomeDatasRaw);
    const welcomeDatas = new Map(Object.entries(welcomeDatasParsed));
    module.exports = { verifiedRoles, verifySessions, welcomeDatas, verifiedRolesPath, verifySessionsPath, welcomeDatasPath };
} catch (error) {
    console.error(error);
}