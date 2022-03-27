
window.addEventListener('DOMContentLoaded', (event) => {
    var mapCenter = [-33.8650, 151.2094];
    var map = L.map('map').setView(mapCenter, 2);
    map.setMaxBounds(map.getBounds());

    var southWest = L.latLng(13.02504085518189, 80.23609399795532),
        northEast = L.latLng(13.026849183135116, 80.23797690868378),
        bounds = L.latLngBounds(southWest, northEast);

    // console.log(map.getBounds().getSouthWest().toString());
    // console.log(map.getBounds().getNorthEast().toString());

    L.tileLayer(
        'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {

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

});
