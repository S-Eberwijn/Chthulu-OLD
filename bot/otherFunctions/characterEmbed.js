const { MessageEmbed, MessageAttachment } = require('discord.js');

exports.getCharacterEmbed = async function (character) {
    // console.log(character);
    return new MessageEmbed()
        .setColor("#2C2F33")
        .setThumbnail(`attachment://${character.get('level')}.png`)
        .setTitle(`${await getCharacterFullName(character)} (${character.get('age')})`)
        //TODO: Set default size for image (if possible)??
        .setImage(character.get('picture_url'))
        .setDescription(character.get('description'))
        .addFields(
            { name: '\*\*RACE\*\*', value: `${character.get('race')}`, inline: true },
            { name: '\*\*CLASS\*\*', value: `${character.get('class')}`, inline: true },
            { name: '\*\*BACKGROUND\*\*', value: `${character.get('background')}`, inline: true }
        );
}

exports.getNonPlayableCharacterEmbed = async function (npc) {
    // console.log(npc);
    return new MessageEmbed()
        .setColor("#2C2F33")
        .setTitle(`${npc.get('name')} (${npc.get('age') || '?'})`)
        //TODO: Set default size for image (if possible)??
        .setImage(npc.get('picture_url'))
        .setDescription(npc.get('description'))
        .addFields(
            { name: '\*\*RACE\*\*', value: `${npc.get('race')}`, inline: true },
            { name: '\*\*CLASS\*\*', value: `${npc.get('class')}`, inline: true },
            { name: '\*\*OCCUPATION\*\*', value: `${npc.get('title')}`, inline: true }
        );
}

exports.getCharacterLevelImage = async function (character) {
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
