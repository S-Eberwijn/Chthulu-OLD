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
    if(amountOfDice < 0){return interaction.reply("You can't roll a negative amount of dice");}
    if(dropLowest < 0 && dropHighest < 0){return interaction.reply("You can't drop a negative amount of dice");}
    if(dropLowest+dropHighest >= amountOfDice){return interaction.reply("You're not allowed to drop more dice than you rolled");}
    
    //constructing command
    let command = amountOfDice + "d" + dicekind;
    if(dropLowest!=0){command = command + ", drop lowest " + dropLowest;}
    if(dropHighest!=0){command = command + ", drop highest " + dropHighest;}
    if(additionalModifier!=0){command = command + " + " + additionalModifier;}

    //rolling the dice
    for(let i = 0; i < 6; i++){
        singleStat = [];
        for(let j = 0; j <amountOfDice;j++){
            singleStat.push(Math.ceil( Math.random()*dicekind));
        }
        singleStat.sort((a,b) => a-b);
        singleStat = singleStat.slice(dropLowest, amountOfDice-dropHighest);
        statArray.push(singleStat.reduce(reducer)+additionalModifier);
    }

    return interaction.reply("the command: " + command + ". gave you the following statarray: " + statArray.sort((a,b) => a-b).join()+".");
}

module.exports.help = {
    name: 'roll-stats',
    permission: [],
    alias: [],
    category: "Dungeons & Dragons"
}
