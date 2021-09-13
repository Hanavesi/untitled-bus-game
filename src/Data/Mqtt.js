import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';


const mqttConnection = () => {
    const [connectionStatus, setConnectionStatus] = useState(false);
    const [messages, setMessages] = useState([]);
    var count = 0;

    useEffect(() => {
        const client = mqtt.connect('wss://mqtt.hsl.fi:443/')
        console.log('connected FLAG', client.connected);

        client.on('connect', () => {
            console.log('connected', client.connected);
            setConnectionStatus(true)
        });

        client.on('error', (err) => {
            console.log('Cannot connect', err);
        })

        client.on('message', function (topic, message, packet) {
            console.log("message is " + message);
            console.log("topic is " + topic);
        });



        var options = {
            retain: true,
            qos: 1
        };
        var topic = "/hfp/v2/journey/ongoing/+/bus/+/+/2104/1/#";

        client.subscribe(topic, { qos: 1 }); //single topic

        //notice this is printed even before we connect
        console.log("end of script");
    }, [])


}

export default mqttConnection;