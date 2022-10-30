const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

const sessionPrivateMethods = require('../../../../bot/commands/Dungeons&Dragons/session.js');
const STATUS_PLAYED = 'PLAYED';
const STATUS_CANCELED = 'CANCELED';
const CHANNEL_ID = "123456789012345678";
const EMBED_TITLE = "TITLE"
const EDITED_EMBED = new MessageEmbed().setTitle(EMBED_TITLE).setColor(0x333333);
const PLAYED_COLOR = 0x78b159;
const CANCELED_COLOR = 0xdd2e44;
const SESSION_PLAYED_DENIED_USER1_3_REQUESTED_USER2 = {session_channel: CHANNEL_ID, session_status: STATUS_PLAYED, denied: [{user_id:1},{user_id:3}], requested: [{user_id:2}]};
const SESSION_CANCELED_DENIED_USER2_REQUESTED_USER1_3 = {session_channel: CHANNEL_ID, session_status: STATUS_CANCELED, denied: [{user_id:2}], requested: [{user_id:1},{user_id:3}]};
const SESSION_WRONG_CHANNEL =  {session_channel: CHANNEL_ID+"1", session_status: STATUS_CANCELED, denied: [{user_id:2}], requested: [{user_id:1},{user_id:3}]};


describe("editRequestSessionEmbedTitle changes title color correctly", ()=> {
    afterEach(() => {
        EDITED_EMBED.setTitle(EMBED_TITLE).setColor(0x333333);
    });
    test("it changes PLAYED to" + PLAYED_COLOR,  () => {
        embed = sessionPrivateMethods.exportedForTesting.editRequestSessionEmbedTitle(EDITED_EMBED,STATUS_PLAYED);
        expect(embed.color).toBe(PLAYED_COLOR);
        expect(embed.title).toBe(`${EMBED_TITLE} [${STATUS_PLAYED}]`);
    })
    test("it changes CANCELED to" + CANCELED_COLOR,  () => {
        embed = sessionPrivateMethods.exportedForTesting.editRequestSessionEmbedTitle(EDITED_EMBED,STATUS_CANCELED);
        expect(embed.color).toBe(CANCELED_COLOR);
        expect(embed.title).toBe(`${EMBED_TITLE} [${STATUS_CANCELED}]`);
    })
    test("it doesn't change in any other case",  () => {
        embed = sessionPrivateMethods.exportedForTesting.editRequestSessionEmbedTitle(EDITED_EMBED,STATUS_CANCELED+STATUS_PLAYED);
        expect(embed.color).toBe(0x333333);
    })
})

describe("playerAlreadyDenied correctly checks if player is allready in denied variable", ()=> {
    test("it returns true when player is in denied variable",  () => {
        expect(sessionPrivateMethods.exportedForTesting.playerAlreadyDenied([SESSION_PLAYED_DENIED_USER1_3_REQUESTED_USER2],1,CHANNEL_ID)).toBe(true);
    })
    test("it returns false when player is not in denied variable",  () => {
        expect(sessionPrivateMethods.exportedForTesting.playerAlreadyDenied([SESSION_PLAYED_DENIED_USER1_3_REQUESTED_USER2],2,CHANNEL_ID)).toBe(false);
    })
    test("it returns true when player is in denied variable",  () => {
        expect(sessionPrivateMethods.exportedForTesting.playerAlreadyDenied([SESSION_CANCELED_DENIED_USER2_REQUESTED_USER1_3],2,CHANNEL_ID)).toBe(true);
    })
    test("it returns false when player is not in denied variable",  () => {
        expect(sessionPrivateMethods.exportedForTesting.playerAlreadyDenied([SESSION_CANCELED_DENIED_USER2_REQUESTED_USER1_3],0,CHANNEL_ID)).toBe(false);
    })
    test("it returns true when player is in denied variable",  () => {
        expect(sessionPrivateMethods.exportedForTesting.playerAlreadyDenied([SESSION_CANCELED_DENIED_USER2_REQUESTED_USER1_3],2,CHANNEL_ID)).toBe(true);
    })
    test("it returns true when player is in denied in any given session",  () => {
        expect(sessionPrivateMethods.exportedForTesting.playerAlreadyDenied([SESSION_CANCELED_DENIED_USER2_REQUESTED_USER1_3,SESSION_PLAYED_DENIED_USER1_3_REQUESTED_USER2],1,CHANNEL_ID)).toBe(true);
    })
    test("it returns false when session is in denied in no given session",  () => {
        expect(sessionPrivateMethods.exportedForTesting.playerAlreadyDenied([SESSION_CANCELED_DENIED_USER2_REQUESTED_USER1_3,SESSION_PLAYED_DENIED_USER1_3_REQUESTED_USER2],0,CHANNEL_ID)).toBe(false);
    })
})

describe("playerAlreadyRequestedForSession correctly checks if player allready requested a session", () => {
    test("it returns true when player is in requested variable",  () => {
        expect(sessionPrivateMethods.exportedForTesting.playerAlreadyRequestedForSession([SESSION_PLAYED_DENIED_USER1_3_REQUESTED_USER2],2,CHANNEL_ID)).toBe(true);
    })
    test("it returns false when player is not in requested variable",  () => {
        expect(sessionPrivateMethods.exportedForTesting.playerAlreadyRequestedForSession([SESSION_PLAYED_DENIED_USER1_3_REQUESTED_USER2],1,CHANNEL_ID)).toBe(false);
    })
    test("it returns true when player is in requested variable",  () => {
        expect(sessionPrivateMethods.exportedForTesting.playerAlreadyRequestedForSession([SESSION_CANCELED_DENIED_USER2_REQUESTED_USER1_3],1,CHANNEL_ID)).toBe(true);
    })
    test("it returns false when player is not in requested variable",  () => {
        expect(sessionPrivateMethods.exportedForTesting.playerAlreadyRequestedForSession([SESSION_CANCELED_DENIED_USER2_REQUESTED_USER1_3],2,CHANNEL_ID)).toBe(false);
    })
    test("it returns true when player is in requested variable",  () => {
        expect(sessionPrivateMethods.exportedForTesting.playerAlreadyRequestedForSession([SESSION_CANCELED_DENIED_USER2_REQUESTED_USER1_3],3,CHANNEL_ID)).toBe(true);
    })
    test("it returns true when player is in requested in any given session",  () => {
        expect(sessionPrivateMethods.exportedForTesting.playerAlreadyRequestedForSession([SESSION_CANCELED_DENIED_USER2_REQUESTED_USER1_3,SESSION_PLAYED_DENIED_USER1_3_REQUESTED_USER2],2,CHANNEL_ID)).toBe(true);
    })
    test("it returns false when session is in requested in no given session",  () => {
        expect(sessionPrivateMethods.exportedForTesting.playerAlreadyRequestedForSession([SESSION_CANCELED_DENIED_USER2_REQUESTED_USER1_3,SESSION_PLAYED_DENIED_USER1_3_REQUESTED_USER2],0,CHANNEL_ID)).toBe(false);
    })
})

describe("createSessionChannelEmbed creates an embed",()=>{
    test("it creates an embed with the correct title",  () => {
        embed = sessionPrivateMethods.exportedForTesting.createSessionChannelEmbed(
            {username:"messageAuthor",
            avatarURL:()=>{return null}}, 
            "sessionDate", 
            ["sessionParticipants"], 
            "sessionObjective", 
            "sessionCommanderAvatar", 
            "sessionLocation");
        expect(embed).toBeInstanceOf(MessageEmbed)
    })
})
