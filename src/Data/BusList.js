import { useEffect, useState } from "react";
import { MqttHandler } from "./Mqtt";
import { fetchItinerary, fetchStop } from "./ItineraryData";

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

var busIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/4550/4550988.png',

    iconSize: [40, 40],
    iconAnchor: [10, 30],
    popupAnchor: [10, -25]

})

const BusList = () => {
    //const [buses, setBuses] = useState({});
    let buses = {};
    const topic = "/hfp/v2/journey/ongoing/+/bus/+/+/+/+/+/+/+/+/60;24/19/85/#";
    const [mqttHandler, setMqtt] = useState(new MqttHandler);
    let map;

    const onConnect = () => {
        console.log('Connected');
        mqttHandler.subscribe(topic);
    }

    const connect = () => {
        mqttHandler.connect('wss://mqtt.hsl.fi:443/', onConnect, onMessage);
    }

    const onDisconnect = () => {
        console.log('disconnected');
    }

    const disconnect = () => {
        mqttHandler.disconnect(onDisconnect);
    }

    const compareBuses = (bus1, bus2) => {
        return bus1.topic === bus2.topic;
    }



    const onMessage = (message, topic) => {
        // Haetaan topicista päätepysäkki
        const array = topic.split('/');
        const destination = array[11];
        const data = JSON.parse(message);
        const subData = data[Object.keys(data)[0]];
        const vehicleNumber = subData.veh.toString().padStart(5, '0');
        const operatorId = subData.oper.toString().padStart(4, '0');
        const busTopic = `/hfp/v2/journey/ongoing/+/bus/${operatorId}/${vehicleNumber}/#`;

        let marker;
        let timeToDestination;
        let headSign;
        let duration;
        if (subData.veh in buses) {
            marker = buses[subData.veh].marker;
            marker.setLatLng([subData.lat, subData.long]);
            timeToDestination = buses[subData.veh].duration;
            headSign = buses[subData.veh].destination;
        } else {
            //tän hetkinen sijainti
            const from = { lat: subData.lat, long: subData.long }
            if (from) {
                // Haetaan aika
                duration = fetchDuration(from, destination)
                timeToDestination = duration;
            }
            // markerissa custom markkeri ja popup lisättynä
            // tähän esim peliaika näkyviin jos sais kaua kestää vielä päättärille??
            marker = new L.Marker([subData.lat, subData.long], { icon: busIcon }).addTo(map).bindPopup(
                `To ${destination}, time to destination ${duration}`
            );
        }

        // AIKA-ARVIO KOHTEESEEN SAAPUMISEEN, ELI ARVIOITU PELIN KESTO??
        // MARKERIN POISTAMINEN NÄKYVISTÄ KUN BUSSI SAAPUU PERILLE ??

        const newBus = {
            position: Object.keys(data)[0],
            start: subData.start,
            long: subData.long,
            lat: subData.lat,
            topic: busTopic,
            destination: headSign,
            marker: marker,
            duration: timeToDestination,
        }

        buses = { ...buses, [subData.veh]: newBus }
    }
    // TÄN RETURNI ON VIELÄ PROMISESSA ??????
    // Tässä haetaan päättärin koordinaatit ja sitte aikaa
    const fetchDuration = async (from, destination) => {
        let duration;
        const to = await fetchStop(destination)
        if (to) {
            duration = fetchItinerary(from, to)
            //console.log('duration', duration);
            return duration;
        }
    }

    useEffect(() => {
        connect();
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

    }, [])


    const clickEvent = (bus) => {

    }

    return (
        <div>
            <div id='map' style={{ height: '800px', width: '1000px' }}>

            </div>
            <div>
                <ul>
                    {Object.keys(buses).map(bus => {
                        return <li onClick={() => clickEvent(bus)}>{bus}: {buses[bus].position}, {buses[bus].lat}, {buses[bus].long}, {buses[bus].start}, {buses[bus].topic}</li>
                    })}
                </ul>
            </div>
        </div >
    )

}

export default BusList;