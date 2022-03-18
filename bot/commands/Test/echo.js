module.exports.run = async (interaction) => {
    const text = interaction.options.getString('text');
    return await interaction.reply({ content: text, ephemeral: true });
}

module.exports.help = {
    // name: 'echo',
    // permission: [],
    // alias: [],
    category: "Test",
    name: 'echo',
    description: 'Echo your text!',
    options: [{
        name: 'text',
        type: 'STRING',
        description: 'The input to echo back',
        required: true
    }],
}