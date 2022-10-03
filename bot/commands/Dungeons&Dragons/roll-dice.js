const { MessageEmbed } = require('discord.js');
const { logger } = require(`../../../functions/logger`)

module.exports.run = async (interaction) => {
    let diceSet = new Map();
    let resultSet = new Map();

    diceSet.set("d4", interaction.options.getNumber('d4') == null ? 0 : interaction.options.getNumber('d4'));
    diceSet.set("d6", interaction.options.getNumber('d6') == null ? 0 : interaction.options.getNumber('d6'));
    diceSet.set("d8", interaction.options.getNumber('d8') == null ? 0 : interaction.options.getNumber('d8'));
    diceSet.set("d10", interaction.options.getNumber('d10') == null ? 0 : interaction.options.getNumber('d10'));
    diceSet.set("d12", interaction.options.getNumber('d12') == null ? 0 : interaction.options.getNumber('d12'));
    diceSet.set("d20", interaction.options.getNumber('d20') == null ? 0 : interaction.options.getNumber('d20'));
    diceSet.set("d100", interaction.options.getNumber('d100') == null ? 0 : interaction.options.getNumber('d100'));

    let additionalModifier = interaction.options.getNumber('additional-modifier') == null ? 0 : interaction.options.getNumber('additional-modifier');
    //error handling
    if (tooManyDice(diceSet)) { return interaction.reply({ content: `Total number of dice you want to roll can not be higher than 24!`, ephemeral: true }) }

    //do calculation
    resultSet = rollDice(diceSet);
    //constructing command
    let command = constructCommand(diceSet, additionalModifier)

    logger.debug(`${interaction.user.username}#${interaction.user.discriminator} rolled ${command} in ${interaction.guild.name}.`);

    //rolling the dice
    return interaction.reply({ embeds: [createEmbed(command, resultSet, additionalModifier)] })
}

function createEmbed(command, resultSet, additionalModifier) {
    let total = 0
    let counter = 0;
    let embed = new MessageEmbed().setTitle(command)
    for (let key of resultSet.keys()) {
        for( let item of resultSet.get(key)){
            embed.addField("**" + key + "**", `${showRightColourOfRolledDie(item, key.replace(/\D/g, ''))}`, true)
            total += item;
            counter++;
        }
    }
    while (counter % 3 != 0) {
        embed.addField('\u200b', '\u200b', true);
        counter++;
    }
    total += additionalModifier;
    embed.addField(`RESULT`, `[${getResultsPerType(resultSet, additionalModifier)}] = **${total}**`, false);
    return embed;
}

function getResultsPerType(diceSet, additionalModifier) {
    let output = [];
    let returnvalue = "";
    diceSet.forEach((v) => {
        if (v.length > 0) {
            output.push(v.reduce((a, b) => a + b, 0))
        }
    });
    if (additionalModifier != 0) {
        output.push(additionalModifier);
    }

    for (let i = 0; i < output.length; i++) {
        if (i > 0) {
            if (output[i] > 0) {
                returnvalue += " + " + output[i];
            } else {
                returnvalue += " - " + Math.abs(output[i]);
            }
        } else {
            returnvalue += output[i]
        }
    }

    return returnvalue;
}

function rollDice(diceSet) {
    let resultSet = new Map();
    let dicekind = 0;
    let tmp = [];
    for (let key of diceSet.keys()) {
        tmp = [];
        dicekind = parseInt(key.replace(/\D/g, ''));//drop all non numeric characters from dicekind and keep the numbers, then parse
        for (let i = 0; i < Math.abs(diceSet.get(key)); i++) {
            if (diceSet.get(key) > 0) {
                tmp.push(Math.ceil(Math.random() * dicekind));
            } else if (diceSet.get(key) < 0) {
                tmp.push(Math.ceil(Math.random() * dicekind) * -1);
            }
        }
        resultSet.set(key, tmp);
    }
    return resultSet;
}

function constructCommand(diceSet, additionalModifier) {
    let command = "";
    let counter = 0;
    for (let key of diceSet.keys()) {
        if (counter == 0 && diceSet.get(key) > 0) {
            command += diceSet.get(key) + key;
            counter++;
        } else {
            if (diceSet.get(key) > 0) {
                command += " + " + diceSet.get(key) + key;
            }
            else if (diceSet.get(key) < 0) {
                command += " - " + Math.abs(diceSet.get(key)) + key;
            }
        }
    }
    if (additionalModifier != 0) {
        command += " + " + additionalModifier + "."
    }
    return command;
}

function tooManyDice(diceSet) {
    let sum = 0;
    diceSet.forEach((v) => {
        sum += Math.abs(v);
    });
    return sum > 24;
}

function showRightColourOfRolledDie(resultPerDie, typeOfDie) {
    if (Math.abs(resultPerDie) == 1) {
        return `\`\`\`fix\n ${resultPerDie.toString()}\`\`\``;
    } else if (Math.abs(resultPerDie) == typeOfDie) {
        return `\`\`\`xl\n ${resultPerDie.toString()}\`\`\``;
    } else {
        return `\`\`\`md\n ${resultPerDie.toString()}\`\`\``;
    }
}

module.exports.help = {
    // name: 'roll-dice',
    // permission: [],
    // alias: [],
    category: "Dungeons & Dragons",
    name: 'roll-dice',
    description: 'Roll any combination of dice with a single additional numeric modifier',
    ephemeral: true,
    options: [{
        name: 'd4',
        type: 'NUMBER',
        description: "Amount of d4's to roll, a negative number will subtrac that amount of dice (optional)",
        required: false
    },
    {
        name: 'd6',
        type: 'NUMBER',
        description: "Amount of d6's to roll, a negative number will subtrac that amount of dice (optional)",
        required: false
    },
    {
        name: 'd8',
        type: 'NUMBER',
        description: "Amount of d8's to roll, a negative number will subtrac that amount of dice (optional)",
        required: false
    },
    {
        name: 'd10',
        type: 'NUMBER',
        description: "Amount of d10's to roll, a negative number will subtrac that amount of dice (optional)",
        required: false
    },
    {
        name: 'd12',
        type: 'NUMBER',
        description: "Amount of d12's to roll, a negative number will subtrac that amount of dice (optional)",
        required: false
    },
    {
        name: 'd20',
        type: 'NUMBER',
        description: "Amount of d20's to roll, a negative number will subtrac that amount of dice (optional)",
        required: false
    },
    {
        name: 'd100',
        type: 'NUMBER',
        description: "Amount of d100's to roll, a negative number will subtrac that amount of dice (optional)",
        required: false
    },
    {
        name: 'additional-modifier',
        type: 'NUMBER',
        description: 'add an additional modifier to the roll, a negative number will subtrac that amount (optional)',
    }]
}
