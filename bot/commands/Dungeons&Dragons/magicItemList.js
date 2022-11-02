
const { logger } = require(`../../../functions/logger`)
const { paginationEmbed } = require('../../otherFunctions/paginationEmbed')
const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require('discord.js');
const api = "https://api.open5e.com/magicitems/"
const request = require('request');

//TODO make this method actually usefull
module.exports.run = async (interaction) => {
    return interaction.reply({content:"This command is currently disabled",ephemeral: true});
}

module.exports.help = {
    category: "Dungeons & Dragons",
    name: "magic-item-list",
    description: "gives a list of all default magic items.",
    options: [],
}
