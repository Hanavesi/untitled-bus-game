import { useEffect, useState } from "react";
import mqtt from 'mqtt';
var L = require('leaflet');

const BusList = () => {
    const [buses, setBuses] = useState([{}]);
    const [client, setClient] = useState();
    const topic = "/hfp/v2/journey/ongoing/+/+/+/+/+/+/+/+/+/+/60;24/19/85/#";
    let map;

    useEffect(() => {
        const cl = mqtt.connect('wss://mqtt.hsl.fi:443/');
        setClient(cl);
        cl.on('connect', () => {
            console.log('client connected');
        });
        cl.on('error', (err) => {
            console.log('connection error', err);
        });
        getBuses(cl);
    }, []);

    const getBuses = (client) => {
        client.subscribe(topic, { qos: 1 });

        client.on('message', (_, message) => {
            const data = JSON.parse(message);
            const subData = data[Object.keys(data)[0]];
            const vehicleNumber = subData.veh.toString().padStart(5, '0');
            const operatorId = subData.oper.toString().padStart(4, '0');
            const busTopic = `/hfp/v2/journey/ongoing/+/bus/${operatorId}/${vehicleNumber}/#`;
            // var marker = new L.Marker([subData.lat, subData.long]).addTo(map)
            setBuses(prev => ({
                ...prev, [subData.veh]: { position: Object.keys(data)[0], start: subData.start, long: subData.long, lat: subData.lat, topic: busTopic, marker: new L.Marker([subData.lat, subData.long]).addTo(map) }
            }))
            L.Marker([subData.lat, subData.long]).update(marker);

            //new L.Marker([subData.lat, subData.long]).addTo(map)
        })



    }

    useEffect(() => {

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
        const newTopic = buses[bus].topic;
        client.unsubscribe(topic);
        client.subscribe(newTopic);
        setBuses({ [bus]: buses[bus] });
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
        </div>
    )

}

export default BusList;