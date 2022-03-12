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
        // server cmd
        {
            name: 'cc',
            description: 'Create a new character!',
            options: [],
        },
        // chthulu cmd
        {
            name: 'chthulu',
            description: 'Information about the bot!',
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
        // quests cmd
        {
            name: 'quests',
            description: 'Get information of quests in this campaign (server).',
            options: [],
        },
        // spell slash-command
        {
            name: 'spell',
            description: 'Gives information about a spell.',
            ephemeral: true,
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
        //roll stats
        {
            name: 'roll-stats',
            description: 'create a stat array',
            ephemeral: true,
            options: [{
                name: 'amount-of-dice',
                type: 'NUMBER',
                description: 'Amount of dice to roll',
                required: true
            },
            {
                name: 'd',
                type: 'NUMBER',
                description: 'type of dice to be rolled',
                required: true
            },
            {
                name: 'drop-lowest',
                type: 'NUMBER',
                description: 'lowest x number of dice will be dropped',
                required: false
            },
            {
                name: 'drop-highest',
                type: 'NUMBER',
                description: 'highest x number of dice will be dropped',
                required: false
            },
            {
                name: 'additional-modifier',
                type: 'NUMBER',
                description: 'add an additional modifier to the roll',
                required: false
            }]
        },
        //set level
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
        //magic item
        {
            name: 'magic-item',
            description: 'look up a magic item',
            ephemeral: true,
            options: [{
                name: 'item-name',
                type: 'STRING',
                description: 'Multiple words are seperated by spaces or dashes.',
                required: true
            }]
        },
        //conditions
        {
            name: 'condition',
            description: 'look up a statuscondition',
            ephemeral: true,
            options: [{
                name: 'condition-name',
                type: 'STRING',
                description: 'You can chose to enter the name of the condition.',
                required: false
            }]
        },
        //weapons
        {
            name: 'weapon',
            description: 'look up a weapon',
            ephemeral: true,
            options: [{
                name: 'weapon-name',
                type: 'STRING',
                description: 'You can chose to enter the name of the weapon.',
                required: false
            }]
        },
        //roll-dice
        {
            name: 'roll-dice',
            description: 'Roll any combination of dice with a single additional numeric modifier',
            ephemeral: true,
            options: [{
                name: 'd4',
                type: 'NUMBER',
                description: "Amount of d4's to roll, a negative number will subtrac that amount of dice (optional)",
                required: false
            },
            {
                name: 'd6',
                type: 'NUMBER',
                description: "Amount of d6's to roll, a negative number will subtrac that amount of dice (optional)",
                required: false
            },
            {
                name: 'd8',
                type: 'NUMBER',
                description: "Amount of d8's to roll, a negative number will subtrac that amount of dice (optional)",
                required: false
            },
            {
                name: 'd10',
                type: 'NUMBER',
                description: "Amount of d10's to roll, a negative number will subtrac that amount of dice (optional)",
                required: false
            },
            {
                name: 'd12',
                type: 'NUMBER',
                description: "Amount of d12's to roll, a negative number will subtrac that amount of dice (optional)",
                required: false
            },
            {
                name: 'd20',
                type: 'NUMBER',
                description: "Amount of d20's to roll, a negative number will subtrac that amount of dice (optional)",
                required: false
            },
            {
                name: 'd100',
                type: 'NUMBER',
                description: "Amount of d100's to roll, a negative number will subtrac that amount of dice (optional)",
                required: false
            },
            {
                name: 'additional-modifier',
                type: 'NUMBER',
                description: 'add an additional modifier to the roll, a negative number will subtrac that amount (optional)',
            }]
        },
        {
            name: 'roll-check',
            description: 'roll check',
            ephemeral: true,
            options: [
                {
                    name: 'additional-modifier',
                    type: 'NUMBER',
                    description: 'add an additional modifier to the roll',
                    required: false
                },
                {
                    name: 'roll-twice',
                    type: 'STRING',
                    description: 'fill in anything in this field to have 2 rolls, this can be used for advantage or disadvantage',
                    required: false
                }]
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
        // help cmd
        {
            name: "help",
            // alias: ["hlp"],
            description: "Gives all possible commands",
            options: [{
                name: 'command',
                type: 'STRING',
                description: 'Command name',
                required: false
            }],
        },
        // server cmd
        {
            name: "clear",
            // alias: [],
            description: "Clears n-number of messages",
            options: [{
                name: 'number',
                type: 'NUMBER',
                description: 'Amount of messages you want to delete',
                required: true
            }],



        },
        {
            name: "npc",
            // alias: [],
            description: "Displays your character!",
            options: [{
                name: 'name',
                type: 'STRING',
                description: `Name of the NPC you're trying to find`,
                required: false
            }],
        },
        // // magicItemList cmd
        {
            name: "magic-item-list",
            // alias: [],
            description: "gives a list of all default magic items.",
            options: [],
        },
        // // create npc cmd
        {
            name: "create-npc",
            // alias: [],
            description: "Creates a new channel with questions about your new NPC",
            options: [],
        },
        // // session cmd
        {
            name: "session",
            // alias: [],
            description: "Handles actions around sessions",
            options: [{
                name: 'action',
                type: 'STRING',
                description: `Type of action you want to do: "request"`,
                required: true
            }],
        },



    ]
    await bot.guilds.cache.get(guildId)?.commands.set(data)
}
