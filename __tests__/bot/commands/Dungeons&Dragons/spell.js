const request = require('request');
const spellPrivateMethods = require('../../../../bot/commands/Dungeons&Dragons/spell.js');
const { MessageEmbed } = require('discord.js');

const AID_SPELLNAME = "aid";
const ALARM_SPELLNAME = "alarm-ritual";
const ALARM_SPELLNAME_NOT_RITUAL = "alarm";
const ACID_SPLASH_NAME = "acid-splash";
const BEAST_SENSE_NAME = "beast-sense-ritual";
const INVALID_SPELL_NAME = "invalid-spell-name";

const AID_INTERACTION = {
    reply: function (output) {
        expect(output.embeds[0]).toBeInstanceOf(MessageEmbed);
        expect(output.embeds[0].title).toBe("Aid") 
        expect(output.embeds[0].description).toBe("Abjuration") 
        expect(output.embeds[0].url).toBe("https://www.dnd-spells.com/spell/aid") 
        //...
    },
    options:{
        getString: function (name) {
            return AID_SPELLNAME;
        }
    }
}

const ALARM_INTERACTION = {
    reply: function (output) {
        expect(output.embeds[0]).toBeInstanceOf(MessageEmbed);
        expect(output.embeds[0].title).toBe("Alarm (Ritual)") 
        expect(output.embeds[0].description).toBe("Abjuration") 
        expect(output.embeds[0].url).toBe("https://www.dnd-spells.com/spell/alarm-ritual")
    },
    options:{
        getString: function (output) {
            return ALARM_SPELLNAME;
        }
    }
}

const INVALID_INTERACTION = {
    reply: function (output) {
        expect(output.content).toBe("That spell was not found in the database")
        expect(output.ephemeral).toBe(true)
    },
    options:{
        getString: function (name) {
            return INVALID_SPELL_NAME;
        }
    }
}

describe("interactions get proccessed correctly", ()=> {
    test("it should be able to handle normal spells",  () => {
        spellPrivateMethods.run(AID_INTERACTION);
    })

    test("it should be able to handle ritual spells",  () => {
        spellPrivateMethods.run(ALARM_INTERACTION);
    })

    test("it should be able to handle Invalid input",  () => {
        spellPrivateMethods.run(INVALID_INTERACTION);
    })
})

describe('procesSpellRequest should be able to provide a valid response given any body', () => {
    beforeEach(() => {
    })

    test("It should be able to create a spell object for a valid spell", async () => {
        let url = spellPrivateMethods.exportedForTesting.baseURL + AID_SPELLNAME;
        let output = {}
        let body = await new Promise(
            resolve => {
                request({
                    url: url,
                    agentOptions: {
                        rejectUnauthorized: false
                    }
                }, function (err, resp, body) {
                    return resolve(body);
                })
            })
        output = spellPrivateMethods.exportedForTesting.procesSpellRequest(body);
        
        expect(output.status).toBe(200);
        expect(output.title).toBe("Aid");
        expect(output.school).toBe("Abjuration");
        expect(output.castTime).toBe("1 Action");
        expect(output.range).toBe("30 feet");
        expect(output.comp).toBe("V, S, M (a tiny strip of white cloth)");
        expect(output.duration).toBe("8 hours");
        expect(output.casters).toBe( "Cleric, Paladin");
    })

    test("It should be able to create a spell object for a valid spell containing 2 words", async () => {
        let url = spellPrivateMethods.exportedForTesting.baseURL + ACID_SPLASH_NAME;
        let output = {}
        let body = await new Promise(
            resolve => {
                request({
                    url: url,
                    agentOptions: {
                        rejectUnauthorized: false
                    }
                }, function (err, resp, body) {
                    return resolve(body);
                })
            })
        output = spellPrivateMethods.exportedForTesting.procesSpellRequest(body);
        expect(output.status).toBe(200);
        expect(output.title).toBe("Acid Splash");
        expect(output.school).toBe("Conjuration");
        expect(output.level).toBe("Cantrip");
        expect(output.castTime).toBe("1 Action");
        expect(output.range).toBe("60 feet");
        expect(output.comp).toBe("V, S");
        expect(output.duration).toBe("Instantaneous");
        expect(output.casters).toBe( "Sorcerer, Wizard");
    })

    test("It should return 404 when an invalid spell was requested", async () => {
        let url = spellPrivateMethods.exportedForTesting.baseURL + INVALID_SPELL_NAME;
        let output = {}
        let body = await new Promise(
            resolve => {
                request({
                    url: url,
                    agentOptions: {
                        rejectUnauthorized: false
                    }
                }, function (err, resp, body) {
                    return resolve(body);
                })
            })
        output = spellPrivateMethods.exportedForTesting.procesSpellRequest(body);
        expect(output.status).toBe(404)
    });

    test("It should be able to create a spell object for a valid Ritual spell", async () => {
        let url = spellPrivateMethods.exportedForTesting.baseURL + ALARM_SPELLNAME;
        let output = {}
        let body = await new Promise(
            resolve => {
                request({
                    url: url,
                    agentOptions: {
                        rejectUnauthorized: false
                    }
                }, function (err, resp, body) {
                    return resolve(body);
                })
            })
        output = spellPrivateMethods.exportedForTesting.procesSpellRequest(body);
        expect(output.status).toBe(200);
        expect(output.title).toBe("Alarm (Ritual)");
        expect(output.school).toBe("Abjuration");
        expect(output.castTime).toBe("1 Minute");
        expect(output.range).toBe("30 feet");
        expect(output.comp).toBe("V, S, M (a tiny bell and a piece of fine silver wire)");
        expect(output.duration).toBe("8 hours");
        expect(output.casters).toBe( "Ranger, Wizard");
    })

    test("It should be able to create a spell object for a valid Ritual spell containing multiple words", async () => {
        let url = spellPrivateMethods.exportedForTesting.baseURL + BEAST_SENSE_NAME;
        let output = {}
        let body = await new Promise(
            resolve => {
                request({
                    url: url,
                    agentOptions: {
                        rejectUnauthorized: false
                    }
                }, function (err, resp, body) {
                    return resolve(body);
                })
            })
        output = spellPrivateMethods.exportedForTesting.procesSpellRequest(body);
        expect(output.status).toBe(200);
        expect(output.title).toBe("Beast Sense (Ritual)");
        expect(output.school).toBe("Divination");
        expect(output.level).toBe("2");
        expect(output.castTime).toBe("1 Action");
        expect(output.range).toBe("Touch");
        expect(output.comp).toBe("S");
        expect(output.duration).toBe("Concentration, up to 1 hour");
        expect(output.casters).toBe("Druid, Ranger");
    })

    test("It should return 404 when a ritual is prompted without -ritual", async () => {
        let url = spellPrivateMethods.exportedForTesting.baseURL + ALARM_SPELLNAME_NOT_RITUAL;
        let output = {}
        let body = await new Promise(
            resolve => {
                request({
                    url: url,
                    agentOptions: {
                        rejectUnauthorized: false
                    }
                }, function (err, resp, body) {
                    return resolve(body);
                })
            })
        output = spellPrivateMethods.exportedForTesting.procesSpellRequest(body);
        expect(output.status).toBe(404)
    });
    
});

