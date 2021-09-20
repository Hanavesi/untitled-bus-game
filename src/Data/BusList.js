import { useEffect, useState } from "react";
import { Mqtt } from "./Mqtt";

const BusList = () => {
    const [buses, setBuses] = useState({});
    const mqtt = new Mqtt();

    useEffect(() => {
        mqtt.connect();
        mqtt.getBuses(setBuses);
    }, []);

    return (
        <ul>
            {Object.keys(buses).map(bus => {
                return <li>{bus}: {buses[bus].position}, {buses[bus].lat}, {buses[bus].long}, {buses[bus].start}, {buses[bus].topic}</li>
            })}
        </ul>
    )
}

export default BusList;