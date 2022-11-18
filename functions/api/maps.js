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
            await CLOUDSTORAGE.uploadFile(filePath); 
            await fs.unlink(filePath);
            
            // create new map-entry in database with default values and the map_url
            const map = await Map.create({
                id: id,
                map_url: await CLOUDSTORAGE.getFileByName(fileName),
                locations: [],
                server: id
            });
            return resolve(map);
        }
        catch(err){
            console.log(err);
        }
    });
}


module.exports = {
    getServerMap, getAllMaps,uploadMapImageApi
};