describe('processRitualSpell should be able to resolve all ritual spell requests', () => {
    test("It should be able to create a spell object for a valid Ritual spell", async () => {
        let output = await spellPrivateMethods.exportedForTesting.processRitualSpell(ALARM_SPELLNAME_NOT_RITUAL);
        expect(output.status).toBe(200);
        expect(output.title).toBe("Alarm (Ritual)");
        expect(output.school).toBe("Abjuration");
        expect(output.castTime).toBe("1 Minute");
        expect(output.range).toBe("30 feet");
        expect(output.comp).toBe("V, S, M (a tiny bell and a piece of fine silver wire)");
        expect(output.duration).toBe("8 hours");
        expect(output.casters).toBe( "Ranger, Wizard");
    })

    test("It should return 404 when an invalid spell was requested", async () => {
        let output = await spellPrivateMethods.exportedForTesting.processRitualSpell(INVALID_SPELL_NAME);
        expect(output.status).toBe(404)
    });
})

describe("Embed spell in message creates a messageEmbed", () => {
    test("It should create a messageEmbed object", () => {
        const spell = {
            title: "Alarm (Ritual)",
            school: "Abjuration",
            castTime: "1 Minute",
            range: "30 feet",
            comp: "V, S, M (a tiny bell and a piece of fine silver wire)",
            duration: "8 hours",
            description: "This spell creates a magical alarm against unwanted intrusion. Choose a door, a window, or an area within range that is no larger than a 20-foot cube for the duration. Until the spell ends, an alarm alerts you whenever a Tiny or larger creature touches or enters the warded area. When you cast the spell, you can designate creatures that won't set off the alarm. You also choose whether the alarm is mental or audible.",
            casters: "Ranger, Wizard"
        }
        let output = spellPrivateMethods.exportedForTesting.EmbedSpellInMessage(spell,ALARM_SPELLNAME_NOT_RITUAL);
        expect(output).toBeInstanceOf(MessageEmbed);
    })

    test("It should shorten descriptions that are too long", () => {
        const spell = {
            title: "Alarm (Ritual)",
            school: "Abjuration",
            castTime: "1 Minute",
            range: "30 feet",
            comp: "V, S, M (a tiny bell and a piece of fine silver wire)",
            duration: "8 hours",
            description: "This spell creates a magical alarm against unwanted intrusion. Choose a door, a window, or an area within range that is no larger than a 20-foot cube for the duration. Until the spell ends, an alarm alerts you whenever a Tiny or larger creature touches or enters the warded area. When you cast the spell, you can designate creatures that won't set off the alarm. You also choose whether the alarm is mental or audible.This spell creates a magical alarm against unwanted intrusion. Choose a door, a window, or an area within range that is no larger than a 20-foot cube for the duration. Until the spell ends, an alarm alerts you whenever a Tiny or larger creature touches or enters the warded area. When you cast the spell, you can designate creatures that won't set off the alarm. You also choose whether the alarm is mental or audible.This spell creates a magical alarm against unwanted intrusion. Choose a door, a window, or an area within range that is no larger than a 20-foot cube for the duration. Until the spell ends, an alarm alerts you whenever a Tiny or larger creature touches or enters the warded area. When you cast the spell, you can designate creatures that won't set off the alarm. You also choose whether the alarm is mental or audible.",
            casters: "Ranger, Wizard"
        }
        let output = spellPrivateMethods.exportedForTesting.EmbedSpellInMessage(spell,ALARM_SPELLNAME_NOT_RITUAL);
        expect(output).toBeInstanceOf(MessageEmbed);
    })
})
