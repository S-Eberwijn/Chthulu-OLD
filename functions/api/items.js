const fs = require("fs").promises;
const request = require('request');
const { logger } = require(`../../functions/logger`)

const pathToJSONDatabases = `./database/json/`;
const baseURL = "https://www.dnd5eapi.co"
const API_ENDPOINT = {
    equipment: "/api/equipment/",
    magic_items: "/api/magic-items/",
}

function writeFileTransactional(path, content) {
    let temporaryPath = `${path}.new`;
    fs.writeFile(temporaryPath, content).then(() => { fs.rename(temporaryPath, path); }).catch(err => logger.warn(err.toString()));;
};

/**
 * @param {"equipment"} name - The name of the JSON database.
 */
async function getJSONDatabase(name) {
    // Get the local JSON database.
    const JSON_ITEMS = JSON.parse(await fs.readFile(`${pathToJSONDatabases}${name}.json`, "utf8"))

    // Get the API JSON database.
    const API_ITEMS = await new Promise((resolve, reject) => {
        request({
            url: baseURL + API_ENDPOINT[name],
            agentOptions: {
                rejectUnauthorized: false
            },
            json: true
        }, async function (err, resp, body) {
            return body.error ? reject(body.error) : resolve(body.results);
        });
    });

    // Check if the API JSON database has content that the local JSON database does not have.
    let difference = API_ITEMS.map(item => item.index).filter(x => !JSON_ITEMS.map(item => item.index).includes(x));

    for (const object of difference) {
        // Get the item from the API.
        let item = await getAPIItem(object, API_ITEMS.find(item => item.index === object).url);

        // Add the item to the local JSON database.
        JSON_ITEMS.push(item);

        // Write the local JSON database to the corresponding file.
        await writeFileTransactional(`${pathToJSONDatabases}${name}.json`, JSON.stringify(JSON_ITEMS, null, 4))

        // Log the item that was added to the local JSON database.
        logger.info(`Added "${item.name}" to the local JSON database "${name}".`);
    }

    return JSON_ITEMS
}

function getAPIItem(itemName, url) {
    return new Promise(function (resolve, reject) {
        request({
            url: baseURL + url,
            agentOptions: {
                rejectUnauthorized: false
            },
            json: true
        }, async function (err, resp, body) {
            return body.error ? reject({ itemName: itemName, message: body.error, status: 404 }) : resolve(body);
        });
    });
}

async function getAllItems() {
    return [...await getJSONDatabase("equipment"), ...await getJSONDatabase("magic_items")];
}

/**
 * @param {"scale male"} name - The name of a Dungeons and Dragons (5e) item.
 */
async function getItem(name) {
    name = name.toLowerCase().trim().replace(/ /g, "-");

    const ALL_ITEMS = [...await getJSONDatabase("equipment"), ...await getJSONDatabase("magic_items")];

    return ALL_ITEMS.find(item => item.index === name)
}

async function getAllItemImagesNames() {
    return (await fs.readdir(`./website/public/images/items/`)).map(image => image.split(".")[0]);
}


(async () => {
    // console.log(await getAllItemImagesNames())
    // console.log((await getJSONDatabase("equipment")).length)
    // console.log((await getAllItems()).length)
})()

module.exports = {
    getItem, getAllItems, getAllItemImagesNames
};
