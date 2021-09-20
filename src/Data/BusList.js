import { useEffect, useState } from "react";
import { Mqtt } from "./Mqtt";

const BusList = () => {
    const [buses, setBuses] = useState({});
    const mqtt = new Mqtt();

    useEffect(() => {
        mqtt.connect();
        mqtt.getBuses(setBuses);
    }, []);

    const clickEvent = (topic) => {
        mqtt.connect();
        mqtt.singleTopic(topic, setBuses);
        setBuses({});
    }

    return (
        <ul>
            {Object.keys(buses).map(bus => {
                return <li onClick={() => clickEvent(buses[bus].topic)}>{bus}: {buses[bus].position}, {buses[bus].lat}, {buses[bus].long}, {buses[bus].start}, {buses[bus].topic}</li>
            })}
        </ul>
    )
}

export default BusList;