module.exports.createCmd = async function (bot, guildId) {
    const data = [
        // echo cmd
        {
            name: 'echo',
            description: 'Echo your text!',
            options: [{
                name: 'text',
                type: 'STRING',
                description: 'The input to echo back',
                required: true
            }],
        },
        // addCharacterChannel slash-command
        {
            name: 'add-character-channel',
            description: 'Add in-character channel',
            options: [{
                name: 'channel-name',
                type: 'STRING',
                description: 'Name of the designated channel',
                required: true
            }],
        },
    ]
    await bot.guilds.cache.get(guildId)?.commands.set(data)
}
