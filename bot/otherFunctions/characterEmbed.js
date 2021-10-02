const { MessageEmbed, MessageAttachment } = require('discord.js');
const Canvas = require('canvas');
const { Image, loadImage, createCanvas } = require('canvas');
const { getAverageColor } = require('fast-average-color-node');


exports.sendCharacterEmbedMessageFromInteraction = async function (interaction, character,content,components=[]) {
    await interaction.reply({
        content: content,
        embeds: [   await getCharacterEmbed(character)], 
        files: [    await getCharacterLevelImage(character), 
                    await getCharacterPicture(character)],
        components: components});
}
exports.sendCharacterEmbedMessageInChannel = async function (channel, character,content,components=[]) {
    await channel.send({ 
        content: content,
        embeds: [   await getCharacterEmbed(character)], 
        files: [    await getCharacterLevelImage(character), 
                    await getCharacterPicture(character)],
        components:components});
}
exports.sendNPCEmbedMessageInChannel = async function (channel, character,content,components=[]) {
    await channel.send({ 
        content: content,
        embeds: [   await getNonPlayableCharacterEmbed(character)], 
        files: [    await getCharacterPicture(character)],
        components: components});
}
exports.sendNPCCharacterEmbedMessageFromInteraction = async function (interaction, character,content,components=[]) {
    await interaction.reply({
        content: content,
        embeds: [   await getNonPlayableCharacterEmbed(character)], 
        files: [    await getCharacterPicture(character)],
        components: components });
}
async function getCharacterEmbed(character) {
    // console.log(character);
    return new MessageEmbed()
        .setColor(await getAverageImageColor(character.get('picture_url')))
        .setThumbnail(`attachment://${character.get('level')}.png`)
        .setTitle(`${await getCharacterFullName(character)} (${character.get('age')})`)
        .setImage(`attachment://img.png`)
        .setDescription(character.get('description'))
        .addFields(
            { name: '\*\*RACE\*\*', value: `${character.get('race')}`, inline: true },
            { name: '\*\*CLASS\*\*', value: `${character.get('class')}`, inline: true },
            { name: '\*\*BACKGROUND\*\*', value: `${character.get('background')}`, inline: true }
        )
}

async function getNonPlayableCharacterEmbed(npc) {
    //console.log(npc);
    return new MessageEmbed()
        .setColor("#2C2F33")
        .setTitle(`${npc.get('name')} (${npc.get('age') || '?'})`)
        .setImage(npc.get('picture_url'))
        .setDescription(npc.get('description'))
        .addFields(
            { name: '\*\*RACE\*\*', value: `${npc.get('race')}`, inline: true },
            { name: '\*\*CLASS\*\*', value: `${npc.get('class')}`, inline: true },
            { name: '\*\*OCCUPATION\*\*', value: `${npc.get('title')}`, inline: true }
        );
}

//TODO: This sometimes doesnt show
async function getCharacterLevelImage(character) {
    return new MessageAttachment(`./bot/images/DnD/CharacterLevel/${character.get('level')}.png`)
}

function getCharacterFullName(character) {
    let characterTitle = character.get('name');
    if (character.get('title')) {
        characterTitle = '';
        if (hasWhiteSpace(character.get('name'))) {
            let temporaryNameHolder = character.get('name').split(' ');
            for (let i = 0; i < temporaryNameHolder.length; i++) {
                characterTitle += temporaryNameHolder[i] + ' ';
                if (i === 0) {
                    characterTitle += `\"${character.get('title')}\" `;
                }
            }
        } else {
            characterTitle = `${character.get('name')} \"${character.get('title')}\"`;
        }
    }
    return characterTitle;
}

function hasWhiteSpace(s) {
    return s.indexOf(' ') >= 0;
}

async function getCharacterPicture(character) {
    const background = await loadImage(character.get('picture_url').toLowerCase());

    const canvas = createCanvas(1200, 900);
    const context = canvas.getContext('2d');

    const url = character.get('picture_url')

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
    //TODO: in the getAverageColor is something wrong with pngs
    const color = await getAverageColor(imageUrl)
    return color.hex ? color.hex : "#2C2F33";
}
