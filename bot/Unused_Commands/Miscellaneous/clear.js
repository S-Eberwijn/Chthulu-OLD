const { Permissions } = require('discord.js');

module.exports.run = async (bot, message, args) => {
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.channel.send({ content: "You dont have the right permission!" });
    if (!args[0]) return message.channel.send({ content: "Use: !clear <number>" }).then(msg => { setTimeout(() => msg.delete(), 3000) });

    if (Number.isInteger(parseInt(args[0]))) {
        var amount = parseInt(args[0]);
        message.channel.bulkDelete(amount).then(() => {
            if (args[0] === '0') {
                message.channel.send({ content: `Cant delete 0 messages!` }).then(msg => { setTimeout(() => msg.delete(), 3000) });
            } else if (args[0] === '1') {
                message.channel.send({ content: `${args[0]} message deleted!` }).then(msg => { setTimeout(() => msg.delete(), 3000) });
            } else {
                message.channel.send({ content: `${args[0]} messages deleted!` }).then(msg => { setTimeout(() => msg.delete(), 3000) });
            }
        })
    } else return message.channel.send({ content: "Only use numbers!" }).then(msg => { setTimeout(() => msg.delete(), 3000) });
}

module.exports.help = {
    name: "clear",
    alias: [],
    description: "Clears n-number of messages",
    category: "General"
}