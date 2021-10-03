const NonPlayableCharacter = require('../../../database/models/NonPlayableCharacter');

module.exports.run = async (interaction) => {
    if(!interaction.member.roles.cache.has(interaction.guild.roles.cache.find(role => role.name.includes('Dungeon Master')).id)){
        await interaction.reply({
            content: "Only Dungeon Masters can use this command",
            ephemeral: true,
        });
        return
    }
    // await NonPlayableCharacter.findAll({where:{ server_id: interaction.guildId, status:"visible"}}).then((npcs) => {
    //     npcs.forEach(npc => {
    //         console.log(npc.name + " " + npcs.server_id + " " + npcs.using_npc)
    //         console.log("server " + interaction.guildId + " " + interaction.member.user.id)
    //     });
    // });
    try{
        await NonPlayableCharacter.findOne({where: { server_id: interaction.guildId, using_npc: interaction.member.user.id }
        }).then((character)=>{
            if(character){
                character.set("using_npc", null)
                character.save()
            }
        }).then(()=>{
            interaction.reply({content: "you are no longer using an npc to talk", ephemeral: true})
        })
    }catch (error) {
        interaction.reply({content: "Internal server error", ephemeral: true})
    }

}

module.exports.help = {
    name: 'stop-impersonating',
    permission: [],
    alias: [],
    category: "Dungeons & Dragons"
}