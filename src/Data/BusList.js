import { useEffect, useState } from "react";
import mqtt from 'mqtt';

const BusList = () => {
    const [buses, setBuses] = useState({});
    const [client, setClient] = useState();
    const topic = "/hfp/v2/journey/ongoing/+/+/+/+/+/+/+/+/+/+/60;24/19/85/#";

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

            setBuses(prev => ({
                ...prev, [subData.veh]: { position: Object.keys(data)[0], start: subData.start, long: subData.long, lat: subData.lat, topic: busTopic }
            }))
        })
    }

    const clickEvent = (bus) => {
        const newTopic = buses[bus].topic;
        client.unsubscribe(topic);
        client.subscribe(newTopic);
        setBuses({ [bus]: buses[bus] });
    }

    return (
        <ul>
            {Object.keys(buses).map(bus => {
                return <li onClick={() => clickEvent(bus)}>{bus}: {buses[bus].position}, {buses[bus].lat}, {buses[bus].long}, {buses[bus].start}, {buses[bus].topic}</li>
            })}
        </ul>
    )
}

export default BusList;