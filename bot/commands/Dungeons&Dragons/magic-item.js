const { MessageEmbed } = require('discord.js');
const api = "https://api.open5e.com/magicitems/"
const request = require('request');

module.exports.run = async (interaction) => {
    let magicItem = interaction.options.getString('item-name').replaceAll(' ', '-').toLowerCase();
    let response = await new Promise(
        resolve => {
            request(api + magicItem, { json: true }, async (err, res, body) => {
                if (Object.keys(body).length < 2) { return resolve({content: magicItem + " was not found in our database.",ephemeral: true}); }
                return resolve({ embeds: [createEmbed(body)] });
            })
        })
    return interaction.reply(response)
}
function createEmbed(item) {
    return new MessageEmbed()
        .setTitle(item.name)
        .setURL(api + item.slug)
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