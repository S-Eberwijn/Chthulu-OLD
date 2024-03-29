const {
    MessageActionRow,
} = require("discord.js");


exports.paginationEmbed = async function (channel, pages, buttonList, timeout = 120000) {
    try{
        isValidCall(pages,buttonList);
    }catch(e){
        console.log(e);
        return;
    }

    let page = 0;

    const row = new MessageActionRow().addComponents(buttonList);
    const curPage = await channel.send({
        embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)],
        components: [row], fetchReply: true,
    });

    const filter = (i) =>
        i.customId === buttonList[0].customId ||
        i.customId === buttonList[1].customId;

    const collector = await curPage.createMessageComponentCollector({
        filter,
        time: timeout,
    });

    collector.on("collect", async (i) => {
        switch (i.customId) {
            case buttonList[0].customId:
                page = page > 0 ? --page : pages.length - 1;
                break;
            case buttonList[1].customId:
                page = page + 1 < pages.length ? ++page : 0;
                break;
            default:
                break;
        }
        await i.deferUpdate();
        await i.editReply({
            embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)],
            components: [row],
        });
        collector.resetTimer();
    });

    collector.on("end", () => {
        if (!curPage.deleted) {
            const disabledRow = new MessageActionRow().addComponents(
                buttonList[0].setDisabled(true),
                buttonList[1].setDisabled(true)
            );
            curPage.edit({
                embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)],
                components: [disabledRow],
            });
        }
    });

    return curPage;
}

// TODO: Make SELECT MENU FOR ALL POSSIBLE NPCS
exports.paginationEmbedForNPC = async function (interaction, pages, buttonList, selectMenu, timeout = 120000) {
    try{
        isValidCall(pages,buttonList);
    }catch(e){
        console.log(e);
        return;
    }
    let page = 0;

    const row = new MessageActionRow().addComponents(buttonList);
    const curPage = await interaction.channel.send({
        embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)],
        components: [row], fetchReply: true,
    });

    const filter = (i) =>
        i.customId === buttonList[0].customId ||
        i.customId === buttonList[1].customId;

    const collector = await curPage.createMessageComponentCollector({
        filter,
        time: timeout,
    });

    collector.on("collect", async (i) => {
        switch (i.customId) {
            case buttonList[0].customId:
                page = page > 0 ? --page : pages.length - 1;
                break;
            case buttonList[1].customId:
                page = page + 1 < pages.length ? ++page : 0;
                break;
            default:
                break;
        }
        await i.deferUpdate();
        await i.editReply({
            embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)],
            components: [row],
        });
        collector.resetTimer();
    });

    collector.on("end", () => {
        if (!curPage.deleted) {
            const disabledRow = new MessageActionRow().addComponents(
                buttonList[0].setDisabled(true),
                buttonList[1].setDisabled(true)
            );
            curPage.edit({
                embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)],
                components: [disabledRow],
            });
        }
    });
    return curPage;
}

function isValidCall(pages,buttonList){
    if (!pages) throw new Error("Pages are not given.");
    if (!buttonList) throw new Error("Buttons are not given.");
    if (buttonList[0].style === "LINK" || buttonList[1].style === "LINK") throw new Error("Link buttons are not supported with discordjs-button-pagination" );
    if (buttonList.length !== 2) throw new Error("Need two buttons.");
}
