
window.addEventListener('DOMContentLoaded', async (event) => {
    let img = await getMeta(databaseMap.data.map_url);

    var imgHeight = img.height,
        imgWidth = img.width;

    console.log(imgHeight, imgWidth);
    var center = [0, -imgWidth]
    var map = L.map('map', {
        zoomControl: false,
        minZoom: -2,
        maxZoom: 2,
        center: center,
        zoom: 1,
        crs: L.CRS.Simple
    });

    var southWest = map.unproject([0, imgHeight], map.getZoom());
    var northEast = map.unproject([imgWidth, 0], map.getZoom());
    var bounds = new L.LatLngBounds(southWest, northEast);


    var imgOv = L.imageOverlay(databaseMap.data.map_url, bounds, { interactive: true }).addTo(map);
    imgOv.bringToFront();

    map.setMaxBounds(bounds);
    map.setView(center, 0);


    // Add location from database to map
    databaseMap.data.locations.forEach(location => {
        L.marker(
            map.layerPointToLatLng(
                map.containerPointToLayerPoint(
                    [location.x, location.y]
                )
            )
        ).bindPopup(``).addTo(map);
        console.log(map.layerPointToLatLng(
            map.containerPointToLayerPoint(
                [location.x, location.y]
            )
        ))
    })


    // map.fitBounds(imgOv.getBounds());






    // var mapCenter = [0, 0];

    // var map = L.map('map', { zoomControl: false, }).setView(mapCenter, 3);

    // var southWest = L.latLng(map.getBounds()._southWest.lat, map.getBounds()._southWest.lng),
    //     northEast = L.latLng(map.getBounds()._northEast.lat, map.getBounds()._northEast.lng),
    //     bounds = L.latLngBounds(southWest, northEast);

    // // console.log(map.getBounds())
    // // console.log(bounds)

    // let mapLayer = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
    //     minZoom: 3,
    //     maxZoom: 5,
    //     repeat: false,
    //     bounds: bounds,
    //     continuousWorld: false,
    //     noWrap: true,
    //     opacity: 0,
    // }).addTo(map);
    // map.setMaxBounds(bounds);


    var mapSidebar = L.control.sidebar({
        autopan: false,       // whether to maintain the centered map point when opening the sidebar
        closeButton: false,    // whether t add a close button to the panes
        container: 'map-sidebar', // the DOM container or #ID of a predefined sidebar container that should be used
        position: 'left',     // left or right
    })
        // .addTo(map);

    /* add a new panel */
    var welcomeContent = {
        id: 'welcomePanel',                     // UID, used to access the panel
        tab: '<i class="fas fa-home"></i>',  // content can be passed as HTML string,
        pane: 'someDomNode.innerHTML',        // DOM elements can be passed, too
        title: 'Welcome to Ghaeya',              // an optional pane header
        position: 'top'                  // optional vertical alignment, defaults to 'top'
    };
    mapSidebar.addPanel(welcomeContent);
    var locationContent = {
        id: 'locationPanel',                     // UID, used to access the panel
        tab: '<i class="fas fa-map-marker-alt"></i>',  // content can be passed as HTML string,

        pane: '<div class="locationCategory"><div class="locationCategoryHeader"><span class="locationCategoryName">Towns</span><i class="fas fa-chevron-right"></i></div><div class="location" id="L1648402000054"><span class="locationName">Bolder Springs</span></div><div class="location"><span class="locationName">Zenfar</span></div><div class="location"><span class="locationName">Test</span></div>',        // DOM elements can be passed, too
        title: 'Locations',              // an optional pane header
        position: 'top'                  // optional vertical alignment, defaults to 'top'
    };
    mapSidebar.addPanel(locationContent);
    var fullscreenContent = {
        id: 'click',
        tab: '<i class="fas fa-expand"></i>',
        position: 'bottom',                  // optional vertical alignment, defaults to 'top'
        button: function (event) {
            // console.log(event);                   // optional vertical alignment, defaults to 'top'
            document.getElementById(`map`).requestFullscreen();
        }
    };
    // mapSidebar.addPanel(fullscreenContent);
    var settingsContent = {
        id: 'settingsPanel',                     // UID, used to access the panel
        tab: '<i class="fa fa-gear"></i>',  // content can be passed as HTML string,
        pane: 'someDomNode.innerHTML',        // DOM elements can be passed, too
        title: 'Settings',              // an optional pane header
        position: 'bottom'                  // optional vertical alignment, defaults to 'top'
    };
    mapSidebar.addPanel(settingsContent);

    // mapSidebar.open('welcomePanel');
    mapSidebar.open('locationPanel');



    // databaseMap.data.locations.forEach(location => {
    //     console.log(location)

    //     let icon;
    //     let marker;
    //     switch (location.type) {
    //         case 'town':
    //             icon =
    //                 L.icon({
    //                     iconUrl: `/images/mapIcons/${location.type}.png`,
    //                     iconSize: [34, 30],
    //                     iconAnchor: [15, 15],
    //                     popupAnchor: [0, -15],
    //                     shadowUrl: `/images/mapIcons/${location.type}.png`,
    //                     shadowSize: [34, 30],
    //                     shadowAnchor: [15, 15],
    //                 });
    //             break;
    //         case 'city':
    //             icon =
    //                 L.icon({
    //                     iconUrl: `/images/mapIcons/${location.type}.png`,
    //                     iconSize: [80, 50],
    //                     iconAnchor: [40, 25],
    //                     popupAnchor: [0, -50],
    //                     shadowUrl: `/images/mapIcons/${location.type}.png`,
    //                     shadowSize: [80, 50],
    //                     shadowAnchor: [40, 25],
    //                 });
    //             break;
    //         default:
    //             break;
    //     }
    //     if (!icon) {
    //         marker = L.marker(map.containerPointToLatLng([location.x, location.y]), { draggable: true, id: location.id }).addTo(map)
    //             .bindPopup(`${location.description}`);
    //     } else {
    //         marker = L.marker(map.containerPointToLatLng([location.x, location.y]), { icon: icon, id: location.id }).addTo(map)
    //             .bindPopup(`${location.description}`);
    //     }
    //     if (location.visited === true) marker._icon.classList.add('huechange');

    // })

    // var imageUrl = databaseMap.data.map_url,
    //     imageBounds = [northEast, southWest];

    // let imgOverlay = L.imageOverlay(imageUrl, imageBounds, {
    //     interactive: true,
    // }).addTo(map);

    // L.imageOverlay(imageUrl, imageBounds).bringToFront();

    // // map.on('click', function (e) {
    // //     // console.log(L.popup().isOpen());

    // //     // map.setMaxBounds(map.getBounds() * 2);
    // //     var popLocation = e.latlng;
    // //     let x = popLocation.lng / map.getBounds().getEast()
    // //     let y = popLocation.lat / map.getBounds().getNorth()
    // //     L.popup()
    // //         .setLatLng(popLocation)
    // //         .setContent(`x: ${x} \n y: ${y}`)
    // //         .openOn(map);

    // //     mapSidebar.close()
    // // });


    imgOv.on('click', async (e) => {
        var x = e.containerPoint.x;
        var y = e.containerPoint.y;

        console.log(x, y);
        // console.log(y);

        // console.log(map.containerPointToLatLng([x, y]));
        // var lat = map.layerPointToLatLng([x, y]).lat;
        // var lng = map.layerPointToLatLng([x, y]).lng;
        // // console.log(lat);
        // // console.log(lng);

        // let marker = L.marker([lat, lng], {
        //     id: 'test'
        // }).addTo(map)


        // mapSidebar.close()

    });


    // document.querySelectorAll('.locationCategoryHeader').forEach(category => {
    //     category.addEventListener('click', function (e) {
    //         category.querySelector('i').classList.toggle('open')
    //         category.parentElement.classList.toggle('open');

    //     })
    // })
    // document.querySelectorAll('.location').forEach(location => {
    //     location.addEventListener('click', function (e) {
    //         marker = map.getMarkerById(location.id); // returns marker instance
    //         if (!marker) return;
    //         // map.setView(marker.getLatLng(), 1);

    //         // console.log(marker.getLatLng())
    //         map.setView(marker.getLatLng(), 5);
    //         marker.openPopup()
    //         mapSidebar.close()
    //     })
    // })
});

