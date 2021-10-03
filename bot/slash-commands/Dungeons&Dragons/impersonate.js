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
    let messageComponentsArray = [];

    await NonPlayableCharacter.findOne({where: { server_id: interaction.guildId, using_npc: interaction.member.user.id }})
        .then((character)=>{
            if(character){
                character.set("using_npc", null)
                character.save()
            }
    })
    await NonPlayableCharacter.findAll({where:{ server_id: interaction.guildId, status:"visible"}}).then((npcs) => {
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
        //console.log(messageComponentsArray);
    });
    await interaction.reply({
        content: "chose an npc to impersonate",
        components: messageComponentsArray, 
        fetchReply: true,
    }).then(async () => {
        await interaction.channel.awaitMessageComponent({
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
                        interaction.channel.send({content: "Dungeon Master "+ interaction.member.username 
                            + " is now impersonating " +character.name +"." }) 
                            .then(msg => { setTimeout(() => msg.delete(), 3000) })
                            .catch(err => console.log(err));
                    }
                })
        }).catch(function () {  
            interaction.reply({
                content: "This poll has been open for too long, it no longer accepts answers.",
                ephemeral: true
            });
        })
    })
}

module.exports.help = {
    name: 'impersonate',
    permission: [],
    alias: [],
    category: "Dungeons & Dragons"
}