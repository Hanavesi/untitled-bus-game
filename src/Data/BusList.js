import { useEffect, useState } from "react";
import { MqttHandler } from "./Mqtt";

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
const topic = "/hfp/v2/journey/ongoing/+/+/+/+/+/+/+/+/+/+/60;24/19/85/#";

const BusList = () => {
    const [buses, setBuses] = useState({});
    const [mqttHandler, setMqtt] = useState(new MqttHandler);

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
        console.log(mqttHandler);
        mqttHandler.disconnect(onDisconnect);
    }

    const compareBuses = (bus1, bus2) => {
        return bus1.topic === bus2.topic;
    }

    const onMessage = (message) => {
        const data = JSON.parse(message);
        const vehicleData = data[Object.keys(data)[0]];
        const vehicleNumber = vehicleData.veh.toString().padStart(5, '0');
        const operatorId = vehicleData.oper.toString().padStart(4, '0');
        const busTopic = `/hfp/v2/journey/ongoing/+/bus/${operatorId}/${vehicleNumber}/#`;

        const newBus = {
            position: Object.keys(data)[0],
            start: vehicleData.start,
            lat: vehicleData.lat,
            long: vehicleData.long,
            topic: busTopic,
        }

        setBuses(prev => ({
            ...prev, [vehicleData.veh]: newBus
        }));
    }

    useEffect(() => {
        connect();
    }, []);

    const clickEvent = (bus) => {

    }

    return (
        <div>
            <button onClick={disconnect}>disconnect</button>
            <button onClick={connect}>connect</button>
            <ul>
                {Object.keys(buses).map(bus => {
                    return <li onClick={() => clickEvent(bus)}>{bus}: {buses[bus].position}, {buses[bus].lat}, {buses[bus].long}, {buses[bus].start}, {buses[bus].topic}</li>
                })}
            </ul>
        </div>
    )
}

export default BusList;