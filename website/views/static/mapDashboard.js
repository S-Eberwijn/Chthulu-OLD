
window.addEventListener('DOMContentLoaded', async (event) => {
    let img = await getMeta(databaseMap.data.map_url);

    var imgHeight = img.height,
        imgWidth = img.width;

    // console.log(imgHeight, imgWidth);
    var center = [0, -imgWidth]
    var map = L.map('map', {
        zoomControl: false,
        minZoom: -1,
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

    const uniqueTypes = [...new Set(databaseMap.data.locations.map(location => location.type))]

    // Add location from database to map
    databaseMap.data.locations.forEach(location => {
        let marker;
        let lan = location.y;
        let lng = location.x;

        switch (location.type) {
            case 'towns':
                marker = L.marker([lng, lan], {
                    icon: L.icon({
                        iconUrl: `/images/mapIcons/${location.type}.png`,
                        iconSize: [34, 30],
                        iconAnchor: [17, 15],
                        popupAnchor: [0, -15],
                        shadowUrl: `/images/mapIcons/${location.type}.png`,
                        shadowSize: [34, 30],
                        shadowAnchor: [17, 15],
                    }),
                    id: location.id,
                    type: location.type,
                }).bindPopup(location.description).addTo(map);

                break;
            case 'cities':
                marker = L.marker([lng, lan], {
                    icon: L.icon({
                        iconUrl: `/images/mapIcons/${location.type}.png`,
                        iconSize: [80, 50],
                        iconAnchor: [40, 50],
                        popupAnchor: [0, -50],
                        shadowUrl: `/images/mapIcons/${location.type}.png`,
                        shadowSize: [80, 50],
                        shadowAnchor: [40, 50],
                    }),
                    id: location.id,
                    type: location.type,

                }).bindPopup(location.description).addTo(map);
                break;
            default:
                marker = L.marker([lng, lan], {
                    id: location.id,
                    type: location.type,

                }
                ).bindPopup(location.description).addTo(map);
                break;
        }

        if (location.visited === true) marker._icon.classList.add('huechange');
    })


    // map.fitBounds(imgOv.getBounds());


    var mapSidebar = L.control.sidebar({
        autopan: false,       // whether to maintain the centered map point when opening the sidebar
        closeButton: false,    // whether t add a close button to the panes
        container: 'map-sidebar', // the DOM container or #ID of a predefined sidebar container that should be used
        position: 'left',     // left or right
    })
        .addTo(map);

    /* add a new panel */
    var welcomeContent = {
        id: 'welcomePanel',                     // UID, used to access the panel
        tab: '<i class="fas fa-home"></i>',  // content can be passed as HTML string,
        pane: 'someDomNode.innerHTML',        // DOM elements can be passed, too
        title: 'Welcome to Ghaeya',              // an optional pane header
        position: 'top'                  // optional vertical alignment, defaults to 'top'
    };
    mapSidebar.addPanel(welcomeContent);

    let locationDOMString = `${uniqueTypes.map(type => { return `<div class="locationCategory"><div class="locationCategoryHeader"><span class="locationCategoryName">${type.charAt(0).toUpperCase() + type.slice(1)}</span><div><span class="amountOfLocations">${databaseMap.data.locations.filter(location => location.type === type).length}</span><i class="fas fa-chevron-right"></i></div></div>${databaseMap.data.locations.filter(location => location.type === type).map(location => { return `<div class="location" id="${location.id}"><span class="locationName">${location.description}</span></div>` }).join('')}</div>` }).join('')}`;
    // console.log(locationDOMString);
    var locationContent = {
        id: 'locationPanel',                     // UID, used to access the panel
        tab: '<i class="fas fa-map-marker-alt"></i>',  // content can be passed as HTML string,
        pane: locationDOMString,
        title: 'Locations',              // an optional pane header
        position: 'top'                  // optional vertical alignment, defaults to 'top'
    };
    mapSidebar.addPanel(locationContent);
    var filterContent = {
        id: 'filterPanel',                     // UID, used to access the panel
        tab: '<i class="fas fa-filter"></i>',  // content can be passed as HTML string,
        pane: `${uniqueTypes.filter(type => type != 'players').map(type => { return `<div class="filter"><span>${type.charAt(0).toUpperCase() + type.slice(1)}</span><label class="switch" for="${type}-checkbox"><input type="checkbox" action="filter" id="${type}-checkbox" checked=true> </input><div class="slider round"></div></label></div>` }).join('')}`,
        title: 'Filters',              // an optional pane header
        position: 'top'                  // optional vertical alignment, defaults to 'top'
    };
    mapSidebar.addPanel(filterContent);
    var fullscreenContent = {
        id: 'click',
        tab: '<i class="fas fa-expand"></i>',
        position: 'bottom',                  // optional vertical alignment, defaults to 'top'
        button: function (event) {
            // .requestFullscreen();
            let elem = document.getElementById(`map`);

            if (!document.fullscreenElement) {
                elem.requestFullscreen().catch(err => {
                    alert(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
                });
            } else {
                document.exitFullscreen();
            }
        }
    };
    mapSidebar.addPanel(fullscreenContent);
    var settingsContent = {
        id: 'settingsPanel',                     // UID, used to access the panel
        tab: '<i class="fa fa-gear"></i>',  // content can be passed as HTML string,
        pane: 'someDomNode.innerHTML',        // DOM elements can be passed, too
        title: 'Settings',              // an optional pane header
        position: 'bottom'                  // optional vertical alignment, defaults to 'top'
    };
    mapSidebar.addPanel(settingsContent);

    // mapSidebar.open('welcomePanel');
    mapSidebar.open('filterPanel');



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
        var latLng = e.latlng;
        var x = e.latlng.lat;
        var y = e.latlng.lng;
        console.log(latLng);

        mapSidebar.close()

    });


    document.querySelectorAll('.locationCategoryHeader').forEach(category => {
        category.addEventListener('click', function (e) {
            category.querySelector('i').classList.toggle('open')
            category.parentElement.classList.toggle('open');

        })
    })

    document.querySelectorAll('.location').forEach(location => {
        location.addEventListener('click', function (e) {
            marker = map.getMarkerById(location.id); // returns marker instance
            if (!marker) return;
            // map.setView(marker.getLatLng(), 1);

            console.log(marker.options.type)
            map.setView(marker.getLatLng(), 5);
            // marker.openPopup()
            mapSidebar.close()
        })
    })

    document.querySelectorAll('input[action="filter"]').forEach(filter => {
        filter.addEventListener('click', function (e) {
            // markers = map.getMarkersByType(filter.id.split('-')[0]); // returns marker instances
            document.querySelectorAll(`img[src*="${filter.id.split('-')[0]}"]`).forEach(img => {
                img.classList.toggle('hidden');
            })
        })
    })
});

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

L.Map.include({
    getMarkersByType: function (type) {
        var markers = [];
        this.eachLayer(function (layer) {
            if (layer instanceof L.Marker) {
                if (layer.options.type === type) {
                    markers.push(layer);
                }
            }
        });
        return markers;
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
