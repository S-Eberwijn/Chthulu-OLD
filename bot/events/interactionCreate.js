const { writeToJsonDb } = require('../otherFunctions/writeToJsonDb')
const { getBotEmbed } = require('../otherFunctions/botEmbed')
const PlayerCharacter = require('../../database/models/PlayerCharacter');
const NonPlayableCharacter = require('../../database/models/NonPlayableCharacter');
const QUESTIONS_ARRAY = require('../jsonDb/npcCreationQuestions.json');
const CHARACTER_QUESTIONS_ARRAY = require('../jsonDb/characterCreationQuestions.json');
const {getNonPlayableCharacterEmbed, getCharacterEmbed}  = require('../otherFunctions/characterEmbed');
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const { cp } = require('fs/promises');

//characterbuttons
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

//npcbuttons
const messageComponents4 = new MessageActionRow().addComponents(
    new MessageButton()
        .setCustomId('change-npc-name-button')
        .setLabel('Change Name')
        .setStyle('SECONDARY'),
    new MessageButton()
        .setCustomId('change-npc-age-button')
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
        .setCustomId('change-npc-picture-button')
        .setLabel('Change Picture')
        .setStyle('SECONDARY'),
    new MessageButton()
        .setCustomId('change-npc-visibility-button')
        .setLabel('Edit Visibility')
        .setStyle('SECONDARY'),
    new MessageButton()
        .setCustomId('delete-npc-button')
        .setLabel('Delete Character')
        .setStyle('DANGER')
);


