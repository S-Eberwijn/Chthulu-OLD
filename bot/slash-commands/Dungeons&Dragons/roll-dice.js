const { count } = require('console');
const { MessageEmbed } = require('discord.js');

module.exports.run = async (interaction) => {
    let diceSet = new Map();
    let resultSet = new Map();
    diceSet.set("d4", interaction.options.getNumber('d4')==null ? 0 : interaction.options.getNumber('d4'));
    diceSet.set("d6", interaction.options.getNumber('d6')==null ? 0 : interaction.options.getNumber('d6'));
    diceSet.set("d8", interaction.options.getNumber('d8')==null ? 0 : interaction.options.getNumber('d8'));
    diceSet.set("d10", interaction.options.getNumber('d10')==null ? 0 : interaction.options.getNumber('d10'));
    diceSet.set("d12", interaction.options.getNumber('d12')==null ? 0 : interaction.options.getNumber('d12'));
    diceSet.set("d20", interaction.options.getNumber('d20')==null ? 0 : interaction.options.getNumber('d20'));
    diceSet.set("d100", interaction.options.getNumber('d100')==null ? 0 : interaction.options.getNumber('d100'));
    let additionalModifier = interaction.options.getNumber('additional-modifier')==null ? 0 :interaction.options.getNumber('additional-modifier');
    //error handling
    if(tooManyDice(diceSet)){return interaction.reply({ content:`Total number of dice you want to roll can not be higher than 24!`,ephemeral: true })}

    //do calculation
    resultSet = rollDice(diceSet);
    //constructing command
    let command = constructCommand(diceSet, additionalModifier)
    //rolling the dice
    return interaction.reply({ embeds: [createEmbed(command, resultSet,additionalModifier)] })
}

function createEmbed(command, resultSet,additionalModifier){ 
    let total = 0
    let counter = 0;
    let embed = new MessageEmbed().setTitle(command)
    for (let key of resultSet.keys()) {
        for(let i = 0; i < resultSet.get(key).length; i++){
            embed.addField("**"+key+"**", `${showRightColourOfRolledDie(resultSet.get(key)[i], key.replace(/\D/g,''))}`, true)
            total += resultSet.get(key)[i]
            counter++;
        }
    }
    while(counter%3 != 0){
        embed.addField('\u200b', '\u200b', true);
        counter++;
    }
    total += additionalModifier;
    embed.addField(`RESULT`, `[${getResultsPerType(resultSet,additionalModifier)}] = **${total}**`, false);
    return embed;
}

function getResultsPerType(diceSet, additionalModifier){
    let output = [];
    diceSet.forEach((v) => {
        if(v.length>0){
            output.push(v.reduce((a, b) => a + b, 0))
        }
    });
    output.push(additionalModifier);
    return output.join(" + ")
}

function rollDice(diceSet){
    let resultSet = new Map();
    let dicekind = 0;
    let tmp = [];
    for (let key of diceSet.keys()) {
        tmp =[];
        dicekind = parseInt(key.replace(/\D/g,''));//drop all non numeric characters from dicekind and keep the numbers, then parse
        for(let i =0; i<diceSet.get(key);i++){
            tmp.push( Math.ceil( Math.random()*dicekind));
        }
        resultSet.set(key,tmp);
    }
    return resultSet;
}

function constructCommand(diceSet, additionalModifier){
    let command ="";
    for (let key of diceSet.keys()) {
        if( diceSet.get(key)>0){
            command += diceSet.get(key) + key + " + ";
        }
    }
    return command + additionalModifier+".";
}

function tooManyDice(diceSet){
    let sum = 0;
    diceSet.forEach((v) => {
        sum += Math.abs(v);
    });
    return sum>24;
}

function showRightColourOfRolledDie(resultPerDie, typeOfDie) {
    if (resultPerDie == 1) {
        return `\`\`\`fix\n ${resultPerDie.toString()}\`\`\``;
    } else if (resultPerDie == typeOfDie) {
        return `\`\`\`xl\n ${resultPerDie.toString()}\`\`\``;
    } else {
        return `\`\`\`md\n ${resultPerDie.toString()}\`\`\``;
    }
}

module.exports.help = {
    name: 'roll-dice',
    permission: [],
    alias: [],
    category: "Dungeons & Dragons"
}
