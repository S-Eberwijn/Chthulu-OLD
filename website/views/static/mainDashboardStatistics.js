google.load("visualization", "1", { packages: ["corechart"] });
var timeout;
const sections = ["characters", "sessions", "quests", "locations", "interactions"]

function addValueToElement(elementID, value) {
    return new Promise((resolve, reject) => {
        document.getElementById(elementID).innerHTML = value;
        resolve(document.getElementById(elementID));
    });
}

function addChartToElement(chartID, chartTitle, values, axisLabels) {
    return new Promise((resolve, reject) => {
        google.charts.setOnLoadCallback(drawChart(chartID, chartTitle, values, axisLabels));
        resolve(document.getElementById(chartID));
    });
}


document.addEventListener("DOMContentLoaded", async function () {
    for (const key in sections) {
        if (Object.hasOwnProperty.call(sections, key)) {
            const section = sections[key];
            await createCarousel(section);
        }
    }

    timeout = setInterval(function () {
        if (google.visualization != undefined) {
            // Add Google charts to page
            addChartToElement('topFiveClasses', 'Top 5 Character Classes', getAllCharactersValues(characters, 'class'), ['Class', 'Amount']).then(element => { return element.classList.add('no-after'); });
            addChartToElement('topFiveRaces', 'Top 5 Character Races', getAllCharactersValues(characters, 'race'), ['Race', 'Amount']).then(element => { return element.classList.add('no-after'); });
            addChartToElement('topFiveBackgrounds', 'Top 5 Character Backgrounds', getAllCharactersValues(characters, 'background'), ['Background', 'Amount']).then(element => { return element.classList.add('no-after'); });

            // Add KPI indicators to page
            addValueToElement('highestCharacterLevel', getHighestCharacterLevel(characters)).then(element => { return element.parentNode.classList.add('no-after'); });
            addValueToElement('deadCharacters', getDeadCharacters(characters).length).then(element => { return element.parentNode.classList.add('no-after'); });
            addValueToElement('OPEN-quests', allQuests.filter(quest => quest.data.quest_status === 'OPEN').length).then(element => { return element.parentNode.classList.add('no-after'); });
            addValueToElement('EXPIRED-quests', allQuests.filter(quest => quest.data.quest_status === 'EXPIRED').length).then(element => { return element.parentNode.classList.add('no-after'); });
            addValueToElement('DONE-quests', allQuests.filter(quest => quest.data.quest_status === 'DONE').length).then(element => { return element.parentNode.classList.add('no-after'); });
            addValueToElement('total-quests', allQuests.length).then(element => { return element.parentNode.classList.add('no-after'); });

            addValueToElement('currentlyRequestedSessions', sessions?.filter(session => session.data.session_status === "CREATED").length).then(element => { return element.parentNode.classList.add('no-after'); });
            addValueToElement('currentlyPlannedSessions', sessions?.filter(session => session.data.session_status === "PLANNED").length).then(element => { return element.parentNode.classList.add('no-after'); });
            addValueToElement('totalPlayedSessions', sessions?.filter(session => session.data.session_status === "PLAYED").length).then(element => { return element.parentNode.classList.add('no-after'); });
            addValueToElement('totalCanceledSessions', sessions?.filter(session => session.data.session_status === "CANCELED").length).then(element => { return element.parentNode.classList.add('no-after'); });
            // addValueToElement('totalRequestedSessions', allQuests.length).then(element => { return element.parentNode.classList.add('no-after'); });

            addValueToElement('total-locations', locations?.map(map => map.data.locations.length).reduce((partialSum, a) => partialSum + a, 0)).then(element => { return element.parentNode.classList.add('no-after'); });
            addValueToElement('undiscovered-locations', locations?.map(map => map.data.locations.filter(location => location.visited === false).length).reduce((partialSum, a) => partialSum + a, 0)).then(element => { return element.parentNode.classList.add('no-after'); });
            clearInterval(timeout);
        }
    }, 300);
});


