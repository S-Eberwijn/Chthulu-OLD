const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');

exports.sendHelpEmbedFunction = async function (bot, guildId, messageChannelId, messageAuthorId) {
    //TODO FIX const messageChannel = bot.guilds.cache.get(guildId).channels.cache.get(messageChannelId)
    // TypeError: Cannot read property 'channels' of undefined
    
    const messageChannel = bot.guilds.cache.get(guildId).channels.cache.get(messageChannelId)
    // bot.guilds.get(message.guild.id).id
    const categorizedCommands = bot.slashCommands.reduce((r, a) => {
        r[a.help.category] = [...r[a.help.category] || [], a];
        return r;
    }, {})

    const initialEmbed = new MessageEmbed().setDescription("Please choose a category in the dropdown menu below").setAuthor({name: `${bot.user.username}`, iconURL: bot.user.displayAvatarURL()}).setColor("GREEN")

    let optionsArray = [];
    Object.keys(categorizedCommands).forEach(async key => {
        optionsArray.push({
            label: `${key}`,
            value: `${key.replaceAll(' ', '').toLowerCase()}`,
            description: `Commands from ${key} category`,
            emoji: setEmoji(key)
        })
    })

    const messageComponents = new MessageActionRow().addComponents(
        new MessageSelectMenu()
            .setCustomId('helpSelectMenu')
            .setPlaceholder('Select a category...')
            .setMinValues(1)
            .setMaxValues(1)
            .setDisabled(false)
            .addOptions(optionsArray)
    )

    const initialMessage = await messageChannel.send({ embeds: [initialEmbed], components: [messageComponents] }, true);

    const filter = (response) => {
        return response.user.id === messageAuthorId;
    }

    const collector = messageChannel.createMessageComponentCollector({
        filter,
        componentType: 'SELECT_MENU',
        time: 15000
    })

    collector.on('collect', (interaction) => {
        interaction.deferUpdate();
        //TODO: SET THE SELECTED AS DEFAULT
        let selectedValue = interaction.values[0];
        Object.keys(categorizedCommands).forEach(async key => {
            if (!(selectedValue === key.replaceAll(' ', '').toLowerCase())) return;
            const uniqueCommands = new Map();
            for (const item of categorizedCommands[`${key}`]) {
                if (!uniqueCommands.has(item.help.name)) {
                    uniqueCommands.set(item.help.name, item.help.description);    // set any value to Map
                }
            }
            var result = optionsArray.filter(obj => {
                return obj.label === `${key}`
            })
            const categoryEmbed = new MessageEmbed()
                .setTitle(`--= ${key} =--`)
                .setDescription(`${result[0].emoji} - Commands that have something to do with ${key}`)
                .setColor("GREEN")
                .addFields(Array.from(uniqueCommands).map(([name, value]) => {
                    return {
                        name: `\`!${name}\``,
                        value: `${value}`,
                        inline: true
                    }
                }));

            // Adding blank space(s) if the number of dice rolled is not equal to a multiple of 3
            if (uniqueCommands.size % 3 != 0) {
                for (let i = 0; i < 3 - uniqueCommands.size % 3; i++) {
                    categoryEmbed.addField('\u200b', '\u200b', true);
                }
            }

            initialMessage.edit({ embeds: [categoryEmbed] }, true)
        })
    })
    collector.on('end', (interaction) => {
        initialMessage.edit({ content: `Times up! In order to select the category of commands again, use /help`, embeds: [], components: [] }).then(msg => { setTimeout(() => msg.delete(), 3000) }).catch(err => console.log(err))
    })


}


function setEmoji(categoryName) {
    if (categoryName.toLowerCase().includes('general')) {
        return '⚙️'
    } else if (categoryName.toLowerCase().includes('misc')) {
        return '🎊'
    } else if (categoryName.toLowerCase().includes('dungeons')) {
        return '🐉'
    } else if (categoryName.toLowerCase().includes('info')) {
        return '🗃️'
    } else if (categoryName.toLowerCase().includes('test')) {
        return '🧪'
    } else {
        return '🚩'
    }
}


