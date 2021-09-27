const { writeToJsonDb } = require('../otherFunctions/writeToJsonDb')
const { getBotEmbed } = require('../otherFunctions/botEmbed')
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const PlayerCharacter = require('../../database/models/PlayerCharacter');
const NonPlayableCharacter = require('../../database/models/NonPlayableCharacter');
const QUESTIONS_ARRAY = require('../jsonDb/npcCreationQuestions.json');
const {getNonPlayableCharacterEmbed }  = require('../otherFunctions/characterEmbed');
const { cp } = require('fs/promises');
const messageComponents1 = new MessageActionRow().addComponents(
    new MessageButton()
        .setCustomId('change-character-name-button')
        .setLabel('Change Name')
        .setStyle('SECONDARY'),
    new MessageButton()
        .setCustomId('change-character-age-button')
        .setLabel('Change Age')
        .setStyle('SECONDARY'),
    new MessageButton()
        .setCustomId('change-character-short-story-button')
        .setLabel('Change Short-Story')
        .setStyle('SECONDARY'),
);
const messageComponents2 = new MessageActionRow().addComponents(
    new MessageButton()
        .setCustomId('change-character-race-button')
        .setLabel('Change Race')
        .setStyle('SECONDARY'),
    new MessageButton()
        .setCustomId('change-character-class-button')
        .setLabel('Change Class')
        .setStyle('SECONDARY'),
    new MessageButton()
        .setCustomId('change-character-background-button')
        .setLabel('Change Background')
        .setStyle('SECONDARY'),
);
const messageComponents3 = new MessageActionRow().addComponents(
    new MessageButton()
        .setCustomId('change-character-picture-button')
        .setLabel('Change Picture')
        .setStyle('SECONDARY'),
    new MessageButton()
        .setCustomId('delete-character-button')
        .setLabel('Delete Character')
        .setStyle('DANGER')
);
const messageComponents4 = new MessageActionRow().addComponents(
    new MessageButton()
        .setCustomId('change-character-name-button')
        .setLabel('Change Name')
        .setStyle('SECONDARY'),
    new MessageButton()
        .setCustomId('change-character-age-button')
        .setLabel('Change Age')
        .setStyle('SECONDARY'),
    new MessageButton()
        .setCustomId('change-npc-description-button')
        .setLabel('Change Short-Story')
        .setStyle('SECONDARY'),
);
const messageComponents5 = new MessageActionRow().addComponents(
    new MessageButton()
        .setCustomId('change-npc-race-button')
        .setLabel('Change Race')
        .setStyle('SECONDARY'),
    new MessageButton()
        .setCustomId('change-npc-class-button')
        .setLabel('Change Class')
        .setStyle('SECONDARY'),
    new MessageButton()
        .setCustomId('change-npc-title-button')
        .setLabel('Change Occupation')
        .setStyle('SECONDARY'),
);
const messageComponents6 = new MessageActionRow().addComponents(
    new MessageButton()
        .setCustomId('change-character-picture-button')
        .setLabel('Change Picture')
        .setStyle('SECONDARY'),
    new MessageButton()
        .setCustomId('change-npc-visibility-button')
        .setLabel('Edit Visibility')
        .setStyle('SECONDARY'),
    new MessageButton()
        .setCustomId('delete-character-button')
        .setLabel('Delete Character')
        .setStyle('DANGER')
);


