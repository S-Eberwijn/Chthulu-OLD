const { MessageEmbed } = require('discord.js');
module.exports.run = async (interaction) => {
    let rolltwice = interaction.options.getString('roll-twice')!=null? true:false;
    let additionalModifier = interaction.options.getNumber('additional-modifier')==null? 0 : interaction.options.getNumber('additional-modifier');

    singleStat = [];
    singleStat.push(Math.ceil( Math.random()*20)+additionalModifier);
    if(rolltwice){
        singleStat.push(Math.ceil( Math.random()*20)+additionalModifier);
    }
    singleStat = singleStat.sort((a,b) => b-a);
    let command = "1d20 + " + additionalModifier;

    return interaction.reply({ embeds: [createEmbed(command,singleStat)] })
}

function createEmbed(command,singleStat){
    if(singleStat.length==1){
        return new MessageEmbed()
        .setTitle(command)
        .addField('\u200B', "**```"+singleStat[0]+"```**", true)
        .setTimestamp()
    }
    else{
    return new MessageEmbed()
        .setTitle(command)
        .addField('\u200B', "**```"+singleStat[0]+"```**", true)
        .addField('\u200B', '\u200B', true)
        .addField('\u200B', "**```"+singleStat[1]+"```**", true)
        .setTimestamp()
    }
}

module.exports.help = {
    name: 'roll-check',
    permission: [],
    alias: [],
    category: "Dungeons & Dragons"
}
