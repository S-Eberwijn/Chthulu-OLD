
const { logger } = require(`../../../functions/logger`)
const { paginationEmbed } = require('../../otherFunctions/paginationEmbed')
const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require('discord.js');
const api = "https://api.open5e.com/magicitems/"
const request = require('request');

module.exports.run = async (interaction) => {
    interaction.reply("processing")
    for (let i = 1; i < 6; i++) {
        await request(api + "?page=" + i, { json: true }, async (err, res, body) => {
            if (err) { return logger.error(err); }
            let data = body.results
            let response = [];
            for(const item of data){
                response.push(item.name);
            }
            interaction.editReply(response.join())
        });
    }

}

module.exports.help = {
    // name: "magic-item-list",
    // alias: [],
    // description: "gives a list of all default magic items.",
    category: "Dungeons & Dragons",
    name: "magic-item-list",
    // alias: [],
    description: "gives a list of all default magic items.",
    options: [],
}
