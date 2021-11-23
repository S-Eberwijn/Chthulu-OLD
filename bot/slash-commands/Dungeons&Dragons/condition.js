const {MessageActionRow, MessageSelectMenu,MessageEmbed } = require('discord.js');
const api = "https://api.open5e.com/conditions"
const request = require('request');

module.exports.run = async (interaction) => {
    let condition = interaction.options.getString('condition-name')?.toLowerCase();

    request(api, { json: true }, async (err, res, body) => {
        if (err) { return console.log(err); }
        let data = body.results
        
        for(let i = 0; i<data.length; i++){
            if(data[i].slug==condition){
                return interaction.reply({ embeds: [createEmbed(data[i])]})
            }
        }
        return await useSelectionMenu(interaction,data);
    });
}

async function useSelectionMenu(interaction,conditions){
    let messageComponentsArray = [];
    messageComponentsArray.push(
        new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId(`SelectConditionDropdown`)
                .setPlaceholder('Select a value...')
                .setMinValues(1)
                .setMaxValues(1)
                .setDisabled(false)
                .addOptions(Object.keys(conditions)
                .map(function (key) { return { label: `${conditions[key].name}`, value: `${conditions[key].name}` } }))
        )
    )
    await interaction.reply({
        content: "Pick the condition you want to learn more about",
        components: messageComponentsArray, 
        fetchReply: true,
    }).then(async () => {
        await interaction.channel.awaitMessageComponent({
            max: 1,
            time: 30000,
            errors: ['time']
        }).then(async (interaction) => {
            interaction.deferUpdate();
            for(let i = 0; i<conditions.length; i++){
                if(conditions[i].name==interaction.values[0]){
                    return interaction.channel.send({ embeds: [createEmbed(conditions[i])]})
                }
            }
        }).catch(function () {  
            interaction.channel.send({
                content: "This poll has been open for too long, it no longer accepts answers."
            }).then(msg => { setTimeout(() => msg.delete(), 3000) })
            .catch(err => console.log(err));
        })
    })
}

function createEmbed(condition){
    return new MessageEmbed()
    .setTitle(condition.name)
    .setURL(api + "/" + condition.slug)
    .setDescription(condition.desc)
}

module.exports.help = {
    name: 'condition',
    permission: [],
    alias: [],
    category: "Dungeons & Dragons"
}