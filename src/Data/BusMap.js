import { useEffect, useRef, useState } from "react";
import { fetchDuration } from "./ItineraryData";
import { MqttHandler } from "./Mqtt";

const L = require('leaflet');
const topicAreas = [
    '60;24/19/50', '60;24/19/51',
    '60;24/19/52', '60;24/19/53',
    '60;24/19/54', '60;24/19/55',
    '60;24/19/56', '60;24/19/60',
    '60;24/19/61', '60;24/19/62',
    '60;24/19/63', '60;24/19/64',
    '60;24/19/65', '60;24/19/66',
    '60;24/19/70', '60;24/19/71',
    '60;24/19/72', '60;24/19/73',
    '60;24/19/74', '60;24/19/75',
    '60;24/19/76', '60;24/19/80',
    '60;24/19/81', '60;24/19/82',
    '60;24/19/83', '60;24/19/84',
    '60;24/19/85', '60;24/19/86'
];

const BusMap = () => {
    let buses = {};
    const topicStub = "/hfp/v2/journey/ongoing/+/bus/+/+/+/+/+/+/+/+/";
    const topic = "/hfp/v2/journey/ongoing/+/bus/+/+/+/+/+/+/+/+/60;24/19/73/#";
    const mqttHandler = useRef(null);
    let map;

    var busIcon = new L.Icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/4550/4550988.png',

        iconSize: [40, 40],
        iconAnchor: [10, 30],
        popupAnchor: [10, -25]

    })

    const onConnect = () => {
        console.log('Connected');
        //mqttHandler.current.subscribe(topic);
        for (const area of topicAreas) {
            mqttHandler.current.subscribe(`${topicStub}${area}/#`)
        }
    }

    const connect = () => {
        mqttHandler.current.connect('wss://mqtt.hsl.fi:443/', onConnect, onMessage);
    }

    const onDisconnect = () => {
        console.log('disconnected');
    }

    const disconnect = () => {
        mqttHandler.current.disconnect(onDisconnect);
    }

    const onMessage = (message, topic) => {
        const topicData = topic.split('/');
        const destination = topicData[11];

        const data = JSON.parse(message);
        const subData = data[Object.keys(data)[0]];
        const vehicleNumber = subData.veh.toString().padStart(5, '0');
        const operatorId = subData.oper.toString().padStart(4, '0');
        const busId = vehicleNumber+operatorId;
        const busTopic = `/hfp/v2/journey/ongoing/+/bus/${operatorId}/${vehicleNumber}/#`;
        const route = subData.desi;

        let newBus;
        let marker;
        if (busId in buses) {
            newBus = buses[busId];
            marker = newBus.marker;
            marker.setLatLng([subData.lat, subData.long]);
        } else {
            marker = new L.Marker([subData.lat, subData.long], { icon: busIcon }).addTo(map).bindPopup('no data');
            newBus = {
                position: Object.keys(data)[0],
                start: subData.start,
                long: subData.long,
                lat: subData.lat,
                topic: busTopic,
                destination: destination,
                duration: -1,
                route: route,
                marker: marker,
            }
        }

        buses = { ...buses, [busId]: newBus }
    }

    const initMap = () => {
        let current_lat = 60.183832;
        let current_long = 24.9538298;
        // BASIC LEAFLET WITH HSL TILELAYER

        // The <div id="map"> must be added to the dom before calling L.map('map')
        map = L.map('map').setView([current_lat, current_long], 15);

        L.tileLayer("https://cdn.digitransit.fi/map/v1/{id}/{z}/{x}/{y}.png", {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
            maxZoom: 19,
            tileSize: 512,
            zoomOffset: -1,
            id: 'hsl-map'
        }).addTo(map);
    }

    const updatePopups = async () => {
        // Parallel
        const curr = new Date();
        await Promise.all(Object.keys(buses).map(async (key) => {
            const bus = buses[key];
            const from = { lat: bus.lat, long: bus.long };
            const timeToDestination = await fetchDuration(from, bus.destination);
            if (timeToDestination !== undefined && timeToDestination > 0) {
                const timeRemaining = (timeToDestination - curr.getTime()) / 60000;
                bus.duration = timeRemaining;
            } else {
                bus.duration = -1;
            }
            // TODO: https://stackoverflow.com/questions/13698975/click-link-inside-leaflet-popup-and-do-javascript
            bus.marker.setPopupContent(`dest: ${bus.destination}; duration: ${bus.duration}; route: ${bus.route}`)
            
        }));
        // In sequence
        /* for (const key of Object.keys(buses)) {
            const bus = buses[key];
            const from = { lat: bus.lat, long: bus.long };
            const timeToDestination = await fetchDuration(from, bus.destination);
            if (timeToDestination !== undefined && timeToDestination > 0) {
                bus.duration = timeToDestination;
            } else {
                bus.duration = -1;
            }

            bus.marker.setPopupContent(`dest: ${bus.destination}; duration: ${bus.duration}; route: ${bus.route}`)
        } */
    }

    useEffect(() => {
        const interval = setInterval(updatePopups, 5000);
        mqttHandler.current = new MqttHandler();
        connect();
        initMap();
        return(() => clearInterval(interval));
    }, [])


    const clickEvent = (bus) => {

    }

    return (
        <div>
            <div id='map' style={{ height: '800px', width: '1000px' }}>
            </div>
        </div >
    )

}

export default BusMap;