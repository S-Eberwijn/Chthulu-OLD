const { MessageEmbed } = require('discord.js');

exports.getBotEmbed = async function (bot) {
    let botOwner;
    try {
        botOwner = await bot.users.fetch(`${process.env.AUTHOR}`);
    } catch (error) {
        botOwner = { username: 'Chthulu', discriminator: '6727' };
    }
    return new MessageEmbed()
        .setAuthor(`${bot.user.username}#${bot.user.discriminator} `, bot.user.avatarURL())
        .setDescription(`
        \*\*Cthulhu\*\* is a Great Old One of great power who lies in a death-like slumber beneath the \*\*Pacific Ocean\*\* in his sunken city of \*\*R'lyeh\*\*. He remains a dominant presence in the eldrich dealings on our world.
        \*\*\`\`\`I've been awake for ${calculateUptimeBot(bot)}\`\`\`\*\*
        `)
        .setColor("GREEN")
        .setThumbnail(bot.user.displayAvatarURL())
        .addFields(
            {
                name: `Info:`, value: `
            💻 \*\*Developer:\*\* \`${botOwner.username}#${botOwner.discriminator}\`
            🕸 \*\*Website:\*\* [chthulu.online](https://github.com/S-Eberwijn/Chthulu)
            🚧 \*\*Server:\*\* [discord.gg/hYt5hYmkSv](https://discord.gg/hYt5hYmkSv)
            ✏ \*\*Design:\*\* Looking for new one!
            `, inline: true
            },
            {
                name: `Stats:`, value: `
            🗄️ \*\*Servers:\*\* \`${bot.guilds.cache.size}\`
            👤 \*\*Users:\*\* \`${bot.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}\`
            🗣️ \*\*Channels:\*\* \`${bot.channels.cache.size}\`
            🤖 \*\*Commands:\*\* \`${[... new Set(bot.commands.map((o) => o.help.name))].length}\`
            `, inline: true
            }
        )
        .setFooter(`💗 ${require('../jsonDb/likesAndDislikes.json')['likes'].length}`)
}

function calculateUptimeBot(bot) {
    let totalSeconds = (bot.uptime / 1000);
    let days = Math.floor(totalSeconds / 86400);
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);

    let uptime = `${seconds} seconds`;

    if (minutes != 0) {
        uptime = `${minutes} minutes and ${seconds} seconds`;
    }
    if (hours != 0) {
        uptime = `${hours} hours, ${minutes} minutes and ${seconds} seconds`;
    }
    if (days != 0) {
        uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;
    }

    return uptime;

}

