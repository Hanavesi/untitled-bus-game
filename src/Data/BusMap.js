import { useEffect, useState } from "react";
import { fetchDuration, fetchRouteId, fuzzyTripQuery, fetchStopLocation } from "./ItineraryData";
import bus_icon from "../Assets/images/bus_icon.png"
/**
 * ------- DISCLAIMER ---------
 * Those who appreciate their sanity
 * may wish not to go further in reading
 * and trying to understand this file.
 * 
 * - a hopeless dev
 */

const MQTTURL = 'wss://mqtt.hsl.fi:443/';
const L = require('leaflet');
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

const busIcon = new L.Icon({
  iconUrl: bus_icon,

  iconSize: [40, 40],
  iconAnchor: [20, 30],
  popupAnchor: [5, -25]

});

const full = {
  height: '100vh',
  width: '100vw',
}

const mini = {
  height: '20vh',
  width: '20vh',
}

const BusMap = ({ mqttHandler, gameMessageHandler, initGame }) => {
  let buses = {};
  let map;
  const [focus, setFocus] = useState(true);
  const topicStub = "/hfp/v2/journey/ongoing/+/bus/+/+/+/+/+/+/+/+/";

  useEffect(() => {
    const interval = setInterval(update, 5000);
    connect();
    initMap();
    return (() => clearInterval(interval));
  }, []);

  const onConnect = () => {
    console.log('Connected');
    for (const area of topicAreas) {
      mqttHandler.subscribe(`${topicStub}${area}/#`)
    }
  }

  const connect = () => {
    mqttHandler.connect(MQTTURL, onConnect, onMessage);
  }

  const onDisconnect = () => {
    console.log('disconnected');
  }

  const disconnect = () => {
    mqttHandler.disconnect(onDisconnect);
  }

  const setMessageHandler = () => {
    map.invalidateSize();
    mqttHandler.setMessageCallback((message, topic) => {
      onMessage(message, topic);
      gameMessageHandler(message, topic);
      const data = JSON.parse(message);
      const eventType = Object.keys(data)[0];
      if (eventType !== 'VP') return;
      const subData = data[eventType];
      const { long, lat } = subData;
      if (long !== undefined && lat !== undefined) {
        map.setView([lat, long], 16);
      }
    });
  }

  const onMessage = (message, topic) => {
    const timeStamp = Date.now();
    const topicData = topic.split('/');
    const destination = topicData[11];
    const oper = topicData[7];

    const data = JSON.parse(message);
    const eventType = Object.keys(data)[0];
    if (eventType !== 'VP') return;
    const subData = data[eventType];
    const { start, long, lat, desi, drst, dir, oday } = subData;
    const vehicleNumber = subData.veh.toString().padStart(5, '0');
    /**
     * https://digitransit.fi/en/developers/apis/4-realtime-api/vehicle-positions/
     * Operator id is not always the same as the id required for the topic so it is not
     * a good indicator for selecting a good topic
     */
    const operatorId = subData.oper.toString().padStart(4, '0');
    const busId = vehicleNumber + operatorId;
    const busTopic = `/hfp/v2/journey/ongoing/+/bus/${oper}/${vehicleNumber}/#`;

    let newBus;
    if (busId in buses) {
      newBus = buses[busId];
      newBus.lastUpdate = timeStamp;
      newBus.drst = drst;
      const marker = newBus.marker;
      if (lat === undefined || long === undefined) {
        return;
      } else {
        marker.setLatLng([lat, long]);
      }
    } else {
      const marker = new L.Marker([lat, long], { icon: busIcon }).addTo(map).bindPopup('no data');
      newBus = {
        start: start,
        long: long,
        lat: lat,
        topic: busTopic,
        destination: destination,
        duration: -1,
        route: desi,
        marker: marker,
        drst: drst,
        direction: dir,
        date: oday,
        endLoc: null,
        lastUpdate: timeStamp
      }
    }

    buses = { ...buses, [busId]: newBus };
  }

  const initMap = () => {
    let current_lat = 60.183832;
    let current_long = 24.9538298;
    // BASIC LEAFLET WITH HSL TILELAYER

    // The <div id="map"> must be added to the dom before calling L.map('map')
    map = L.map('map', {
      dragging: false,
      zoomControl: false,
      scrollWheelZoom: false,
      doubleClickZoom: false })
      .setView([current_lat, current_long], 14);

    L.tileLayer("http://a.tile.stamen.com/toner/{z}/{x}/{y}@2x.png", {
      attribution: `Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap"</a>`,
      maxZoom: 19,
      tileSize: 512,
      zoomOffset: -1,
    }).addTo(map);
  }

  /**
   * Tries to fetch the position of the last stop for the bus and
   * updates the bus object.
   * @param {*} bus 
   */
  const getEndStopLoc = async (bus) => {
    const { route, direction, date, start } = bus;
    const [hours, minutes] = start.split(':');
    const time = hours * 60 * 60 + minutes * 60;
    const routeId = await fetchRouteId(route);
    const endGtfsId = routeId && await fuzzyTripQuery({ route: routeId, direction: direction, date: date, time: time });
    const endLoc = endGtfsId && await fetchStopLocation(endGtfsId);
    bus.endLoc = endLoc;
  }

  /**
   * Calls the update-functions that update the bus marker
   * info and remove inactive buses.
   */
  const update = () => {
    removeOld();
    updatePopups();
  }

  /**
   * Asynchronously updates all the popups for the buses on the map.
   * The markers are hidden, if the estimated time to finish for the bus
   * cannot be fetched.
   */
  const updatePopups = async () => {
    const currentTime = new Date().getTime();
    // Parallel processing
    await Promise.all(Object.keys(buses).map(async (key) => {
      const bus = buses[key];
      const from = { lat: bus.lat, long: bus.long };
      if (!bus.endLoc || bus.endLoc === undefined) await getEndStopLoc(bus);
      const to = bus.endLoc;
      const timeToDestination = await fetchDuration(from, to);

      const icon = bus.marker.options.icon;
      if (timeToDestination !== undefined && timeToDestination > 0) {
        const timeRemaining = (timeToDestination - currentTime) / 60000; // ms to minutes
        bus.duration = Math.round(timeRemaining);
        icon.options.iconSize = [40, 40];
        bus.marker.setIcon(icon);
      } else {
        bus.duration = -1;
        //hide icon if duration is unavailable
        icon.options.iconSize = [0, 0];
        bus.marker.setIcon(icon);
      }
      const container = createPopupContent(bus);
      bus.marker.setPopupContent(container);
    }));
    // In sequence processing
    /* for (const key of Object.keys(buses)) {
        const bus = buses[key];
        const from = { lat: bus.lat, long: bus.long };
        const timeToDestination = await fetchDuration(from, bus.destination);
        if (timeToDestination !== undefined && timeToDestination > 0) {
            bus.duration = timeToDestination;
        } else {
            bus.duration = -1;
        }

        bus.marker.setPopupContent(`dest: ${bus.destination}; duration: ${bus.duration}; route: ${bus.route}`)
    } */
  }

  /**
   * Creates a div-element that contains bus info for leaflet popup
   * @param {*} bus 
   * @returns {HTMLDivElement} a div-element containing some info and a button.
   */
  const createPopupContent = (bus) => {
    const container = document.createElement('div');
    const info = document.createElement('div');
    info.innerText = `dest: ${bus.destination}; duration: ${bus.duration}min;`;
    const button = document.createElement('button');
    button.innerText = 'Protect this bus!';
    button.onclick = () => clickEvent(bus);
    container.append(info);
    container.append(button);

    return container;
  }

  /**
   * Removes buses that have not received any new updates for 30 seconds
   */
  const removeOld = () => {
    const timeStamp = Date.now();
    Object.keys(buses).forEach(key => {
      const bus = buses[key];
      const lastUpdate = bus.lastUpdate;
      const delta = (timeStamp - lastUpdate) / 1000;
      if (delta > 30) {
        bus.marker.remove();
        delete buses[key];
      };
    });
  }

  // TODO: If no messages are received after selecting, Show all buses again.
  /**
   * Unsibscribes all current topics and subscribes to just the selected bus.
   * @param {*} bus 
   */
  const clickEvent = (bus) => {
    mqttHandler.unsubscribeAll();
    // Sometimes subsctiption fails somehow and further messages from the chosen bus are not received
    mqttHandler.subscribe(bus.topic);
    bus.marker.closePopup();
    setFocus(false);
    setMessageHandler();
    initGame();
  }

  // TODO: change outer div size according to props etc.
  // If props, then buses needs to be a useState and only be updated
  // every once in a while maybe??
  return (
    <div id='map' style={{
      ...(focus ? full : mini),
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 1
    }}>
    </div>
  );
}

export default BusMap;