module.exports = async (bot, interaction) => {

    if (interaction.isCommand()) {
        const slashCommands = bot.slashCommands.get(interaction.commandName)
        if (slashCommands) return slashCommands.run(interaction)
    }



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
    //edit npc buttons
    try{
        let charId = "";
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
                return;
            case 'change-npc-name-button':
                await npcEditTextField(interaction,interaction.channel.name.split("⼁")[0], QUESTIONS_ARRAY[0],bot)
                await NonPlayableCharacter.findOne({ where: { character_id: interaction.channel.name.split("⼁")[0], server_id: interaction.guildId } }).then((character) => {
                    if (character){
                        interaction.channel.setName(character.get("character_id") + "⼁" + character.get('name'))
                    }
                });
                return;
            case 'change-npc-race-button':
                await npcEditTextField(interaction,interaction.channel.name.split("⼁")[0], QUESTIONS_ARRAY[1],bot)
                return;
            case 'change-npc-class-button':
                if(!interaction.member.roles.cache.has(interaction.guild.roles.cache.find(role => role.name.includes('Dungeon Master')).id)){
                    interaction.channel.send("How did you even get here? regardless you need the Dungeon Master role to edit npcs")
                    .then(msg => { setTimeout(() => msg.delete(), 3000) })
                    .catch(err => console.log(err));
                    return;
                }
                charId = interaction.channel.name.split("⼁")[0];
                interaction.deferUpdate();
                let questionEmbed = new MessageEmbed()
                    .setAuthor(`${bot.user.username}`, bot.user.displayAvatarURL())
                    .setColor("GREEN")
                    .setDescription(QUESTIONS_ARRAY[2].question);
                let messageComponentsArray = [];
                messageComponentsArray.push(new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setCustomId(`characterQuestion${2}`)
                        .setPlaceholder('Select a value...')
                        .setMinValues(1)
                        .setMaxValues(1)
                        .setDisabled(false)
                        .addOptions(Object.keys(QUESTIONS_ARRAY[2].answers).map(function (key) { return { label: `${QUESTIONS_ARRAY[2].answers[key]}`, value: `${QUESTIONS_ARRAY[2].answers[key]}` } }))
                ))
                let createdChannel = interaction.channel;
                await createdChannel.send({ embeds: [questionEmbed], components: messageComponentsArray, fetchReply: true }).then(async () => {
                    await createdChannel.awaitMessageComponent({
                        max: 1,
                        time: 300000,
                        errors: ['time'],
                    }).then(async (interaction) => {
                        interaction.deferUpdate();
                        await NonPlayableCharacter.findOne({ where: { character_id: charId, server_id: interaction.guildId } }).then((character) =>{
                            if (character) {
                                character.set(QUESTIONS_ARRAY[2].databaseTable, interaction.values[0])
                                character.save().then(async () => {
                                    try{
                                    interaction.channel.bulkDelete(30);
                                    }catch(e){
                                        console.log(e);
                                        console.log("problem with deleting messages");
                                    }
                                    interaction.channel.send("The " + QUESTIONS_ARRAY[2].databaseTable + " of " + character.get("name") + " has been changed to " + character.get(QUESTIONS_ARRAY[2].databaseTable) + ".")
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
                        });
                    }).catch(function () {
                        interaction.channel.send("Times up! You took too long to respond. Field remains unchanged.")
                        .then(msg => { setTimeout(() => msg.delete(), 3000) })
                        .catch(err => console.log(err));
                    });  
                });
                return;
            case 'change-npc-title-button':
                await npcEditTextField(interaction,interaction.channel.name.split("⼁")[0], QUESTIONS_ARRAY[3],bot)
                return;
            case 'change-npc-age-button':
                await npcEditTextField(interaction,interaction.channel.name.split("⼁")[0], QUESTIONS_ARRAY[4],bot)
                return;
            case 'change-npc-description-button':
                await npcEditTextField(interaction,interaction.channel.name.split("⼁")[0], QUESTIONS_ARRAY[5],bot)
                return;
            case 'change-npc-description-button':
                await npcEditTextField(interaction,interaction.channel.name.split("⼁")[0], QUESTIONS_ARRAY[6],bot)
                return;
            case 'delete-npc-button':
                interaction.deferUpdate();
                if(!interaction.member.roles.cache.has(interaction.guild.roles.cache.find(role => role.name.includes('Dungeon Master')).id)){
                    interaction.channel.send("How did you even get here? regardless you need the Dungeon Master role to edit npcs")
                    .then(msg => { setTimeout(() => msg.delete(), 3000) })
                    .catch(err => console.log(err));
                    return;
                }
                charId = interaction.channel.name.split("⼁")[0];
                await NonPlayableCharacter.findOne({ where: { character_id: charId, server_id: interaction.guildId } }).then((character) =>{
                    try{
                        character.destroy().then(async () => {
                            interaction.channel.delete().then(() => {
                                interaction.user.send({ content: 'Times up! You took too long to respond. Try again by requesting a new character creation channel.' });
                            });
                        });
                    }catch(err ){
                        console.log(err);
                    }
                });
                return;
            }
    }catch (error) {
        console.log(error)
    }
    //edit character buttons
    try{
        let questionEmbed;
        let messageComponentsArray = [];
        let createdChannel = interaction.channel;
        switch (interaction.customId){
            case 'change-character-name-button':
                await characterEditTextField(interaction, CHARACTER_QUESTIONS_ARRAY[0],bot)
                await PlayerCharacter.findOne({ where: {  player_id: interaction.user.id, alive: 1, server_id: interaction.guildId } }).then((character) => {
                    if (character){
                        interaction.channel.setName(character.get('name'))
                    }
                });
                return;
            case 'change-character-age-button':
                await characterEditTextField(interaction, CHARACTER_QUESTIONS_ARRAY[4],bot)
                return;
            case 'change-character-short-story-button':
                await characterEditTextField(interaction, CHARACTER_QUESTIONS_ARRAY[5],bot)
                return;
            case 'change-character-race-button':
                interaction.deferUpdate();
                let messageSelectMenuOptionsArray = [];
                CHARACTER_QUESTIONS_ARRAY[1].answers[0].values.forEach(async key => {
                    await messageSelectMenuOptionsArray.push({
                        label: `${key}`,
                        value: `${key}`
                    })
                })
                questionEmbed = new MessageEmbed()
                    .setAuthor(`${bot.user.username}`, bot.user.displayAvatarURL())
                    .setColor("GREEN")
                    .setDescription(CHARACTER_QUESTIONS_ARRAY[1].question);
                messageComponentsArray.push(new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setCustomId(`characterRaceCategorySelection`)
                        .setPlaceholder('Select a category...')
                        .setMinValues(1)
                        .setMaxValues(1)
                        .setDisabled(false)
                        .addOptions(Object.keys(CHARACTER_QUESTIONS_ARRAY[1].answers)
                        .map(function (key) {
                            return { label: `${CHARACTER_QUESTIONS_ARRAY[1].answers[key].category}`, 
                            value: `${CHARACTER_QUESTIONS_ARRAY[1].answers[key].category}` } }))
                ))
                messageComponentsArray.push(new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setCustomId(`characterQuestion${1}`)
                        .setPlaceholder('Select a value...')
                        .setMinValues(1)
                        .setMaxValues(1)
                        .setDisabled(true)
                        .addOptions(messageSelectMenuOptionsArray)
                ))
                categorySelectionId = messageComponentsArray[0].components[0].customId;
                const filter = response => {
                    if (response.user.id === bot.user.id) return false;
                    if (response.customId === categorySelectionId) {
                        let newSelectionMenu = response.message;
                        newSelectionMenu.components[0].components[0].placeholder = response.values[0];
                        newSelectionMenu.components[1] = new MessageActionRow().addComponents(
                            new MessageSelectMenu()
                                .setCustomId(`characterQuestion${1}`)
                                .setPlaceholder('Select a value...')
                                .setMinValues(1)
                                .setMaxValues(1)
                                .setDisabled(false)
                                .addOptions(Object.keys(CHARACTER_QUESTIONS_ARRAY[1].answers[Object.keys(CHARACTER_QUESTIONS_ARRAY[1].answers)
                                    .filter(function (key) 
                                        { 
                                            return CHARACTER_QUESTIONS_ARRAY[1].answers[key].category === response.values[0] 
                                        })[0]].values)
                                    .map(function (key) { 
                                        return { 
                                            label: `${CHARACTER_QUESTIONS_ARRAY[1]
                                            .answers[Object.keys(CHARACTER_QUESTIONS_ARRAY[1].answers)
                                            .filter(function (key) { 
                                                return CHARACTER_QUESTIONS_ARRAY[1].answers[key].category === response.values[0] })[0]]
                                                    .values[key]}`, value: `${CHARACTER_QUESTIONS_ARRAY[1].answers[Object.keys(CHARACTER_QUESTIONS_ARRAY[1].answers)
                                                    .filter(function (key) 
                                                    { 
                                                        return CHARACTER_QUESTIONS_ARRAY[1].answers[key].category === response.values[0] 
                                                    })[0]].values[key]}` 
                                                } 
                                            })
                                        )
                        )
                        response.deferUpdate();
                        response.message.edit({ components: newSelectionMenu.components })
                        return false;
                    }
                    return true;
                }
                await createdChannel.send({ embeds: [questionEmbed], components: messageComponentsArray, fetchReply: true }).then(async () => {
                    await createdChannel.awaitMessageComponent({
                        filter,
                        max: 1,
                        time: 300000,
                        errors: ['time'],
                    }).then(async (interaction) => {
                        interaction.deferUpdate();
                        await PlayerCharacter.findOne({ where: { player_id: interaction.user.id, alive: 1, server_id: interaction.guildId } }).then((character) =>{
                            if (character) {
                                character.set(CHARACTER_QUESTIONS_ARRAY[1].databaseTable, interaction.values[0])
                                character.save().then(async () => {
                                    try{
                                    interaction.channel.bulkDelete(30);
                                    }catch(e){
                                        console.log(e);
                                        console.log("problem with deleting messages");
                                    }
                                    interaction.channel.send("The " + CHARACTER_QUESTIONS_ARRAY[1].databaseTable + " of " + character.get("name") + " has been changed to " + character.get(CHARACTER_QUESTIONS_ARRAY[1].databaseTable) + ".")
                                        .then(msg => { setTimeout(() => msg.delete(), 3000) })
                                        .catch(err => console.log(err));
                                    interaction.channel.send({ 
                                        embeds: [await getCharacterEmbed(character)],
                                        components: [messageComponents1, messageComponents2, messageComponents3]})
                                        .catch(err => console.log(err));
                                });
                            }else {
                                interaction.channel.send("This character has been deleted from our database.")
                                    .then(msg => { setTimeout(() => msg.delete(), 3000) })
                                    .catch(err => console.log(err));
                            }
                        });
                    }).catch(function () {
                        interaction.channel.send("Times up! You took too long to respond. Field remains unchanged.")
                        .then(msg => { setTimeout(() => msg.delete(), 3000) })
                        .catch(err => console.log(err));
                    });  
                });
                return;
            case 'change-character-class-button':
                interaction.deferUpdate();
                questionEmbed = new MessageEmbed()
                    .setAuthor(`${bot.user.username}`, bot.user.displayAvatarURL())
                    .setColor("GREEN")
                    .setDescription(CHARACTER_QUESTIONS_ARRAY[2].question);
                messageComponentsArray.push(new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setCustomId(`characterQuestion${2}`)
                        .setPlaceholder('Select a value...')
                        .setMinValues(1)
                        .setMaxValues(1)
                        .setDisabled(false)
                        .addOptions(Object.keys(CHARACTER_QUESTIONS_ARRAY[2].answers).map(function (key) { return { label: `${CHARACTER_QUESTIONS_ARRAY[2].answers[key]}`, value: `${CHARACTER_QUESTIONS_ARRAY[2].answers[key]}` } }))
                ))
                await createdChannel.send({ embeds: [questionEmbed], components: messageComponentsArray, fetchReply: true }).then(async () => {
                    await createdChannel.awaitMessageComponent({
                        max: 1,
                        time: 300000,
                        errors: ['time'],
                    }).then(async (interaction) => {
                        interaction.deferUpdate();
                        await PlayerCharacter.findOne({ where: { player_id: interaction.user.id, alive: 1, server_id: interaction.guildId } }).then((character) =>{
                            if (character) {
                                character.set(CHARACTER_QUESTIONS_ARRAY[2].databaseTable, interaction.values[0])
                                character.save().then(async () => {
                                    try{
                                    interaction.channel.bulkDelete(30);
                                    }catch(e){
                                        console.log(e);
                                        console.log("problem with deleting messages");
                                    }
                                    interaction.channel.send("The " + CHARACTER_QUESTIONS_ARRAY[2].databaseTable + " of " + character.get("name") + " has been changed to " + character.get(CHARACTER_QUESTIONS_ARRAY[2].databaseTable) + ".")
                                        .then(msg => { setTimeout(() => msg.delete(), 3000) })
                                        .catch(err => console.log(err));
                                    interaction.channel.send({ 
                                        embeds: [await getCharacterEmbed(character)],
                                        components: [messageComponents1, messageComponents2, messageComponents3]})
                                        .catch(err => console.log(err));
                                });
                            }else {
                                interaction.channel.send("This character has been deleted from our database.")
                                    .then(msg => { setTimeout(() => msg.delete(), 3000) })
                                    .catch(err => console.log(err));
                            }
                        });
                    }).catch(function () {
                        interaction.channel.send("Times up! You took too long to respond. Field remains unchanged.")
                        .then(msg => { setTimeout(() => msg.delete(), 3000) })
                        .catch(err => console.log(err));
                    });  
                });
                return;
            case 'change-character-background-button':
                interaction.deferUpdate();
                questionEmbed = new MessageEmbed()
                    .setAuthor(`${bot.user.username}`, bot.user.displayAvatarURL())
                    .setColor("GREEN")
                    .setDescription(CHARACTER_QUESTIONS_ARRAY[2].question);
                messageComponentsArray = [];
                for (let index = 0; index < Math.ceil(CHARACTER_QUESTIONS_ARRAY[3].answers.length / 25); index++) {
                    const elements = CHARACTER_QUESTIONS_ARRAY[3].answers.slice(index * 25, 25 * (index + 1));
                    console.log(elements)
                    messageComponentsArray.push(new MessageActionRow().addComponents(
                        new MessageSelectMenu()
                            .setCustomId(`characterQuestion${index}`)
                            .setPlaceholder('Select a value...')
                            .setMinValues(1)
                            .setMaxValues(1)
                            .setDisabled(false)
                            .addOptions(Object.keys(elements)
                            .map(function (key) { return { label: `${elements[key]}`, value: `${elements[key]}` } }))
                    ))
                }
                await createdChannel.send({ embeds: [questionEmbed], components: messageComponentsArray, fetchReply: true }).then(async () => {
                    await createdChannel.awaitMessageComponent({
                        max: 1,
                        time: 300000,
                        errors: ['time'],
                    }).then(async (interaction) => {
                        interaction.deferUpdate();
                        await PlayerCharacter.findOne({ where: { player_id: interaction.user.id, alive: 1, server_id: interaction.guildId } }).then((character) =>{
                            if (character) {
                                character.set(CHARACTER_QUESTIONS_ARRAY[3].databaseTable, interaction.values[0])
                                character.save().then(async () => {
                                    try{
                                    interaction.channel.bulkDelete(30);
                                    }catch(e){
                                        console.log(e);
                                        console.log("problem with deleting messages");
                                    }
                                    interaction.channel.send("The " + CHARACTER_QUESTIONS_ARRAY[3].databaseTable + " of " + character.get("name") + " has been changed to " + character.get(CHARACTER_QUESTIONS_ARRAY[3].databaseTable) + ".")
                                        .then(msg => { setTimeout(() => msg.delete(), 3000) })
                                        .catch(err => console.log(err));
                                    interaction.channel.send({ 
                                        embeds: [await getCharacterEmbed(character)],
                                        components: [messageComponents1, messageComponents2, messageComponents3]})
                                        .catch(err => console.log(err));
                                });
                            }else {
                                interaction.channel.send("This character has been deleted from our database.")
                                    .then(msg => { setTimeout(() => msg.delete(), 3000) })
                                    .catch(err => console.log(err));
                            }
                        });
                    }).catch(function () {
                        interaction.channel.send("Times up! You took too long to respond. Field remains unchanged.")
                        .then(msg => { setTimeout(() => msg.delete(), 3000) })
                        .catch(err => console.log(err));
                    });  
                });
                return;
            case 'change-character-picture-button':
                await characterEditTextField(interaction, CHARACTER_QUESTIONS_ARRAY[6],bot)
                return;
            case 'delete-character-button':
                await PlayerCharacter.findOne({ where: {  player_id: interaction.user.id, alive: 1, server_id: interaction.guildId } }).then((character) =>{
                    if (character) {
                        character.set("alive",0);
                        character.set("status","DELETED");
                        character.save().then(async () => {
                            try{
                            interaction.channel.bulkDelete(30);
                            }catch(e){
                                console.log(e);
                                console.log("problem with deleting messages");
                            }
                            interaction.channel.send(character.get("name") + " has been deleted, the character is no longer editable.")
                            interaction.channel.send({ 
                                embeds: [await getNonPlayableCharacterEmbed(character)]})
                                .catch(err => console.log(err));
                        });
                    }else {
                        interaction.channel.send("This character has been deleted from our database.")
                            .then(msg => { setTimeout(() => msg.delete(), 3000) })
                            .catch(err => console.log(err));
                    }
                })
                return;
        }
    }catch(err) {console.log(err)}

    
};