// function getKnownLocations() {
//     let knownLocations = [
//         {
//             markerName: "Tsurugi's woonplaats",
//             x: .60,
//             y: -.80
//         },
//         {
//             markerName: "Phoens's home",
//             x: .90,
//             y: -.90
//         },
//     ]
//     return knownLocations;
// }

// function createForm(x, y) {
//     x = Math.round(x * 100_000_000_000) / 100_000_000_000;
//     y = Math.round(y * 100_000_000_000) / 100_000_000_000;
//     let form =
//         "<form class='mapPopUpForm'>" +
//         "<h1>new location</h1>" +
//         "<label class='mapPopUplabel'>Lat : </label>" +
//         "<input class='mapPopUpinput' type='number' step='0.000001' disabled value=" + y + "><br/>" +
//         "<label class='mapPopUplabel'>Long: </label>" +
//         "<input class='mapPopUpinput' type='number' step='0.000001' disabled value=" + x + "><br/>" +
//         "<label class='mapPopUplabel'>Location name: </label>" +
//         "<input class='mapPopUpinput' type='text'/><br/>" +
//         "<label class='mapPopUplabel'>Description: </label>" +
//         "<textarea class='mapPopUpinput' type='text' rows='4' cols='50'></textarea><br/>" +
//         "<button class='mapPopUpinput' type='submit'>submit</button>" +
//         "</form>"
//     return form;
// }

L.Map.include({
    getMarkerById: function (id) {
        var marker = null;
        this.eachLayer(function (layer) {
            if (layer instanceof L.Marker) {
                if (layer.options.id === id) {
                    marker = layer;
                }
            }
        });
        return marker;
    }
});

function getMeta(url) {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject();
        img.src = url;
    });
}
