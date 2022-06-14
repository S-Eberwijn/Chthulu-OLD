const { getBotEmbed } = require('../../../bot/otherFunctions/botEmbed');



describe(`Tests for function 'getBotEmbed'`, () => {
    test("bot owner is found", () => {
        var owner = { username: 'Khthonios', discriminator: '4384' };

        expect(owner.username).toMatch("Khthonios");

    })
 
//     test("bot owner is not found", () => {
//         var owner = { username: 'Chthulu', discriminator: '6727' };
//         expect(string1).toMatch(/test/);

//     })

})