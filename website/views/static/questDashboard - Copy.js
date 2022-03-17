
window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    var mapCenter = [-33.8650, 151.2094];
    var map = L.map('map').setView(mapCenter, 2);
    map.setMaxBounds(map.getBounds());

    var southWest = L.latLng(13.02504085518189, 80.23609399795532),
        northEast = L.latLng(13.026849183135116, 80.23797690868378),
        bounds = L.latLngBounds(southWest, northEast);

    console.log(map.getBounds().getSouthWest().toString());
    console.log(map.getBounds().getNorthEast().toString());

    L.tileLayer(
        'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {

        // 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        // attribution: 'Data © <a href="http://osm.org/copyright">OpenStreetMap</a>',
        minZoom: 2,
        maxZoom: 4,
        bounds: bounds,
        continuousWorld: false,
        noWrap: true,
        opacity: 0,
        // zoomOffset: 2,
    }).addTo(map);
    // map.setView(0, 0, 2)



    L.marker(mapCenter).addTo(map)
        .bindPopup(`Party's current location`)
        .openPopup();
    // L.marker(mapCenter).addTo(map);
    // L.marker([-35.8650, 154.2094]).addTo(map);


    var imageUrl = 'https://cdn.discordapp.com/attachments/711689970456461372/953023259044098058/The_Homebrew_Campaign.jpg',
        imageBounds = [map.getBounds().getNorthEast(), map.getBounds().getSouthWest()];

    L.imageOverlay(imageUrl, imageBounds, {
        interactive: true,
    }).addTo(map);
    L.imageOverlay(imageUrl, imageBounds).bringToFront();

});
