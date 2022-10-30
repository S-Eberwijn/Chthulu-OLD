const { logger } = require(`../../../functions/logger`)
const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require('discord.js');
const api = "https://api.open5e.com/weapons"
const request = require('request');

module.exports.run = async (interaction) => {
    let weapon = interaction.options.getString('weapon-name')?.toLowerCase();

    request(api, { json: true }, async (err, res, body) => {
        if (err) { return logger.error(err); }
        let data = body.results

        for(let item of data) {
            if(item.slug.toLowerCase() == weapon) {
                return interaction.reply({ embeds: [createEmbed(item)] })
            }
        }
        return await useSelectionMenu(interaction, data);
    });
}

async function useSelectionMenu(interaction, weapons) {
    let half = Math.ceil(weapons.length / 2);
    let weapons1 = weapons.slice(0, half)
    let weapons2 = weapons.slice(-half)
    let messageComponentsArray = [];
    messageComponentsArray.push(
        new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId(`SelectWeaponDropdown1`)
                .setPlaceholder('Select a value...')
                .setMinValues(1)
                .setMaxValues(1)
                .setDisabled(false)
                .addOptions(Object.keys(weapons1)
                    .map(function (key) { return { label: `${weapons1[key].name}`, value: `${weapons1[key].name}` } }))
        )
    )
    messageComponentsArray.push(
        new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId(`SelectWeaponDropdown2`)
                .setPlaceholder('Select a value...')
                .setMinValues(1)
                .setMaxValues(1)
                .setDisabled(false)
                .addOptions(Object.keys(weapons2)
                    .map(function (key) { return { label: `${weapons2[key].name}`, value: `${weapons2[key].name}` } }))
        )
    )
    await interaction.reply({
        content: "Pick the weapon you want to learn more about (both dropdowns contain weapons).",
        components: messageComponentsArray,
        fetchReply: true,
    }).then(async () => {
        await interaction.channel.awaitMessageComponent({
            max: 1,
            time: 30000,
            errors: ['time']
        }).then(async (interaction) => {
            interaction.deferUpdate();
            for(let weapon of weapons){
                if(weapon.name == interaction.values[0]){
                    return interaction.channel.send({ embeds: [createEmbed(weapon)] })
                }
            }
        }).catch(function () {
            interaction.channel.send({
                content: "This poll has been open for too long, it no longer accepts answers."
                , ephemeral: true
            }).then(msg => { setTimeout(() => msg.delete(), 3000) })
                .catch(err => logger.error(err));
        })
    })
}

function createEmbed(weapon) {
    let properties = weapon.properties.join("; ");
    return new MessageEmbed()
        .setTitle(weapon.name)
        .setURL(api + "/" + weapon.slug)
        .addFields(
            { name: 'damage dice', value: weapon.damage_dice, inline: true },
            { name: 'cost', value: weapon.cost, inline: true },
            { name: 'category', value: weapon.category, inline: true },
            { name: 'damage type', value: weapon.damage_type, inline: true },
            { name: 'weight', value: weapon.weight, inline: true },
            { name: 'additional properties', value: properties == "" ? "none" : properties, inline: true },
        )
        .setTimestamp()
        .setFooter(weapon.document__slug + " • " + weapon.document__title);//?? this appears to be deprecated, not sure why.
}

module.exports.help = {
    category: "Dungeons & Dragons",
    name: 'weapon',
    description: 'look up a weapon',
    ephemeral: true,
    options: [{
        name: 'weapon-name',
        type: 'STRING',
        description: 'You can chose to enter the name of the weapon.',
        required: false
    }],
}