async function npcEditTextField(interaction,charId, QUESTION_OBJECT,bot){
    interaction.deferUpdate();
    if(!interaction.member.roles.cache.has(interaction.guild.roles.cache.find(role => role.name.includes('Dungeon Master')).id)){
        interaction.channel.send("How did you even get here? regardless you need the Dungeon Master role to edit npcs")
        .then(msg => { setTimeout(() => msg.delete(), 3000) })
        .catch(err => console.log(err));
        return;
    }
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
                        interaction.channel.bulkDelete(30);
                        }catch(e){
                            console.log(e);
                            console.log("problem with deleting messages");
                        }
                        interaction.channel.send("The " + QUESTION_OBJECT.databaseTable + " of " + character.get("name") + " has been changed to " + character.get(QUESTION_OBJECT.databaseTable) + ".")
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
            interaction.channel.send("Times up! You took too long to respond. Field remains unchanged.")
                .then(msg => { setTimeout(() => msg.delete(), 3000) })
                .catch(err => console.log(err));
        });                  
    });
}

async function characterEditTextField(interaction, QUESTION_OBJECT,bot){
    interaction.deferUpdate();
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
            await PlayerCharacter.findOne({ where: {  player_id: interaction.user.id, alive: 1, server_id: interaction.guildId } }).then((character) =>{
                if (character) {
                    character.set(QUESTION_OBJECT.databaseTable,collected.first().content.charAt(0).toUpperCase() + collected.first().content.slice(1));
                    character.save().then(async () => {
                        try{
                        interaction.channel.bulkDelete(30);
                        }catch(e){
                            console.log(e);
                            console.log("problem with deleting messages");
                        }
                        interaction.channel.send("The " + QUESTION_OBJECT.databaseTable + " of " + character.get("name") + " has been changed to " + character.get(QUESTION_OBJECT.databaseTable) + ".")
                            .then(msg => { setTimeout(() => msg.delete(), 3000) })
                            .catch(err => console.log(err));
                        interaction.channel.send({ 
                            embeds: [await getCharacterEmbed(character)],
                            components: [messageComponents1, messageComponents2, messageComponents3]})
                            .catch(err => console.log(err));
                    });
                }else {
                    interaction.channel.send("This character has been deleted from our database.")
                        .then(msg => { setTimeout(() => msg.delete(), 3000) })
                        .catch(err => console.log(err));
                }
            })
        }).catch(function () {
            interaction.channel.send("Times up! You took too long to respond. Field remains unchanged.")
                .then(msg => { setTimeout(() => msg.delete(), 3000) })
                .catch(err => console.log(err));
        });                  
    });
}