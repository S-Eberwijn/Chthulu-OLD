const { MessageEmbed } = require('discord.js');

module.exports.run = async (interaction) => {
    const user = interaction.options.getUser('user') || interaction.user;
    const userAvatarURL = user.avatarURL({ dynamic: true, size: 1024 });
    const avatarEmbed = new MessageEmbed()
        .setColor(0x333333)
        .setAuthor(user.username)
        .setImage(userAvatarURL);
    interaction.reply({ embeds: [avatarEmbed] });
    // const text = interaction.options.getString('text');
    // return await interaction.reply({ content: text , ephemeral: true});
}

module.exports.help = {
    // name: 'avatar',
    // permission: [],
    // alias: [],
    category: "General",
    name: 'avatar',
    description: 'Shows the avatar of an user.',
    options: [{
        name: 'user',
        type: 'USER',
        description: 'User from whom the character is.',
        required: false
    }],
}