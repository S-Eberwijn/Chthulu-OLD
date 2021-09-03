const Player = require('./models/Player');
const DungeonMaster = require('./models/DungeonMaster');
const SessionRequest = require('./models/SessionRequest');
const PlayerCharacter = require('./models/PlayerCharacter');
const NonPlayableCharacter = require('./models/NonPlayableCharacter');
const Quest = require('./models/Quest');
const PlannedSession = require('./models/PlannedSession');
const GeneralInfo = require('./models/GeneralInfo');
const PastSession = require('./models/PastSession');





exports.initializeDB = function (db) {
    Player.init(db);
    DungeonMaster.init(db);
    SessionRequest.init(db)
    PlayerCharacter.init(db);
    NonPlayableCharacter.init(db);
    Quest.init(db);
    PlannedSession.init(db);
    GeneralInfo.init(db);
    PastSession.init(db);

    Player.sync();
    DungeonMaster.sync();
    SessionRequest.sync();
    PlayerCharacter.sync();
    NonPlayableCharacter.sync();
    Quest.sync();
    PlannedSession.sync();
    GeneralInfo.sync();
    PastSession.sync();
}