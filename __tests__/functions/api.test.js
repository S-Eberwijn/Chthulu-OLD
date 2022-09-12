const api = require('../../functions/api/misc');

describe(`Tests for function 'onlyUnique'`, () => {
    const numberArray = [1, 2, 3, 3, 4, 4, 6, 6];
    ;

    test("array contains only unique items", () => {
        expect(numberArray.filter(api.onlyUnique)).toEqual([1, 2, 3, 4, 6]);
    })

})
describe(`Tests for function 'getDoubleDigitNumber'`, () => {
    test("single digit number is converted to double digits", () => {
        var number = api.getDoubleDigitNumber(5);
        expect(number).toMatch("05");
    })
    test("double digit number is stays the same", () => {
        var number = api.getDoubleDigitNumber(15);
        expect(number).toMatch("15");
    })

    test("can also accept strings", () => {
        var number = api.getDoubleDigitNumber('15');
        expect(number).toMatch("15");
    })
    test("does not accept objects", () => {
        var number = api.getDoubleDigitNumber({ number: '15' });
        expect(number).toMatch("00");
    })
})

describe(`Tests for function 'getPrettyDateString'`, () => {
    var date = new Date(2020, 2, 13, 15, 30);
    var dateString = api.getPrettyDateString(date);

    test("returns a string with the day written in full", () => {
        expect(dateString).toContain('Friday');
    })
    test("returns a string with the date in the right format: DD/MM/YYYY", () => {
        expect(dateString).toContain('13/03/2020');
    })

    test("returns a string with the hours and minutes in the right format: HH:MM", () => {
        expect(dateString).toContain('15:30');
    })

})