const { Map } = require('../../database/models/Maps');
const fs = require('fs').promises;
const CloudStorage = require("../../database/cloudStorage");
const CLOUDSTORAGE = new CloudStorage()

async function getServerMap(serverID) {
    const map = await Map.findOne({ where: { id: serverID } })
    return map ? [map] : []
}

async function getAllMaps() {
    return Map.findAll()
}

async function uploadMapImageApi(id, body) {
    // base64 to image
    return new Promise(async (resolve, reject) => {
        const base64Data = body.file.replace(/^data:([A-Za-z-+/]+);base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        const fileName = `map_${body.fileName}`;
        const filePath = `./maps/${fileName}`;

        try{
            await fs.writeFile(filePath, buffer);
            await sleep(1000);
            await CLOUDSTORAGE.uploadFile(filePath); 
            await fs.unlink(filePath);
            return resolve(await CLOUDSTORAGE.getFileByName(fileName));
        }
        catch(err){
            console.log(err);
            return reject(err);
        }
    });
}

async function createMap(id, body) {
    // create new map-entry in database with default values and the map_url
    const map = await Map.create({
        id: id,
        map_url: body.map_url,
        locations: [],
        server: id
    });
    return map;
}

async function sleep(interval) {
    return new Promise(resolve => setTimeout(resolve, interval));
}

module.exports = {
    getServerMap, getAllMaps,createMap,uploadMapImageApi
};