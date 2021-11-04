import {useEffect, useState } from "react"

export const useMousePosition = () => {
    const [position,setPosition] = useState({x : 0, y : 0});

    useEffect(() =>{
        const setFromEvent = e => setPosition({x:(e.clientX / window.innerWidth) * 2 - 1, y:-(e.clientY / window.innerHeight) * 2 + 1});
        window.addEventListener("mousemove", setFromEvent);
        return () => {
            window.removeEventListener("mousemove", setFromEvent);
        };
    },[]);
    return position;
};