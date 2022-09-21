const {GeneralInfo} = require('../../database/models/GeneralInfo.js');
const {PlayerCharacter} = require('../../database/models/PlayerCharacter');
let fs = require('fs');

exports.renameNickname = async function (oldState, newState) {
    if (oldState.channelID === newState.channelID) return;

    let oldNickname = oldState.member.nickname || oldState.member.user.username;

    let playerObjects = require("../jsonDb/renameNickname.json");
    let inDatabase = false;
    let indexOfFoundUser;

    for (let i = 0; i < playerObjects['players'].length; i++) {
        if (playerObjects['players'][i] != null && oldState.member.user.id === playerObjects['players'][i].userId && newState.guild.id === playerObjects['players'][i].serverId) {
            inDatabase = true;
            indexOfFoundUser = i;
        }
    }

    let isInCharacterChannel = false;
    //TODO: FIX null reference of .get
    await GeneralInfo.findOne({ where: { server: newState.guild.id } }).then((foundServer) => {
        foundServer.in_character_channels.forEach(channel => {
            if (channel === newState.channelID) {
                isInCharacterChannel = true;
            }
        });
    });

    if (isInCharacterChannel) {
        [playerObjects, newState] = await updateNickNameInChannel(oldState, newState, oldNickname, inDatabase, playerObjects);
    } else if (inDatabase) {
            newState.member.setNickname(playerObjects['players'][indexOfFoundUser].oldNickname);
            playerObjects['players'].splice(indexOfFoundUser, 1);
    }
    fs.writeFile("./bot/jsonDb/renameNickname.json", JSON.stringify(playerObjects, null, 4), err => {
        if (err) throw err;
    });
}

//extracted from bot\otherFunctions\renameNickname.js
async function updateNickNameInChannel(oldState, newState, oldNickname, inDatabase, playerObjects) {
    //if you cant change nickname do nothing
    if (!newState.guild.me.hasPermission('MANAGE_NICKNAMES')) {return [playerObjects,newState];}

    let player = await PlayerCharacter.findOne({ where: { player_id_discord: newState.member.id, alive: 1, server: newState.guild.id } })
    //if player doesnt exist do nothing
    if (!player) {return [playerObjects,newState];}
    //else change the name in the server
    newState.member.setNickname(player.name);

    //if this user is already in the database do nothing
    if (inDatabase) {return [playerObjects,newState];}

    //else update playerObjects
    playerObjects['players'][playerObjects['players'].length] = {
        userId: oldState.member.user.id,
        serverId: newState.guild.id,
        oldNickname: oldNickname
    }

    return [playerObjects, newState];
}
