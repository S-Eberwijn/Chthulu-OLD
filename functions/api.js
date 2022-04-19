const fetch = require('node-fetch');
const { user } = require('../index');
const DISCORD_API = 'https://discord.com/api/v6';
const { decrypt } = require('./cryptography');

function getBotGuilds() {
    const bot = require('../index');
    return bot.guilds.cache;
}

function getGuildFromBot(guildID) {
    const bot = require('../index');
    return bot.guilds.cache.get(guildID);
}

async function getUserFromBot(userID) {
    const bot = require('../index');
    return await bot.users.fetch(userID);
}

async function getUserGuilds(token) {
    if (!token) {
        console.log('No token provided to get user guilds. Returning empty array.');
        return [{}];
    }
    //TODO: Fix rate limitting? Only on first attempt after authorizing with OATH2
    const response = await fetch(`${DISCORD_API}/users/@me/guilds`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${decrypt(token)}`,
        }
    })
    // console.log(await response.json())
    return await response.json();
}


function getMutualGuilds(userGuilds, botGuilds) {
    // console.log(userGuilds);
    if (userGuilds.message) {
        console.log('No user guilds provided to get mutual guilds. Returning empty array.');
        return [];
    }
    return botGuilds.filter(guild => userGuilds.map(guild => guild.id).includes(guild.id)).map(guild => guild);
}


// async function getMutualGuilds(userID) {
//     //TODO: improve performance, this is kinda slow
//     if (!userID) {
//         console.log('No user ID provided to get mutual guilds. Returning empty array.');
//         return [];
//     }
//     const botGuilds = getBotGuilds();
//     let mutualGuilds = [];
//     for (const [key, value] of botGuilds.entries()) {
//         if (await isUserInGuild(userID, value)) mutualGuilds.push(value);
//     }
//     return mutualGuilds;
// }


// async function getMutualGuilds(userID) {
//     const botGuilds = getBotGuilds();

//     const result = (
//         await Promise.all(
//             botGuilds.map(async (guild) => {
//                 let keep = false;
//                 keep = await isUserInGuild(userID, guild);
//                 return { data: guild, keep };
//             })
//         )
//     )
//         .filter((data) => data.keep)
//         .map((guild) => guild.data);
//     console.log(result)
//     return result;
// }


// console.log(botGuilds.filter(async guild => await (await guild.members.fetch()).map(member => member.id).includes(userID)));


async function isUserInGuild(userID, guild) {
    const guildMembers = await guild.members.fetch();
    return guildMembers.map(member => member.id).includes(userID);
}


module.exports = { getBotGuilds, getUserGuilds, getMutualGuilds, getGuildFromBot }