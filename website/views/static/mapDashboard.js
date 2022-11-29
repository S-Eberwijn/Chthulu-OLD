
async function loadMap(databaseMap) {
    databaseMap = databaseMap[0];
    let mapElement = document.getElementById("map");
    let size = mapElement.getBoundingClientRect();
    let width = size.width;
    let height = size.height;

    let center = [0, 0]
    let map = L.map('map', {
        zoomControl: false,
        center: center,
        crs: L.CRS.Simple
    });
    let bounds = [[0, 0], [height, width]];
    let mapImg = L.imageOverlay(databaseMap.data.map_url, bounds).addTo(map);
    map.fitBounds(bounds);
    mapImg.bringToFront();
    map.setMaxBounds(bounds);

    const uniqueTypes = [...new Set(databaseMap.data.locations.map(location => location.type))]

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

    let mapSidebar = L.control.sidebar({
        autopan: false,       // whether to maintain the centered map point when opening the sidebar
        closeButton: false,    // whether t add a close button to the panes
        container: 'map-sidebar', // the DOM container or #ID of a predefined sidebar container that should be used
        position: 'left',     // left or right
    })
        .addTo(map);

    /* add a new panel */
    let welcomeContent = {
        id: 'welcomePanel',                     // UID, used to access the panel
        tab: '<i class="fas fa-home"></i>',  // content can be passed as HTML string,
        pane: 'someDomNode.innerHTML',        // DOM elements can be passed, too
        title: 'Welcome to Ghaeya',              // an optional pane header
        position: 'top'                  // optional vertical alignment, defaults to 'top'
    };
    mapSidebar.addPanel(welcomeContent);

    let locationDOMString = `${uniqueTypes.map(type => { return `<div class="locationCategory"><div class="locationCategoryHeader"><span class="locationCategoryName">${type.charAt(0).toUpperCase() + type.slice(1)}</span><div><span class="amountOfLocations">${databaseMap.data.locations.filter(location => location.type === type).length}</span><i class="fas fa-chevron-right"></i></div></div>${databaseMap.data.locations.filter(location => location.type === type).map(location => { return `<div class="location" id="${location.id}"><span class="locationName">${location.description}</span></div>` }).join('')}</div>` }).join('')}`;
    let locationContent = {
        id: 'locationPanel',                     // UID, used to access the panel
        tab: '<i class="fas fa-map-marker-alt"></i>',  // content can be passed as HTML string,
        pane: locationDOMString,
        title: 'Locations',              // an optional pane header
        position: 'top'                  // optional vertical alignment, defaults to 'top'
    };
    mapSidebar.addPanel(locationContent);
    let filterContent = {
        id: 'filterPanel',                     // UID, used to access the panel
        tab: '<i class="fas fa-filter"></i>',  // content can be passed as HTML string,
        pane: `${uniqueTypes.filter(type => type != 'players').map(type => { return `<div class="filter"><span>${type.charAt(0).toUpperCase() + type.slice(1)}</span><label class="switch" for="${type}-checkbox"><input type="checkbox" action="filter" id="${type}-checkbox" checked=true> </input><div class="slider round"></div></label></div>` }).join('')}`,
        title: 'Filters',              // an optional pane header
        position: 'top'                  // optional vertical alignment, defaults to 'top'
    };
    mapSidebar.addPanel(filterContent);
    let fullscreenContent = {
        id: 'click',
        tab: '<i class="fas fa-expand"></i>',
        position: 'bottom',                  // optional vertical alignment, defaults to 'top'
        button: function () {
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
    let settingsContent = {
        id: 'settingsPanel',                     // UID, used to access the panel
        tab: '<i class="fa fa-gear"></i>',  // content can be passed as HTML string,
        pane: 'someDomNode.innerHTML',        // DOM elements can be passed, too
        title: 'Settings',              // an optional pane header
        position: 'bottom'                  // optional vertical alignment, defaults to 'top'
    };
    mapSidebar.addPanel(settingsContent);
    mapSidebar.open('filterPanel');

    mapImg.on('click', async (e) => {
        let latLng = e.latlng;
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
            console.log(marker.options.type)
            map.setView(marker.getLatLng(), 5);
            mapSidebar.close()
        })
    })

    document.querySelectorAll('input[action="filter"]').forEach(filter => {
        filter.addEventListener('click', function (e) {
            document.querySelectorAll(`img[src*="${filter.id.split('-')[0]}"]`).forEach(img => {
                img.classList.toggle('hidden');
            })
        })
    })
}

L.Map.include({
    getMarkerById: function (id) {
        let marker = null;
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
        let markers = [];
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