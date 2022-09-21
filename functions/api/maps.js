const { Map } = require('../../database/models/Maps');

async function getServerMap(serverID) {
    const map = await Map.findOne({ where: { id: serverID } })
    return map ? [map] : []
}

async function getAllMaps() {
    return Map.findAll()
}

module.exports = {
    getServerMap, getAllMaps
};