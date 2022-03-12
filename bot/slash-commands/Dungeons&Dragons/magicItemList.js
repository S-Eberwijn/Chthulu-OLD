
const { paginationEmbed } = require('../../otherFunctions/paginationEmbed')
const {MessageActionRow, MessageSelectMenu,MessageEmbed } = require('discord.js');
const api = "https://api.open5e.com/magicitems/"
const request = require('request');

module.exports.run = async (interaction) => {
    interaction.reply("processing")
    for(let i = 1; i < 6; i++) {
        await request(api+"?page="+i, { json: true }, async (err, res, body) => {
            if (err) { return console.log(err); }
            let data = body.results
            let response = [];
            for(let i = 0; i<data.length; i++){
                response.push(data[i].name)
            }
            interaction.editReply(response.join())
        });
    }

}

module.exports.help = {
    name: "magic-item-list",
    alias: [],
    description: "gives a list of all default magic items.",
    category: "Dungeons & Dragons"
}
