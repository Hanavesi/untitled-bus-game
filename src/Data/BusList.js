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
                return <li>{bus}: {buses[bus].lat}, {buses[bus].long}</li>
            })}
        </ul>
    )
}

export default BusList;