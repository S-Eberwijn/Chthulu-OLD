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
    interaction.reply(createEmbed(command, resultSet));
    //return interaction.reply({ embeds: [createEmbed(command, statArray.sort((a,b) => b-a))] })
}

function createEmbed(command, resultSet){
    let output = command +": ";
    let total = 0;
    for (let key of resultSet.keys()) {
        for(let i = 0; i < resultSet.get(key).length; i++){
            output += resultSet.get(key)[i] + " + "
            total += resultSet.get(key)[i]
        }
    }
    return output += " = "+ total;
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
