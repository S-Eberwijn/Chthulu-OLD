const {MessageActionRow, MessageSelectMenu } = require('discord.js');
const NonPlayableCharacter = require('../../../database/models/NonPlayableCharacter');


module.exports.run = async (interaction) => {
    if(!interaction.member.roles.cache.has(interaction.guild.roles.cache.find(role => role.name.includes('Dungeon Master')).id)){
        await interaction.reply({
            content: "Only Dungeon Masters can use this command",
            ephemeral: true,
        });
        return
    }
    let dm = interaction.member.user.username;
    let messageComponentsArray = [];
    let myFilter = null;
    await NonPlayableCharacter.findOne({where: { server_id: interaction.guildId, using_npc: interaction.member.user.id }})
        .then((character)=>{
            if(character){
                character.set("using_npc", null)
                character.save()
            }
    })
    await NonPlayableCharacter.findAll({where:{ server_id: interaction.guildId, status:"visible"}}).then((npcs) => {
        if(npcs.length<1){
            interaction.reply({
                content: "Your server has no visible npcs, add a new ncp using the !cnpc command and set it to visible.",
                ephemeral: true,
            });
            return;
        }
        else if(npcs.length <= 1)
        messageComponentsArray.push(
            new MessageActionRow().addComponents(
                new MessageSelectMenu()
                    .setCustomId(`SelectNpcDropdown`)
                    .setPlaceholder('Select a value...')
                    .setMinValues(1)
                    .setMaxValues(1)
                    .setDisabled(false)
                    .addOptions(Object.keys(npcs)
                    .map(function (key) { return { label: `${npcs[key].name}`, value: `${npcs[key].character_id}` } }))
            )
        )
        else{
            let groups = Math.ceil( npcs.length/2);
            let npcsObject = [];
            let npcData = [];
            let charactersGroupedByLetter = [];
            let charsPerGroup = Math.ceil(npcs.length/groups);
            let grouplabel = "";
            let messageSelectMenuOptionsArray = [];
            for (let i = 0; i < npcs.length;i++){
                npcData = [npcs[i].name, npcs[i].character_id];
                npcsObject.push(npcData);
            }
            npcsObject.sort((a, b) => a[0].localeCompare(b[0]));
            let npcgroup = [];
            for (let i = 0; i < groups;i++){
                if(i>25){
                    interaction.channel.send({
                        content: "You have too many visible NPCS only the first 625 characters will be shown."
                    }).then(msg => { setTimeout(() => msg.delete(), 3000) })
                        .catch(err => console.log(err));
                    break;
                }
                if(i+1*charsPerGroup<npcsObject.length){
                    npcgroup = npcsObject.slice(i*charsPerGroup, i+1*charsPerGroup);
                }else{
                    npcgroup = npcsObject.slice(i*charsPerGroup, npcsObject.length);
                }
                grouplabel = npcgroup[0][0].toUpperCase().charAt(0) + " - " + npcgroup[npcgroup.length-1][0].toUpperCase().charAt(0);
                charactersGroupedByLetter.push({"label":grouplabel, "characters":npcgroup});
            
            }
            
            charactersGroupedByLetter[0].characters.forEach(async key => {
                await messageSelectMenuOptionsArray.push({
                    label: `${key[0]}`,
                    value: `${key[1]}`
                })
            })
            messageComponentsArray.push(new MessageActionRow().addComponents(
                new MessageSelectMenu()
                    .setCustomId(`npcGroupSelection`)
                    .setPlaceholder('Select a category...')
                    .setMinValues(1)
                    .setMaxValues(1)
                    .setDisabled(false)
                    .addOptions(Object.keys(charactersGroupedByLetter).map(function (key) { return { label: `${charactersGroupedByLetter[key].label}`, value: `${charactersGroupedByLetter[key].characters}` } }))
            ))
            messageComponentsArray.push(new MessageActionRow().addComponents(
                new MessageSelectMenu()
                    .setCustomId(`SelectNpcFromGroup`)
                    .setPlaceholder('Select a value...')
                    .setMinValues(1)
                    .setMaxValues(1)
                    .setDisabled(true)
                    .addOptions(messageSelectMenuOptionsArray)
            ))
            categorySelectionId = messageComponentsArray[0].components[0].customId;
            myFilter = response => {
                if (response.customId === categorySelectionId) {
                    let newSelectionMenu = response.message;
                    newSelectionMenu.components[0].components[0].placeholder = response.values[1];
                    let options = response.values[0].match(/[^,]+,[^,]+/g)
                    newSelectionMenu.components[1] = new MessageActionRow().addComponents(
                        new MessageSelectMenu()
                            .setCustomId(`SelectNpcFromGroup`)
                            .setPlaceholder('Select a value...')
                            .setMinValues(1)
                            .setMaxValues(1)
                            .setDisabled(false)
                            .addOptions(Object.keys(options)
                            .map(function (key) { return { label: `${options[key].split(',')[0]}`, value: `${options[key].split(',')[1]}` } })
                            )
                    )
                    response.message.edit({ components: newSelectionMenu.components })
                    return false;
                }
                return true;
            };
        }
    });
    await interaction.reply({
        content: "chose an npc to impersonate",
        components: messageComponentsArray, 
        fetchReply: true,
    }).then(async () => {
        await interaction.channel.awaitMessageComponent({
            filter: myFilter,
            max: 1,
            time: 30000,
            errors: ['time'],
        }).then(async (interaction) => {
            interaction.deferUpdate();
            await NonPlayableCharacter.findOne({where: { character_id: interaction.values[0], server_id: interaction.guildId }})
                .then((character)=>{
                    if (character) {    
                        character.set("using_npc", interaction.member.user.id)
                        character.save()
                        interaction.channel.send({content: "Dungeon Master " + dm
                            + " is now impersonating " +character.name +"." }) 
                            .then(msg => { setTimeout(() => msg.delete(), 3000) })
                            .catch(err => console.log(err));
                    }
                })
        }).catch(function () {  
            interaction.channel.send({
                content: "This poll has been open for too long, it no longer accepts answers."
            }).then(msg => { setTimeout(() => msg.delete(), 3000) })
            .catch(err => console.log(err));
        })
    })
}

module.exports.help = {
    name: 'impersonate',
    permission: [],
    alias: [],
    category: "Dungeons & Dragons"
}