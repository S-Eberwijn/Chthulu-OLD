
window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    var mapCenter = [0, 0];
    let knownLocations = getKnownLocations();
    var map = L.map('map').setView(mapCenter, 2);
    map.setMaxBounds(map.getBounds());

    var southWest = L.latLng(-100, -100),
        northEast = L.latLng(100, 100),
        bounds = L.latLngBounds(southWest, northEast);

    console.log(map.getBounds().getSouthWest().toString());
    console.log(map.getBounds().getNorthEast().toString());

    L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
        // 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        // attribution: 'Data © <a href="http://osm.org/copyright">OpenStreetMap</a>',
        fullscreenControl: true,
        minZoom: 2,
        maxZoom: 4,
        bounds: bounds,
        continuousWorld: false,
        noWrap: true,
        opacity: 0,
        // zoomOffset: 2,
    }).addTo(map);
    // map.setView(0, 0, 2)
    let myx = 75
    let myy = -75
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
            .setContent(createForm())
            .openOn(map);
        console.log("lat:", y, "lng:", x);
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

function createForm() {
    /*<form>
        <h1>new location</h1>
        <label>veld1: </label><input type="text"/>
        <label>veld2: </label><input type="text"/>
        <button type="submit">submit</button>
    </form>*/
    return ("<form><h1>new location</h1><label>veld1: </label><input type='text'/><br/><label>veld2: </label><input type='text'/>"+
    "<br/><button type='submit'>submit</button></form>")
}