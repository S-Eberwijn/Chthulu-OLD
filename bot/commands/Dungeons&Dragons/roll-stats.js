const { MessageEmbed } = require('discord.js');
const reducer = (previousValue, currentValue) => previousValue + currentValue;
module.exports.run = async (interaction) => {
    let statArray = [];
    let singleStat = [];
    let amountOfDice = interaction.options.getNumber('amount-of-dice');
    let dicekind = interaction.options.getNumber('d');
    let dropLowest = interaction.options.getNumber('drop-lowest');
    let dropHighest = interaction.options.getNumber('drop-highest');
    let additionalModifier = interaction.options.getNumber('additional-modifier');
    dropLowest = dropLowest == null ? 0 : dropLowest
    dropHighest = dropHighest == null ? 0 : dropHighest
    additionalModifier = additionalModifier == null ? 0 : additionalModifier
    //error handling
    if (amountOfDice < 0) { return interaction.reply("You can't roll a negative amount of dice"); }
    if (dropLowest < 0 && dropHighest < 0) { return interaction.reply("You can't drop a negative amount of dice"); }
    if (dropLowest + dropHighest >= amountOfDice) { return interaction.reply("You're not allowed to drop more dice than you rolled"); }

    //constructing command
    let command = amountOfDice + "d" + dicekind;
    if (additionalModifier != 0) { command = command + " + " + additionalModifier; }
    if (dropLowest != 0) { command = command + ", drop lowest " + dropLowest; }
    if (dropHighest != 0) { command = command + ", drop highest " + dropHighest; }

    //rolling the dice
    for (let i = 0; i < 6; i++) {
        singleStat = [];
        for (let j = 0; j < amountOfDice; j++) {
            singleStat.push(Math.ceil(Math.random() * dicekind));
        }
        singleStat.sort((a, b) => a - b);
        singleStat = singleStat.slice(dropLowest, amountOfDice - dropHighest);
        statArray.push(singleStat.reduce(reducer) + additionalModifier);
    }
    return interaction.reply({ embeds: [createEmbed(command, statArray.sort((a, b) => b - a))] })
}

function createEmbed(command, statArray) {
    return new MessageEmbed()
        .setTitle(command)
        .setDescription('The following fields are the stats that were generated for you.' +
            ' You can assign any value you rolled to any ability score (each value only once).')
        .addField('\u200B', "**```" + statArray[0] + "```**", true)
        .addField('\u200B', "**```" + statArray[1] + "```**", true)
        .addField('\u200B', "**```" + statArray[2] + "```**", true)
        .addField('\u200B', "**```" + statArray[3] + "```**", true)
        .addField('\u200B', "**```" + statArray[4] + "```**", true)
        .addField('\u200B', "**```" + statArray[5] + "```**", true)
        .setTimestamp()
}

module.exports.help = {
    category: "Dungeons & Dragons",
    name: 'roll-stats',
    description: 'create a stat array',
    ephemeral: true,
    options: [{
        name: 'amount-of-dice',
        type: 'NUMBER',
        description: 'Amount of dice to roll',
        required: true
    },
    {
        name: 'd',
        type: 'NUMBER',
        description: 'type of dice to be rolled',
        required: true
    },
    {
        name: 'drop-lowest',
        type: 'NUMBER',
        description: 'lowest x number of dice will be dropped',
        required: false
    },
    {
        name: 'drop-highest',
        type: 'NUMBER',
        description: 'highest x number of dice will be dropped',
        required: false
    },
    {
        name: 'additional-modifier',
        type: 'NUMBER',
        description: 'add an additional modifier to the roll',
        required: false
    }],
}
