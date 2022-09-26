const { logger } = require(`../../../functions/logger`)
const { PlayerCharacter } = require('../../../database/models/PlayerCharacter');

module.exports.run = async (interaction) => {
    if (!interaction.guild.members.cache.get(interaction.user.id).roles.cache.find(role => role.name.includes('Dungeon Master'))) return interaction.reply({ content: 'You shall not be setting ones level!', ephemeral: true })
    if (!(interaction.options.getNumber('level') <= 20 && interaction.options.getNumber('level') >= 1)) return interaction.reply({ content: 'Provide a number (1 - 20)!', ephemeral: true })

    const USER_CHARACTER = await PlayerCharacter.findOne({ where: { player_id_discord: interaction.options.getUser('user').id, server: interaction.guild.id, alive: 1 } })
    if (!USER_CHARACTER) return interaction.reply({ content: 'Did not find a suitable character in the database!', ephemeral: true })
    let oldCharacterLevel = USER_CHARACTER.level || 0;

    USER_CHARACTER.level = interaction.options.getNumber('level');
    USER_CHARACTER.save();

    return interaction.reply({ content: `${USER_CHARACTER.name}'s level changed from \*\*${oldCharacterLevel}\*\* to \*\*${interaction.options.getNumber('level')}\*\*!`, ephemeral: true });

}

module.exports.help = {
    category: "Dungeons & Dragons",
    name: 'set-level',
    description: 'Change a characters level.',
    options: [{
        name: 'user',
        type: 'USER',
        description: 'User from whom the character is.',
        required: true
    },
    {
        name: 'level',
        type: 'NUMBER',
        description: 'The newly achieved level.',
        required: true
    }],
}
