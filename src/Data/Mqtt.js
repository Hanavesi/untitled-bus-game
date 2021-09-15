import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';


const mqttConnection = () => {

    const client = mqtt.connect('wss://mqtt.hsl.fi:443/')
    console.log('connected FLAG', client.connected);

    client.on('connect', () => {
        console.log('connected', client.connected);
    });

    client.on('error', (err) => {
        console.log('Cannot connect', err);
    })

    useEffect(() => {
        client.on('message', function (topic, message, packet) {
            //console.log("message is " + message);
            //console.log("topic is " + topic);
            if (topic.toString().includes('dep')) {
                console.log(`Bus has left the stop: ${dateTime()} / ${topic}`);
            }
            else if (topic.toString().includes('ars')) {
                console.log(`Bus arrived to a stop: ${dateTime()} / ${topic}`);
            }
            else if (topic.toString().includes('vjout')) {
                console.log(`Final destination reached: ${dateTime()} / ${topic}`);
            }
        });

        //notice this is printed even before we connect
        console.log("end of script");
    }, [client])

    //JOS ei printtaa consoliin, bussi ei välttämättä ole ollenkaan liikkellä,
    // kokeile vaihtaa topic: "/hfp/v2/journey/ongoing/+/bus/+/+/2104/1/#"
    // tai "/hfp/v2/journey/ongoing/+/bus/+/+/2104/1/#"
    // tai "/hfp/v2/journey/ongoing/+/bus/+/+/1021/2/#"
    // tai "/hfp/v2/journey/ongoing/+/bus/+/+/1021/1/#"
    var topic = "/hfp/v2/journey/ongoing/+/bus/+/+/1021/2/#";

    client.subscribe(topic, { qos: 1 }); //single topic

    const dateTime = () => {
        const date = new Date();
        const time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        return time;
    }

}

export default mqttConnection;