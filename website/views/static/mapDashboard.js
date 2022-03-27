
window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    var mapCenter = [0, 0];
    let knownLocations = getKnownLocations();
  
    var map = L.map('map').setView(mapCenter, 2);
    map.setMaxBounds(map.getBounds());

    var southWest = L.latLng(-100, -100),
        northEast = L.latLng(100, 100),
        bounds = L.latLngBounds(southWest, northEast);

    // console.log(map.getBounds().getSouthWest().toString());
    // console.log(map.getBounds().getNorthEast().toString());

    L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
        // 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        // attribution: 'Data © <a href="http://osm.org/copyright">OpenStreetMap</a>',
        fullscreenControl: true,
        minZoom: 2,
        maxZoom: 5,
        bounds: bounds,
        continuousWorld: false,
        noWrap: true,
        opacity: 0,
        // zoomOffset: 2,
    }).addTo(map);
    // map.setView(0, 0, 2)

    map.addControl(new L.Control.Fullscreen());
    //L.marker([map.getBounds().getNorth()-7,0]).addTo(map).bindPopup(`NorthPole ` + map.getBounds().getNorth())
    //L.marker([map.getBounds().getSouth(),0]).addTo(map).bindPopup(`Southpole `+ map.getBounds().getSouth())
    for (let i = 0; i < knownLocations.length; i++) {
        L.marker([knownLocations[i].y * map.getBounds().getNorth(), knownLocations[i].x * map.getBounds().getEast()]).addTo(map).bindPopup(knownLocations[i].markerName)
    }

    L.marker(mapCenter).addTo(map).bindPopup(`Party's current location`)

    // .openPopup();
    // L.marker(mapCenter).addTo(map);
    // L.marker([-35.8650, 154.2094]).addTo(map);

    var imageUrl = 'https://cdn.discordapp.com/attachments/711689970456461372/953023259044098058/The_Homebrew_Campaign.jpg',


    map.addControl(new L.Control.Fullscreen());


    databaseMap.data.locations.forEach(location => {
        console.log(location)

        let icon;
        let marker;
        switch (location.type) {
            case 'town':
                icon =
                    L.icon({
                        iconUrl: `/images/mapIcons/${location.type}.png`,
                        iconSize: [34, 30],
                        iconAnchor: [15, 15],
                        popupAnchor: [0, -15],
                        shadowUrl: `/images/mapIcons/${location.type}.png`,
                        shadowSize: [34, 30],
                        shadowAnchor: [15, 15],
                    });
                break;
            case 'city':
                icon =
                    L.icon({
                        iconUrl: '/images/mapIcons/city.png',
                        iconSize: [80, 50],
                        iconAnchor: [40, 25],
                        popupAnchor: [0, -50],
                        shadowUrl: '/images/mapIcons/city.png',
                        shadowSize: [80, 50],
                        shadowAnchor: [40, 25],
                    });
                break;
            default:
                break;
        }
        if (!icon) {
            marker = L.marker(mapCenter, { draggable: true }).addTo(map)
                .bindPopup(`${location.description}`);
        } else {
            marker = L.marker(mapCenter, { icon: icon }).addTo(map)
                .bindPopup(`${location.description}`);
        }
        if (location.visited === true) marker._icon.classList.add('huechange');

    })

    var imageUrl = databaseMap.data.map_url,
        imageBounds = [map.getBounds().getNorthEast(), map.getBounds().getSouthWest()];

    L.imageOverlay(imageUrl, imageBounds, {
        interactive: true,
    }).addTo(map);
    L.imageOverlay(imageUrl, imageBounds).bringToFront();

    map.on('click', function (e) {
        map.setMaxBounds(map.getBounds()*2);
        var popLocation = e.latlng;
        let x = popLocation.lng / map.getBounds().getEast()
        let y = popLocation.lat / map.getBounds().getNorth()
        L.popup()
            .setLatLng(popLocation)
            .setContent(createForm(x,y))
            .openOn(map);
    });
});

function getKnownLocations() {
    let knownLocations = [
        {
            markerName: "Tsurugi's woonplaats",
            x: .60,
            y: -.80
        },
        {
            markerName: "Phoens's home",
            x: .90,
            y: -.90
        },
        {
            markerName: "start",
            x: -.79,
            y: -.36
        },
    ]
    return knownLocations;
}

function createForm(x,y) {
    x = Math.round(x*100_000_000_000)/100_000_000_000;
    y = Math.round(y*100_000_000_000)/100_000_000_000;
    let form=
    "<form class='mapPopUpForm'>"+
    "<h1>new location</h1>"+
    "<label class='mapPopUplabel'>Lat : </label>"+
    "<input class='mapPopUpinput' type='number' step='0.000001' disabled value="+y+"><br/>"+
    "<label class='mapPopUplabel'>Long: </label>"+
    "<input class='mapPopUpinput' type='number' step='0.000001' disabled value="+x+"><br/>"+
    "<label class='mapPopUplabel'>Location name: </label>"+    
    "<input class='mapPopUpinput' type='text'/><br/>"+
    "<label class='mapPopUplabel'>Description: </label>"+    
    "<textarea class='mapPopUpinput' type='text' rows='4' cols='50'></textarea><br/>"+
    "<button class='mapPopUpinput' type='submit'>submit</button>"+
    "</form>"
    return form;
}