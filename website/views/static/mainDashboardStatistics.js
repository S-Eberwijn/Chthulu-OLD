google.load("visualization", "1", { packages: ["corechart"] });
var timeout;

document.addEventListener("DOMContentLoaded", function () {
    console.log(characters)
    timeout = setInterval(function () {
        if (google.visualization != undefined) {
            google.charts.setOnLoadCallback(drawChart('topFiveClasses', 'Top 5 Character Classes', getAllCharactersValues(characters, 'class'), ['Class', 'Amount']));
            google.charts.setOnLoadCallback(drawChart('topFiveRaces', 'Top 5 Character Races', getAllCharactersValues(characters, 'race'), ['Race', 'Amount']));
            google.charts.setOnLoadCallback(drawChart('topFiveBackgrounds', 'Top 5 Character Backgrounds', getAllCharactersValues(characters, 'background'), ['Background', 'Amount']));
            document.getElementById('highestCharacterLevel').innerHTML = getHighestCharacterLevel(characters);
            clearInterval(timeout);
        }
    }, 300);
});


function drawChart(elementId, title, chartData, headerData) {
    var dataForGoogleChart = [headerData];
    chartData.slice(0, 5).forEach(cClass => {
        dataForGoogleChart.push(cClass)
    });
    console.log(dataForGoogleChart)

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
        characterValues.push(getCharacterValue(character, value));
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
    let levelsArray = [];
    characters.forEach(character => {
        levelsArray.push(character['level']);
    });
    return Math.max(...levelsArray);
}