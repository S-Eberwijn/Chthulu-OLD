const request = require('request');
const magicItem = require('../../../../bot/commands/Dungeons&Dragons/magic-item.js');
const { MessageEmbed } = require('discord.js');

const CLOAK_OF_PROTECTION = "cloak-of-protection";
const BAG_OF_BEANS = "bag-of-beans";
const INVALID_ITEM = "invalid-item";

const CLOAK_OF_PROTECTION_INTERACTION = {
    reply: function (output) {
        expect(output.embeds[0]).toBeInstanceOf(MessageEmbed);
        expect(output.embeds[0].title).toBe("Cloak of Protection") 
        expect(output.embeds[0].url).toBe("https://api.open5e.com/magicitems/cloak-of-protection") 
        expect(output.embeds[0].fields[0].value).toBe("uncommon") 
        expect(output.embeds[0].fields[1].value).toBe("Wondrous item") 
        expect(output.embeds[0].fields[2].value).toBe("yes") 
    },
    options:{
        getString: function (name) {
            return CLOAK_OF_PROTECTION;
        }
    }
}

const BAG_OF_BEANS_INTERACTION = {
    reply: function (output) {
        expect(output.embeds[0]).toBeInstanceOf(MessageEmbed);
        expect(output.embeds[0].fields[0].value).toBe("rare") 
        expect(output.embeds[0].fields[1].value).toBe("Wondrous item") 
        expect(output.embeds[0].fields[2].value).toBe("no") 
    },
    options:{
        getString: function (name) {
            return BAG_OF_BEANS;
        }
    }
}

const INVALID_ITEM_INTERACTION = {
    reply: function (output) {
        expect(output.content).toBe("invalid-item was not found in our database.");
        expect(output.ephemeral).toBe(true);
    },
    options:{
        getString: function (name) {
            return INVALID_ITEM;
        }
    }
}
describe("interactions get proccessed correctly", ()=> {
    test("it should be able to handle items with attunement",  async () => {
        await magicItem.run(CLOAK_OF_PROTECTION_INTERACTION);
    })

    test("it should be able to handle items without attunement",  async () => {
        await magicItem.run(BAG_OF_BEANS_INTERACTION);
    })

    test("it should be able to handle Invalid input",  async () => {
        await magicItem.run(INVALID_ITEM_INTERACTION);
    })
})