module.exports = async (bot, interaction) => {
    //TODO: Might change later when applying buttons to character creation 
    // if (!(interaction.user.id === interaction.message.author.id)) return interaction.reply({ content: `These buttons are not meant for you!`, ephemeral: true})
    try {
        // !chthulu
        switch (interaction.customId) {
            case 'like-bot-button':
                let likesAndDislikes = require('../jsonDb/likesAndDislikes.json')
                likesAndDislikes['likes'].push({ userID: `${interaction.user.id}` })
                writeToJsonDb('likesAndDislikes', likesAndDislikes);
                interaction.message.edit({ embeds: [await getBotEmbed(bot)] })
                return interaction.deferUpdate();
            case 'dislike-bot-button':
                return interaction.reply({ content: `This button does nothing, you better press on the \`♥️ Like\` button!`, ephemeral: true })
            case 'help-bot-button':
                const { sendHelpEmbedFunction } = require('../otherFunctions/sendHelpEmbedFunction.js')
                sendHelpEmbedFunction(bot, interaction.guildId, interaction.channelId, interaction.user.id);
                return interaction.deferUpdate();

        }
    } catch (error) {
        console.log(error);
    }
    try {
        //!createCharacter
        switch (interaction.customId) {
            case 'approve-character-button':
                await PlayerCharacter.findOne({ where: { player_id: interaction.user.id, server_id: interaction.guildId, alive: 1, status: "CREATED" } }).then((character) => { if (character) { character['alive'] = 0; character.save() } });
                await PlayerCharacter.findOne({ where: { player_id: interaction.user.id, server_id: interaction.guildId, status: "CREATING" } }).then((character) => {
                    if (character) {
                        character['status'] = 'CREATED';
                        character['alive'] = 1;
                        character.save().then(() => interaction.message.edit({ content: null, components: [messageComponents1, messageComponents2, messageComponents3] }))
                    }
                });
                return interaction.reply({ content: `Approved this character`, ephemeral: true })
            case 'decline-character-button':
                return interaction.message.channel.delete().catch(err => console.error(err));
        }
        //!createnpc
        switch (interaction.customId) {
            case 'approve-npc-button':
                //await NonPlayableCharacter.findOne({ where: { creator_id: interaction.guild.roles.cache.find(role => role.name === "Dungeon Master").id, server_id: interaction.guildId, status: "CREATED" } });
                await NonPlayableCharacter.findOne({ where: { creator_id: interaction.user.id, server_id: interaction.guildId, status: "CREATING" } }).then((character) => {
                    if (character) {
                        character.set("status",'INVISIBLE');
                        character.save().then(() => interaction.message.edit({ content: null, components: [messageComponents4, messageComponents5, messageComponents6] }))
                    }
                });
                return interaction.reply({ content: `Approved this character`, ephemeral: true })
            case 'decline-npc-button':
                return interaction.message.channel.delete().catch(err => console.error(err));
        }
    } catch (error) {
        console.log(error)
    } finally {
        // interaction.deferUpdate();
    }

    try{
        let charId  ="";
        switch (interaction.customId) {
            case 'change-npc-visibility-button':
                interaction.deferUpdate();
                if(!interaction.member.roles.cache.has(interaction.guild.roles.cache.find(role => role.name.includes('Dungeon Master')).id)){
                    interaction.channel.send("Only Dm's can set NPC's to visible").then(msg => { setTimeout(() => msg.delete(), 3000) }).catch(err => console.log(err));
                    return;
                }
                charId = interaction.channel.name.split("⼁")[0];
                await NonPlayableCharacter.findOne({ where: { character_id: charId, server_id: interaction.guildId } }).then((character) => {
                    if (character) {
                        if(character.get("status")=="VISIBLE"){ 
                            character.set("status",'INVISIBLE');
                            character.save()
                        } else if(character.get("status")=="INVISIBLE"){ 
                            character.set("status",'VISIBLE');
                            character.save()
                        }
                        interaction.channel.send(character.get("name")+" is now " + character.get("status").toLowerCase( ) + " for all players")
                            .then(msg => { setTimeout(() => msg.delete(), 3000) }).catch(err => console.log(err));
                    }
                });
            
            case 'change-npc-title-button':
                interaction.deferUpdate();
                if(!interaction.member.roles.cache.has(interaction.guild.roles.cache.find(role => role.name.includes('Dungeon Master')).id)){
                    interaction.channel.send("Only Dm's can set NPC's to visible").then(msg => { setTimeout(() => msg.delete(), 3000) }).catch(err => console.log(err));
                    return;
                }
                charId = interaction.channel.name.split("⼁")[0];
                let QUESTION_OBJECT = QUESTIONS_ARRAY[3];
                let questionEmbed = new MessageEmbed()
                    .setAuthor(`${bot.user.username}`, bot.user.displayAvatarURL())
                    .setColor("GREEN")
                    .setDescription(QUESTION_OBJECT.question)
                let createdChannel = interaction.channel;
                await createdChannel.send({ embeds: [questionEmbed], fetchReply: true }).then(async () => {
                    let regExp = new RegExp(QUESTION_OBJECT.regex);
                    const filter = response => {
                        if (response.author.id === bot.user.id) return false;
                        if (regExp.exec(response.content) === null) {
                            createdChannel.send({ content: QUESTION_OBJECT.errorMessage });
                            return false;
                        }
                        return true;
                    };
                    await createdChannel.awaitMessages({
                        filter,
                        max: 1,
                        time: 300000,
                        errors: ['time'],
                    }).then(async (collected) => {
                        await NonPlayableCharacter.findOne({ where: { character_id: charId, server_id: interaction.guildId } }).then((character) =>{
                            if (character) {
                                character.set(QUESTION_OBJECT.databaseTable,collected.first().content.charAt(0).toUpperCase() + collected.first().content.slice(1));
                                character.save().then(async () => {
                                    try{
                                    interaction.channel.bulkDelete(3);
                                    }catch(e){
                                        console.log(e);
                                        console.log("problem with deleting messages");
                                    }
                                    interaction.channel.send("the occupation of " + character.get("name") + " has been changed to " + character.get("title") + ".")
                                        .then(msg => { setTimeout(() => msg.delete(), 3000) })
                                        .catch(err => console.log(err));
                                    interaction.channel.send({ 
                                        embeds: [await getNonPlayableCharacterEmbed(character)],
                                        components: [messageComponents4, messageComponents5, messageComponents6]})
                                        .catch(err => console.log(err));
                                });
                            }else {
                                interaction.channel.send("This character has been deleted from our database.")
                                    .then(msg => { setTimeout(() => msg.delete(), 3000) })
                                    .catch(err => console.log(err));
                            }
                        })
                    }).catch(function () {
                        interaction.channel.send("Times up! You took too long to respond. Occupation remains unchanged.")
                            .then(msg => { setTimeout(() => msg.delete(), 3000) })
                            .catch(err => console.log(err));
                    });                  
                });
            }
    }catch (error) {
        console.log(error)
    }
};