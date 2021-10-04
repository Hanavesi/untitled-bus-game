/* // Initialize leaflet.js
var L = require('leaflet');
import React, { useEffect } from 'react';
import BusList from './BusList';

const BusMap = () => {
    const buses = BusList();
    //console.log(buses);

    let map;
    let marker = { lat: undefined, long: undefined };


    useEffect(() => {

        let current_lat = 60.23586;
        let current_long = 25.08325;
        // BASIC LEAFLET WITH HSL TILELAYER

        // The <div id="map"> must be added to the dom before calling L.map('map')
        map = L.map('map').setView([current_lat, current_long], 16);

        L.tileLayer("https://cdn.digitransit.fi/map/v1/{id}/{z}/{x}/{y}.png", {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
            tileSize: 512,
            zoomOffset: -1,
            id: 'hsl-map'
        }).addTo(map);

        for (const bus in buses) {
            console.log('bussiloopin bussit', bus);
            if (buses[bus].lat !== undefined && buses[bus].long !== undefined) {

                new L.Marker([buses[bus].lat, buses[bus].long]).addTo(map)
            }

        }

    }, [])

    /* Object.keys(buses).map(bus => {
        marker.lat = buses[bus].lat;
        marker.long = buses[bus].long;
        //console.log(marker);
    }) */






    //L.marker([latitude, longitude]).addTo(map);



/* return (
    <div id='map' style={{ height: '800px', width: '1000px' }} >

    </div>
)




}

export default BusMap; */