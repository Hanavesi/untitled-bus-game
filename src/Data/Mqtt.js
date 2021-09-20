import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';

export class Mqtt {

    constructor() {
        this.buses = {};
        this.messageCount = 0;
    }

    connect() {
        this.client = mqtt.connect('wss://mqtt.hsl.fi:443/');
        this.client.on('connect', () => {
            console.log('client connected');
        });
        this.client.on('error', (err) => {
            console.log('connection error', err);
        });
    }

    subscribe(topic) {
        this.client.subscribe(topic, { qos: 1 });
    }

    unSubscribe(topic) {
        this.client.unsubscribe(topic, { qos: 1 });
    }

    getBuses(setBuses) {
        const date = new Date();
        const time = date.getHours() + ':' + date.getMinutes();
        const basicTopic = `/hfp/v2/journey/ongoing/+/bus/+/+/+/+/+/${time}/#`;
        //const topic2 = "/hfp/v2/journey/ongoing/+/bus/+/+/2104/2/#";

        this.client.subscribe(basicTopic, { qos: 1 });
        //this.client.subscribe(topic2, { qos: 1 });
        this.client.on('message', (_, message) => {
            const data = JSON.parse(message);
            const subData = data[Object.keys(data)[0]];
            console.log(this.buses);
            const vehicleNumber = subData.veh.toString().padStart(5, '0');
            const topic = `/hfp/v2/journey/ongoing/+/bus/+/${vehicleNumber}/#`
            if (Object.keys(this.buses).length === 4) {
                this.unSubscribe(basicTopic)
                console.log('unsubscribed');
            }
            this.buses[subData.veh] = { position: Object.keys(data)[0], start: subData.start, long: subData.long, lat: subData.lat, topic: topic };
            setBuses(prev => ({
                ...prev, [subData.veh]: { position: Object.keys(data)[0], start: subData.start, long: subData.long, lat: subData.lat, topic: topic }
            }))
        })
    }
}

// /hfp/v2/journey/ongoing/vp/bus/0017/00051/1021/2/Kamppi/12:50/1310105/5/60;24/18/68/02
/*
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
            console.log("topic is " + topic);
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

export default mqttConnection; */