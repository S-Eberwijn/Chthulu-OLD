const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const regions = { brazil: 'Brazil', EUROPE: 'Europe', hongkong: 'Hong Kong', india: 'India', japan: 'Japan', russia: 'Russia', singapore: 'Singapore', southafrica: 'South Africa', sydeny: 'Sydeny', 'us-central': 'US Central', 'us-east': 'US Eastside', 'us-west': 'US Westside', 'us-south': 'US Southside' };

module.exports.run = async (bot, message, args) => {
    const userJoinedAt = moment(message.member.joinedAt).format('DD/MM/YYYY');
    const guildCreatedAt = moment(message.guild.createdAt).format('DD/MM/YYYY');

    let serverembed = new MessageEmbed()
        .setAuthor("Discord Server Information", message.guild.iconURL())
        // .setTitle("Discord Server Information")
        // .setThumbnail(message.guild.iconURL())
        .setColor("GREEN")
        .addFields([
            { name: "Name:", value: `${message.guild.name}`, inline: true },
            { name: "ID:", value: `${message.guild.id}`, inline: true },
            { name: "Owner:", value: `${await message.guild.fetchOwner()}`, inline: true },
            { name: "Region:", value: `${regions[message.guild.region] || ':flag_be:'}`, inline: true },
            { name: "Members:", value: `${message.guild.memberCount}`, inline: true },
            { name: "Roles:", value: `${message.guild.roles.cache.size}`, inline: true },
            { name: "Channels:", value: `${message.guild.channels.cache.size}`, inline: true },
            { name: "You Joined:", value: `${userJoinedAt}`, inline: true },
            { name: "Created:", value: `${guildCreatedAt}`, inline: true },
        ])
    // .setFooter(message.author.username, message.author.avatarURL())
    // .setTimestamp()

    message.channel.send({ embeds: [serverembed] });
}

module.exports.help = {
    name: "server",
    alias: ["servr", "srver", "srvr"],
    description: "Gives information about the discord server",
    category: "Information"
}

