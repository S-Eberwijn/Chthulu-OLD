const { MessageEmbed } = require('discord.js');
const getBotEmbed = require('../../../bot/otherFunctions/botEmbed');

const DAYS = Math.floor(Math.random() * 365);
const HOURS = Math.floor(Math.random() * 24);
const MINUTES = Math.floor(Math.random() * 60);
const SECONDS = Math.floor(Math.random() * 60);
const BOT_MOCK = {
    uptime: DAYS * 24 * 60 * 60 * 1000 + HOURS * 60 * 60 * 1000 + MINUTES * 60 * 1000 + SECONDS * 1000,
    user: {
        username: 'Cthulhu',
        discriminator: '0001',
        displayAvatarURL: () => 'https://cdn.discordapp.com/avatars/123456789012345678/123456789012345678.png',
    },
    guilds: {
        cache: {
            size: 1,
            reduce: () => 1,
        },
    },
    channels: {
        cache: {
            size: 1,
        },  
    },
    slashCommands: [
        {
            help: {
                name: 'test',
            },
        },
    ],
}

describe('uptime should be calculated correctly', () => {
    test('should return correct uptime', () => {
        const result = getBotEmbed.exportedForTesting.calculateUptimeBot(BOT_MOCK);
        expect(result).toBe(`${DAYS} days, ${HOURS} hours, ${MINUTES} minutes and ${SECONDS} seconds`);
    });
})

describe(`Tests for function 'getBotEmbed'`, () => {
    test("bot owner is found", () => {
        let owner = { username: 'Khthonios', discriminator: '4384' };
        expect(owner.username).toMatch("Khthonios");
    })
    test("bot embed is created correctly", async () => {
        let embed  = await getBotEmbed.getBotEmbed(BOT_MOCK)
        expect(embed).toBeInstanceOf(MessageEmbed);
    })
})