import mqtt from 'mqtt';

export class MqttHandler {
    constructor() {
        this.client = null;
        this.connectStatus = "Connect";
        this.subscriptions = [];
    }

    connect = (host, connectCallback, messageCallback) => {
        this.connectStatus = "Connecting";
        this.client = mqtt.connect(host);

        if (this.client) {
            this.client.on("connect", () => {
                this.connectStatus = "Connected";
                connectCallback();
            });
            this.client.on("error", (err) => {
                console.error("Connection error: ", err);
                this.client.end();
            });
            this.client.on("reconnect", () => {
                this.connectStatus = "Reconnecting";
            });
            this.setMessageCallback(messageCallback);
        }
    }

    setMessageCallback = (messageCallback) => {
        this.client.on("message", (topic, message) => {
            const payload = { topic, message: message.toString() };
            if (payload.topic && payload.message) {
                messageCallback(payload.message, payload.topic);
            }
        });
    }

    subscribe = (topic, qos = 1) => {
        if (this.client) {
            this.client.subscribe(topic, { qos }, (error) => {
                if (error) {
                    console.log(`Failed to subscribe to topic ${topic}`, error);
                    return;
                }
                this.subscriptions.push(topic);
            });
        }
    }

    unsubscribe = (topic) => {
        if (this.client) {
            this.client.unsubscribe(topic, (error) => {
                if (error) {
                    console.log(`Failed to unsubscribe to topic ${topic}`, error);
                    return;
                }
                this.subscriptions.filter(item => item !== topic);
            });
        }
    }

    unsubscribeAll = () => {
        this.subscriptions.forEach(sub => {
            this.unsubscribe(sub);
        });
    }

    disconnect = (callback) => {
        if (this.client) {
            this.client.end(() => {
                this.connectStatus = false;
                this.subscriptions = [];
                if (callback !== undefined) {
                    callback();
                }
            });
        }
    }
}