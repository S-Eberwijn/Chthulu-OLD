const { Map } = require('../../database/models/Maps');
const fs = require('fs');

async function getServerMap(serverID) {
    const map = await Map.findOne({ where: { id: serverID } })
    return map ? [map] : []
}

async function getAllMaps() {
    return Map.findAll()
}

async function uploadMapImageApi(id, body) {
    // base64 to image
    const base64Data = body.file.replace(/^data:([A-Za-z-+/]+);base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const fileName = `map_${body.fileName}`;
    const filePath = `./fileDump/${fileName}`;
    fs.writeFileSync(filePath, buffer);

    console.log("endpoint reached")
}

module.exports = {
    getServerMap, getAllMaps,uploadMapImageApi
};