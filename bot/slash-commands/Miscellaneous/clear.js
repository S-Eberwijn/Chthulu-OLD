const { Permissions } = require('discord.js');

module.exports.run = async (interaction) => {
    if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return interaction.channel.send({ content: "You dont have the right permission!" });
    if (!interaction.options.get('number')) return interaction.channel.send({ content: "Use: !clear <number>" }).then(msg => { setTimeout(() => msg.delete(), 3000) });

    if (Number.isInteger(parseInt(interaction.options.get('number').value))) {
        var amount = parseInt(interaction.options.get('number').value);
        interaction.channel.bulkDelete(amount).then(() => {
            if (amount === '0') {
                interaction.channel.send({ content: `Cant delete 0 messages!` }).then(msg => { setTimeout(() => msg.delete(), 3000) });
            } else if (amount === '1') {
                interaction.channel.send({ content: `${amount} message deleted!` }).then(msg => { setTimeout(() => msg.delete(), 3000) });
            } else {
                interaction.channel.send({ content: `${amount} messages deleted!` }).then(msg => { setTimeout(() => msg.delete(), 3000) });
            }
        })
    } else return interaction.channel.send({ content: "Only use numbers!" }).then(msg => { setTimeout(() => msg.delete(), 3000) });
}

module.exports.help = {
    name: "clear",
    alias: [],
    description: "Clears n-number of messages",
    category: "General"
}