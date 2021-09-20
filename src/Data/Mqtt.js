import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';

export class Mqtt {

    constructor() {
        this.buses = [];
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
        console.log('unsubscribing -- ', topic)
        this.client.unsubscribe(topic, { qos: 1 });
    }

    close() {
        console.log(this.client);
    }

    singleTopic(topic, callBack) {
        this.client.subscribe(topic, { qos: 1 });
        this.client.on('message', (_, message) => {
            const data = JSON.parse(message);
            const subData = data[Object.keys(data)[0]];
            console.log(data);
            callBack(prev => ({
                ...prev, [subData.veh]: { position: Object.keys(data)[0], start: subData.start, long: subData.long, lat: subData.lat, topic: topic }
            }))
        })
    }

    getBuses(setBuses) {
        const date = new Date();
        const time = date.getHours() + ':' + date.getMinutes();
        const basicTopic = `/hfp/v2/journey/ongoing/+/bus/+/+/+/+/+/${time}/#`;
        //const basicTopic = "/hfp/v2/journey/ongoing/+/bus/#";

        this.client.subscribe(basicTopic, { qos: 1 });
        //this.client.subscribe(topic2, { qos: 1 });
        this.client.on('message', (_, message) => {
            const data = JSON.parse(message);
            const subData = data[Object.keys(data)[0]];
            const vehicleNumber = subData.veh.toString().padStart(5, '0');
            const operatorId = subData.oper.toString().padStart(4, '0');
            const topic = `/hfp/v2/journey/ongoing/+/bus/${operatorId}/${vehicleNumber}/#`;
            if (!vehicleNumber in this.buses) {
                console.log(this.buses);
                this.buses.push(vehicleNumber);
                this.subscribe(topic);
            }
            if (this.buses.length >= 4) {
                this.unSubscribe(basicTopic);
                this.buses = [];
                console.log('unsubscribed basic topic');
            }
            setBuses(prev => ({
                ...prev, [subData.veh]: { position: Object.keys(data)[0], start: subData.start, long: subData.long, lat: subData.lat, topic: topic }
            }))
        })
    }
}