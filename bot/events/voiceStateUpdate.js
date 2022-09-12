const { renameNickname } = require('../otherFunctions/voiceNicknameUpdate.js');

module.exports = (oldState, newState) => {
    renameNickname(oldState, newState);
}