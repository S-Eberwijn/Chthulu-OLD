const { MessageEmbed } = require('discord.js');
module.exports.run = async (interaction) => {
    let rolltwice = interaction.options.getString('roll-twice')!=null? true:false;
    let additionalModifier = interaction.options.getNumber('additional-modifier')==null? 0 : interaction.options.getNumber('additional-modifier');

    singleStat = [];
    singleStat.push(Math.ceil( Math.random()*20));
    if(rolltwice){
        singleStat.push(Math.ceil( Math.random()*20));
    }
    singleStat = singleStat.sort((a,b) => b-a);
    let command = "1d20 + " + additionalModifier;

    return interaction.reply({ embeds: [createEmbed(command,singleStat,additionalModifier)] })
}

function createEmbed(command,singleStat,modifier) {
    if(singleStat.length==1){
        return new MessageEmbed()
        .setTitle(command)
        .addField('\u200B', `${showRightColourOfRolledDie(singleStat[0],modifier)}`, true)
        .setTimestamp()
    }
    else{
    return new MessageEmbed()
        .setTitle(command)
        .addField('\u200B', `${showRightColourOfRolledDie(singleStat[0],modifier)}`, true)
        .addField('\u200B', '\u200B', true)
        .addField('\u200B', `${showRightColourOfRolledDie(singleStat[1],modifier)}`, true)
        .setTimestamp()
    }
}

function showRightColourOfRolledDie(roll,modifier) {
    if (roll == 1) {
        return `\`\`\`fix\n ${(roll+modifier).toString()}\`\`\``;
    } else if (roll == 20) {
        return `\`\`\`xl\n ${(roll+modifier).toString()}\`\`\``;
    } else {
        return `\`\`\`md\n ${(roll+modifier).toString()}\`\`\``;
    }
}
module.exports.help = {
    name: 'roll-check',
    permission: [],
    alias: [],
    category: "Dungeons & Dragons"
}
