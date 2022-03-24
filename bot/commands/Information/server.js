const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const regions = { brazil: 'Brazil', EUROPE: 'Europe', hongkong: 'Hong Kong', india: 'India', japan: 'Japan', russia: 'Russia', singapore: 'Singapore', southafrica: 'South Africa', sydeny: 'Sydeny', 'us-central': 'US Central', 'us-east': 'US Eastside', 'us-west': 'US Westside', 'us-south': 'US Southside' };

module.exports.run = async (interaction) => {

    const userJoinedAt = moment(interaction.guild.members.cache.get(interaction.user.id).joinedAt).format('DD/MM/YYYY');
    const guildCreatedAt = moment(interaction.guild.createdAt).format('DD/MM/YYYY');

    let serverembed = new MessageEmbed()
        .setAuthor("Discord Server Information", interaction.guild.iconURL())
        // .setTitle("Discord Server Information")
        // .setThumbnail(message.guild.iconURL())
        .setColor("GREEN")
        .addFields([
            { name: "Name:", value: `${interaction.guild.name}`, inline: true },
            { name: "ID:", value: `${interaction.guild.id}`, inline: true },
            { name: "Owner:", value: `${await interaction.guild.fetchOwner()}`, inline: true },
            { name: "Region:", value: `${regions[interaction.guild.region] || ':flag_be:'}`, inline: true },
            { name: "Members:", value: `${interaction.guild.memberCount}`, inline: true },
            { name: "Roles:", value: `${interaction.guild.roles.cache.size}`, inline: true },
            { name: "Channels:", value: `${interaction.guild.channels.cache.size}`, inline: true },
            { name: "You Joined:", value: `${userJoinedAt}`, inline: true },
            { name: "Created:", value: `${guildCreatedAt}`, inline: true },
        ])

    return await interaction.reply({ embeds: [serverembed]/*, ephemeral: true*/ });
}

module.exports.help = {
    // name: 'server',
    // permission: [],
    // alias: [],
    category: "Information",
    name: 'server',
    description: 'Gives information about the server.',
    options: [],
}