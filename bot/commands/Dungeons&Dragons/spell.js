const tagSelector = require('cheerio');
const request = require('request');
const baseURL = "https://www.dnd-spells.com/spell/"
const { MessageEmbed } = require('discord.js');

module.exports.run = async (interaction) => {
    let stringMessage = interaction.options.getString('spell-name');
    stringMessage = stringMessage.replace(/ /g, "-");

    let url = baseURL + stringMessage;
    request({
        url: url,
        agentOptions: {
            rejectUnauthorized: false
        }
    }, function (err, resp, body) {
        let data = ProcesRequest(body)
        if (data.status == 404) {
            ritual(interaction, stringMessage)
        }
        else {
            let sigilImage = './bot/images/DnD/SpellSigils/' + data.school + '.png';
            interaction.reply({ embeds: [EmbedSpellInMessage(data, stringMessage)], files: [sigilImage] });
        }
    });
}

function ProcesRequest(body) {
    let page = tagSelector.load(body);
    let content = page('h1[class=classic-title]').parent().text();
    if (content.length == 0) {
        return {status: 404};
    }
    content = content.split("Remove the adds")[1];
    let pageArray = content.split("\n");

    pageArray = pageArray.filter(item => item.trim());
    console.log(pageArray);
    let casters = "";
    let spellDescription = "";
    let atHigherLevel = "Cannot be cast at higher level";
    let i = 7;

    do {//append all spell description
        spellDescription += pageArray[i++].trim();
    } while ((!pageArray[i].includes("Page: ")) && (!pageArray[i].includes("At higher level")) && i < pageArray.length - 1)

    if (pageArray[i].includes("At higher level")) {
        i++
        atHigherLevel = "";
        do {//append at higherlevel
            atHigherLevel += pageArray[i++];
        } while (!pageArray[i].includes("Page: ") && i < pageArray.length - 1)
    }
    i += 2;
    do {//get all casters
        casters += pageArray[i++].trim() + " ";
    } while (pageArray[i].trim() != 'spell' && i < pageArray.length)

    return {
        "status": 200,
        "title": pageArray[0].trim(),
        "school": pageArray[1].split(" ").slice(-1)[0].trim(),
        "level": pageArray[2].split(":")[1].trim(),
        "castTime": pageArray[3].split(":")[1].trim(),
        "range": pageArray[4].split(":")[1].trim(),
        "comp": pageArray[5].split(":")[1].trim(),
        "duration": pageArray[6].split(":")[1].trim(),
        "description": spellDescription,
        "higherLevel": atHigherLevel,
        "casters": casters.substring(0, casters.length - 2)
    };
}

function ritual(interaction, stringMessage) {
    stringMessage = stringMessage.replace(/ /g, "-").toLowerCase() + "-ritual";
    let url = baseURL + stringMessage;
    request({
        url: url,
        agentOptions: {
            rejectUnauthorized: false
        }
    }, function (err, resp, body) {
        let data = ProcesRequest(body)
        if (data.status == 404) {
            interaction.reply({ content: "That spell was not found in the database", ephemeral: true });
        }
        else {
            let sigilImage = './bot/images/DnD/SpellSigils/' + data.school + '.png';
            interaction.reply({ embeds: [EmbedSpellInMessage(data, stringMessage)], files: [sigilImage] });
        }
    });
}

function EmbedSpellInMessage(data, message) {
    let shortDescription;
    if (data.description.length > 1020) {
        shortDescription = `${data.description.substring(0, 1020)}...`
    } else {
        shortDescription = data.description;
    }
    let msg = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(data.title)
        .setDescription(data.school)
        .setURL(baseURL + message)
        .setThumbnail('attachment://' + data.school + '.png')
        .addFields(
            { name: '\u200B', value: `Level: **${data.level}**\nCasting time: **${data.castTime}**\nRange: **${data.range}**\nComponents: **${data.comp}**\nDuration: **${data.duration}**`, inline: false },
            { name: '\u200B', value: shortDescription, inline: false },
            { name: 'At Higher Level: ', value: `${data.higherLevel}`, inline: false },
        )
        .setTimestamp()
        .setFooter({ text: data.casters });
    return msg;
}

module.exports.help = {
    category: "Dungeons & Dragons",
    name: 'spell',
    description: 'Gives information about a spell.',
    ephemeral: true,
    options: [{
        name: 'spell-name',
        type: 'STRING',
        description: 'Give the name of the spell',
        required: true
    }],
}