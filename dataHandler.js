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
        // character slash-command
        {
            name: 'character',
            description: 'Show an user character.',
            options: [{
                name: 'user',
                type: 'USER',
                description: 'User to look character',
                required: false
            }],
        },
        // spell slash-command
        {
            name: 'spell',
            description: 'Gives information about a spell.',
            options: [{
                name: 'spell-name',
                type: 'STRING',
                description: 'Give the name of the spell',
                required: true
            }],
        },
        // impersonate npc
        {
            name: 'impersonate',
            description: 'Allows a dm to talk as if he is that npc.',
            ephemeral: true,
        },
        //stopImpersonating
        {
            name: 'stop-impersonating',
            description: 'The dm will stop impersonating his current npc',
            ephemeral: true,
        },
        {
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
        },
        // server cmd
        {
            name: 'server',
            description: 'Gives information about the server.',
            options: [],
        },
        // avatar cmd
        {
            name: 'avatar',
            description: 'Shows the avatar of an user.',
            options: [{
                name: 'user',
                type: 'USER',
                description: 'User from whom the character is.',
                required: false
            }],
        },
    ]
    await bot.guilds.cache.get(guildId)?.commands.set(data)
}