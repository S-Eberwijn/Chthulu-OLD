const {PlayerCharacter} = require('../../../database/models/PlayerCharacter');

module.exports.run = async (interaction) => {
    if (!interaction.guild.members.cache.get(interaction.user.id).roles.cache.find(role => role.name.includes('Dungeon Master'))) return interaction.reply({ content: 'You shall not be setting ones level!', ephemeral: true })
    // if (!message.mentions.users.first()) return message.channel.send({ content: 'Try again, this time provide a player mention!' }).then(msg => { setTimeout(() => msg.delete(), 3000) }).catch(err => console.log(err));
    const character = await PlayerCharacter.findOne({ where: { player_id: interaction.options.getUser('user').id, server_id: interaction.guild.id, alive: 1 } })
    let oldCharacterLevel = character.level || 0;
    if (!character) return interaction.reply({ content: 'Did not find a suitable character in the database!', ephemeral: true })
    if (!(interaction.options.getNumber('level') <= 20 && interaction.options.getNumber('level') >= 1)) return interaction.reply({ content: 'Provide a number (1 - 20)!', ephemeral: true })

    character.level = interaction.options.getNumber('level');
    character.save();
    
    return await interaction.reply({ content: `${character.name}'s level changed from \*\*${oldCharacterLevel}\*\* to \*\*${interaction.options.getNumber('level')}\*\*!`, ephemeral: true });

    // PlayerCharacter.update(
    // { level: interaction.options.getNumber('level') },
    // {
    //     where: { player_id: interaction.options.getUser('user').id, alive: 1, server_id: interaction.guild.id }
    // }).then(async () => {
    //     return await interaction.reply({ content: `${character.get('name')}'s level changed from \*\*${character.get('level') || 0}\*\* to \*\*${interaction.options.getNumber('level')}\*\*!`, ephemeral: true });
    // });
}

module.exports.help = {
    name: 'set-level',
    permission: [],
    alias: [],
    category: "Dungeons & Dragons"
}
