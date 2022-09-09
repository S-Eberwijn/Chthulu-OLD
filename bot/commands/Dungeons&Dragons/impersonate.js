const { logger } = require(`../../../functions/logger`)

const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const { NonPlayableCharacter } = require('../../../database/models/NonPlayableCharacter');


module.exports.run = async (interaction) => {
    if (!interaction.member.roles.cache.has(interaction.guild.roles.cache.find(role => role.name.includes('Dungeon Master')).id)) {
        await interaction.reply({
            content: "Only Dungeon Masters can use this command",
            ephemeral: true,
        });
        return
    }
    let dm = interaction.member.user.username;
    let messageComponentsArray = [];
    let myFilter = null;
    await NonPlayableCharacter.findOne({ where: { server: interaction.guildId, using_npc: interaction.member.user.id } })
        .then((character) => {
            if (character) {
                character.set("using_npc", null)
                character.save()
            }
        })
    await NonPlayableCharacter.findAll({ where: { server: interaction.guildId, status: "visible" } }).then((npcs) => {
        if (npcs.length < 1) {
            interaction.reply({
                content: "Your server has no visible npcs, add a new ncp using the !cnpc command and set it to visible.",
                ephemeral: true,
            });
        }
        else if (npcs.length <= 25)//create new method
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
        else {//create new method, should resolve quality gate issue
            let groups = Math.ceil(npcs.length / 25);
            let npcsObject = [];
            let charactersGroupedByLetter = [];
            let charsPerGroup = Math.ceil(npcs.length / groups);
            let grouplabel = "";
            let messageSelectMenuOptionsArray = [];
            for (const npc of npcs){
                npcsObject.push([npc.name, npc.character_id]);
            }
            npcsObject.sort((a, b) => a[0].localeCompare(b[0]));
            let npcgroup = [];
            for (let i = 0; i < groups; i++) {
                if (i > 25) {
                    interaction.channel.send({
                        content: "You have too many visible NPCS only the first 625 characters will be shown."
                    }).then(msg => { setTimeout(() => msg.delete(), 3000) })
                        .catch(err => logger.error(err));
                    break;
                }
                if (i + 1 * charsPerGroup < npcsObject.length) {
                    npcgroup = npcsObject.slice(i * charsPerGroup, i + 1 * charsPerGroup);
                } else {
                    npcgroup = npcsObject.slice(i * charsPerGroup, npcsObject.length);
                }
                grouplabel = npcgroup[0][0].toUpperCase().charAt(0) + " - " + npcgroup[npcgroup.length - 1][0].toUpperCase().charAt(0);
                charactersGroupedByLetter.push({ "label": grouplabel, "characters": npcgroup });
            }
            charactersGroupedByLetter[0].characters.forEach(async key => {
                messageSelectMenuOptionsArray.push({
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
            const categorySelectionId = messageComponentsArray[0].components[0].customId;
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
                                .map(function (key) { return { label: `${options[key].split(',')[0]}`, value: `${options[key].split(',')[1]}` } })))
                    response.message.edit({ components: newSelectionMenu.components })
                    return false;
                }
                return true;
            };
        }
    });
    //TODO revision this since id can't be used to call from database

    await interaction.reply({
        content: "chose an npc to impersonate",
        components: messageComponentsArray,
        fetchReply: true,
    }).then(async () => {
        await interaction.channel.awaitMessageComponent({
            filter: myFilter,
            max: 1,
            time: 30000,
            errors: ['time']
        }).then(async (interaction) => {
            interaction.deferUpdate();
            await NonPlayableCharacter.findOne({ where: { id: interaction.values[0], server: interaction.guildId } })
                .then((character) => {
                    if (character) {
                        character.using_npc = interaction.member.user.id;
                        character.save()
                        interaction.channel.send({
                            content: "Dungeon Master " + dm
                                + " is now impersonating " + character.name + "."
                        })
                            .then(msg => { setTimeout(() => msg.delete(), 3000) })
                            .catch(err => logger.error(err));
                    }
                })
        }).catch(function () {
            interaction.channel.send({
                content: "This poll has been open for too long, it no longer accepts answers."
            }).then(msg => { setTimeout(() => msg.delete(), 3000) })
                .catch(err => logger.error(err));
        })
    })
}

module.exports.help = {
    // name: 'impersonate',
    // permission: [],
    // alias: [],
    category: "Dungeons & Dragons",
    name: 'impersonate',
    description: 'Allows a dm to talk as if he/she is that npc.',
    ephemeral: true,
}