function drawChart(elementId, title, chartData, headerData) {
    var dataForGoogleChart = [headerData];
    chartData.slice(0, 5).forEach(cClass => {
        dataForGoogleChart.push(cClass)
    });
    // console.log(dataForGoogleChart)

    var data = google.visualization.arrayToDataTable(dataForGoogleChart, false);
    var options = {
        title: title,
        width: 400,
        height: 240,
        colors: ['#404552', '#383c4a', '#4b5162', '#7c818c', '#444444'],
        backgroundColor: {
            fill: 'transparent',
        },
        hAxis: {
            textStyle: {
                color: '#ffffff'
            }
        },
        vAxis: {
            textStyle: {
                color: '#ffffff'
            }
        },
        legend: {
            textStyle: {
                color: '#ffffff'
            }
        },
        titleTextStyle: {
            color: '#ffffff'
        },
        is3D: true
    };

    var chart = new google.visualization.PieChart(document.getElementById(elementId));
    chart.draw(data, options);
}


function uniqueArrayValues(array) {
    return [...new Set(array)];
}
function getAllCharactersValues(characters, value) {
    let characterValues = [];
    characters.forEach(character => {
        characterValues.push(getCharacterValue(character.data, value));
    });
    let uniqueCharacterValues = uniqueArrayValues(characterValues);
    let valuesWithAmount = getValuesWithAmountOfEntries(uniqueCharacterValues, characterValues);
    valuesWithAmount.sort(compareSecondColumn);
    return valuesWithAmount;
}
function getCharacterValue(character, value) {
    return character[value];
}
function getValuesWithAmountOfEntries(uniqueValuesClasses, characterValues) {
    let valuesWithAmount = [];
    for (let i = 0; i < uniqueValuesClasses.length; i++) {
        let value = uniqueValuesClasses[i];
        let amountOfEntries = 0;
        for (let j = 0; j < characterValues.length; j++) {
            if (value.includes(characterValues[j])) {
                amountOfEntries++;
            }
        }
        valuesWithAmount.push([uniqueValuesClasses[i], amountOfEntries])
    }
    return valuesWithAmount;
}
function compareSecondColumn(a, b) {
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (a[1] > b[1]) ? -1 : 1;
    }
}
function getHighestCharacterLevel(characters) {
    let levelsArray = [0];
    characters.forEach(character => {
        levelsArray.push(character.data['level']);
    });
    return Math.max(...levelsArray);
}

function getDeadCharacters(characters) {
    return characters.filter(character => character.data.alive === 0);
}




// Carousel for section
async function createCarousel(sectionName) {
    const wrap = document.querySelector(`.embla__${sectionName}`);
    if (!wrap) return;

    const viewPort = wrap.querySelector(".embla__viewport");
    const container = viewPort.querySelector(".embla__container");
    const items = container.querySelectorAll(".embla__slide");
    if (!(items.length >= 1)) return;
    const dots = wrap.parentElement.querySelector(".embla__dots");

    var options = { align: "start", loop: false, skipSnaps: false, slidesToScroll: 4 }
    var plugins = [
        // EmblaCarouselAutoplay()
    ] // Plugins

    var embla = EmblaCarousel(viewPort, options, plugins)
    const dotsArray = generateDotBtns(dots, embla);
    const setSelectedDotBtn = selectDotBtn(dotsArray, embla);
    setupDotBtns(dotsArray, embla);

    embla.on("select", setSelectedDotBtn);
    embla.on("init", setSelectedDotBtn);
}


const setupDotBtns = (dotsArray, embla) => {
    dotsArray.forEach((dotNode, i) => {
        dotNode.addEventListener("click", () => embla.scrollTo(i), false);
    });
};

const generateDotBtns = (dots, embla) => {
    const template = document.getElementById("embla-dot-template").innerHTML;
    dots.innerHTML = embla.scrollSnapList().reduce(acc => acc + template, "");
    return [].slice.call(dots.querySelectorAll(".embla__dot"));
};

const selectDotBtn = (dotsArray, embla) => () => {
    const previous = embla.previousScrollSnap();
    const selected = embla.selectedScrollSnap();
    dotsArray[previous].classList.remove("is-selected");
    dotsArray[selected].classList.add("is-selected");
};

