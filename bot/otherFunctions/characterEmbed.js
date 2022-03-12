const { MessageEmbed, MessageAttachment } = require('discord.js');
const { loadImage, createCanvas } = require('canvas');
const { getAverageColor } = require('fast-average-color-node');
const { paginationEmbed } = require('../otherFunctions/paginationEmbed')


exports.sendCharacterEmbedMessageFromInteraction = async function (interaction, character, content, components = []) {
    await interaction.editReply({
        content: content,
        embeds: [await getCharacterEmbed(character)],
        files: [await getCharacterLevelImage(character),
        await getCharacterPicture(character)],
        components: components
    });
}
exports.sendCharacterEmbedMessageInChannel = async function (channel, character, content, components = []) {
    await channel.send({
        content: content,
        embeds: [await getCharacterEmbed(character)],
        files: [await getCharacterLevelImage(character),
        await getCharacterPicture(character)],
        components: components
    });
}
exports.sendNPCEmbedMessageInChannel = async function (channel, character, content, components = []) {
    await channel.send({
        content: content,
        embeds: [await getNonPlayableCharacterEmbed(character)],
        files: [await getCharacterPicture(character)],
        components: components
    });
}
exports.sendNPCCharacterEmbedMessageFromInteraction = async function (interaction, character, content, components = []) {
    await interaction.reply({
        content: content,
        embeds: [await getNonPlayableCharacterEmbed(character)],
        files: [await getCharacterPicture(character)],
        components: components
    });
}
exports.createNPCPaginationEmbedInChannel = async function (channel,characters,components = []) {
    let npcArray = [];
    for (const npc of characters) {
        npcArray.push(await getNonPlayableCharacterEmbed(npc))
    }

    await paginationEmbed(channel, npcArray, components)
}

async function getCharacterEmbed(character) {
    // console.log(character);
    return new MessageEmbed()
        .setColor(await getAverageImageColor(character.picture_url))
        .setThumbnail(`attachment://${character.level}.png`)
        .setTitle(`${await getCharacterFullName(character)} (${character.age})`)
        .setImage(`attachment://img.png`)
        .setDescription(character.description)
        .addFields(
            { name: '\*\*RACE\*\*', value: `${character.race}`, inline: true },
            { name: '\*\*CLASS\*\*', value: `${character.class}`, inline: true },
            { name: '\*\*BACKGROUND\*\*', value: `${character.background}`, inline: true }
        )
}

async function getNonPlayableCharacterEmbed(npc) {
    //console.log(npc);
    return new MessageEmbed()
        .setColor("#2C2F33")
        .setTitle(`${npc.name} (${npc.age || '?'})`)
        .setImage(npc.picture_url)
        .setDescription(npc.description)
        .addFields(
            { name: '\*\*RACE\*\*', value: `${npc.race}`, inline: true },
            { name: '\*\*CLASS\*\*', value: `${npc.class}`, inline: true },
            { name: '\*\*OCCUPATION\*\*', value: `${npc.title}`, inline: true }
        );
}

//TODO: This sometimes doesnt show
async function getCharacterLevelImage(character) {
    return new MessageAttachment(`./bot/images/DnD/CharacterLevel/${character.level}.png`)
}

function getCharacterFullName(character) {
    let characterTitle = character.name;
    if (character.title) {
        characterTitle = '';
        if (hasWhiteSpace(character.name)) {
            let temporaryNameHolder = character.name.split(' ');
            for (let i = 0; i < temporaryNameHolder.length; i++) {
                characterTitle += temporaryNameHolder[i] + ' ';
                if (i === 0) {
                    characterTitle += `\"${character.title}\" `;
                }
            }
        } else {
            characterTitle = `${character.name} \"${character.title}\"`;
        }
    }
    return characterTitle;
}

function hasWhiteSpace(s) {
    return s.indexOf(' ') >= 0;
}

async function getCharacterPicture(character) {
    // const background = await loadImage(character.get('picture_url').toLowerCase());

    const canvas = createCanvas(1200, 900);
    const context = canvas.getContext('2d');

    const url = character.picture_url
    // console.log(url);
    const image = await loadImage(url)

    var hRatio = canvas.width / image.width;
    var vRatio = canvas.height / image.height;
    var ratio = Math.min(hRatio, vRatio);
    var centerShift_x = (canvas.width - image.width * ratio) / 2;
    var centerShift_y = (canvas.height - image.height * ratio) / 2;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, image.width, image.height,
        centerShift_x, centerShift_y, image.width * ratio, image.height * ratio);

    return new MessageAttachment(canvas.toBuffer(), 'img.png');
}

async function getAverageImageColor(imageUrl) {
    const color = await getAverageColor(imageUrl)
    return color.hex ? color.hex : "#2C2F33";
}
