const { logger } = require(`../../../functions/logger`)
const { MessageEmbed } = require('discord.js');
const api = "https://api.open5e.com/magicitems/"
const request = require('request');

module.exports.run = async (interaction) => {
    let magicItem = interaction.options.getString('item-name').replaceAll(' ', '-').toLowerCase();

    request(api + magicItem, { json: true }, (err, res, body) => {
        if (err) { return logger.error(err); }
        if (Object.keys(body).length < 2) { return interaction.reply(magicItem + " was not found in our database."); }
        return interaction.reply({ embeds: [createEmbed(body)] })
    });
}
function createEmbed(item) {
    return new MessageEmbed()
        .setTitle(item.name)
        .setURL(api + "/" + item.slug)
        .setDescription(item.desc)
        .addFields(
            { name: 'rarity', value: item.rarity, inline: true },
            { name: 'type', value: item.type, inline: true },
            { name: 'requires atunement', value: item.requires_attunement == '' ? "no" : "yes", inline: true },
        )
        .setTimestamp()
        .setFooter(item.document__slug);
}

module.exports.help = {
    // name: 'magic-item',
    // permission: [],
    // alias: [],
    category: "Dungeons & Dragons",
    name: 'magic-item',
    description: 'look up a magic item',
    ephemeral: true,
    options: [{
        name: 'item-name',
        type: 'STRING',
        description: 'Multiple words are seperated by spaces or dashes.',
        required: true
    }]
}