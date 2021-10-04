// Initialize leaflet.js
var L = require('leaflet');
import React, { useEffect } from 'react';

// top-left:             60.18, 24.90
// bottom-right:     60.15, 24.97

const BusMap = () => {
    useEffect(() => {
        let current_lat = 60.16757533981529;
        let current_long = 24.93309534470037;
        /* let current_zoom = 16;
        let center_lat = current_lat;
        let center_long = current_long;
        let center_zoom = current_zoom; */

        // The <div id="map"> must be added to the dom before calling L.map('map')
        let map = L.map('map', { zoomControl: false, dragging: false }).setView([current_lat, current_long], 14);

        L.tileLayer("https://cdn.digitransit.fi/map/v1/{id}/{z}/{x}/{y}.png", {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
            tileSize: 512,
            zoomOffset: -1,
            id: 'hsl-map'
        }).addTo(map);
    })
    return (
        <div id='map' style={{ height: '800px', width: '800px' }} ></div>
    )

}

export default BusMap;