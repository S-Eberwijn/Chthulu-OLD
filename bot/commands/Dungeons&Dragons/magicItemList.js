
const { logger } = require(`../../../functions/logger`)
const { paginationEmbed } = require('../../otherFunctions/paginationEmbed')
const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require('discord.js');
const api = "https://api.open5e.com/magicitems/"
const request = require('request');

//TODO make this method actually usefull
module.exports.run = async (interaction) => {
    return interaction.reply({content:"This command is currently disabled",ephemeral: true});
    interaction.reply("processing")
    //TODO: refactor so it's actually useful
    for (let i = 1; i < 6; i++) {
        request(api + "?page=" + i, { json: true }, async (err, res, body) => {
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
    category: "Dungeons & Dragons",
    name: "magic-item-list",
    description: "gives a list of all default magic items.",
    options: [],
}
