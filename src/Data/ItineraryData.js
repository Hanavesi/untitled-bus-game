const url = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql';

// hakee kauanko kestää kohteesta A kohteeseen B, koordinaatteja käyttäen
/**
 * Tries to fetch the expected time to destination
 * from current location. Returns undefined when fetch fails.
 * @param {{lat: number, long: number}} from 
 * @param {{lat: number, long: number}} to 
 * @returns {Promise<number>} expected time of arrival to end stop.
 */
export const fetchDuration = async (from, to) => {
    if (to === undefined) return undefined;
    const requestBody = `{
        plan(
            from: { lat: ${from.lat}, lon: ${from.long} }
            to: { lat: ${to.lat}, lon: ${to.long} }
            numItineraries: 1
            transportModes: [{ mode: BUS }, { mode: WALK }]
            ) {
                itineraries {
                    legs {
                        startTime
                        endTime
                        mode
                        duration
                        realTime
                        distance
                        transitLeg
                    }
                }
            }
        }`;
    const req = {
        method: 'POST',
        headers: { "Content-Type": "application/graphql" },
        body: requestBody
    }

    let resp;
    try {
        resp = await fetch(url, req);
    } catch (err) {
        //console.error('Failed to fetch itinerary', err);
        return undefined;
    }
    const json = await resp.json();
    //console.log(json.data);
    if (json.data.plan.itineraries[0] === undefined) {
        return undefined
    }
    let end;
    for (let i = 0; i < json.data.plan.itineraries[0].legs.length; i++) {
        if (json.data.plan.itineraries[0].legs[i].mode === 'BUS') {
            end = json.data.plan.itineraries[0].legs[i].endTime;
            //console.log(json.data.plan.itineraries[0].legs[i]);
        }
    }
    return end;
}

/**
 * Query end stop gtfs id from bus data.
 * @param {{route: string, direction: number, date: string, time: number}} data
 * @returns {Promise<string>}
 */
export const fuzzyTripQuery = async (data) => {
    if (data === undefined) console.log('data undefined at fuzzyTripQuery');
    const { route, direction, date, time } = data;
    const requestBody = `
    {
        fuzzyTrip(route: "${route}", direction:${direction-1}, date: "${date}", time: ${time}) {
            route { shortName }
            pattern { name }
        }
    }`;
    const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/graphql' },
        body: requestBody
    }
    let resp;
    try {
        resp = await fetch(url, req);
    } catch (err) {
        console.error('Failed to fetch fuzzyroute', err);
        return undefined;
    }
    const json = await resp.json();
    if (!json.data.fuzzyTrip) {
        console.log(requestBody);
        return undefined;
    };
    const idIndex = json.data.fuzzyTrip.pattern.name.indexOf('HSL');
    const hslId = json.data.fuzzyTrip.pattern.name.substring(idIndex, idIndex + 11);
    return hslId;
}

/**
 * 
 * @param {string} name 
 * @returns {Promise<string>} the gtfs id of the route the bus is currently on.
 */
export const fetchRouteId = async (name) => {
    const requestBody = `
    {
        routes(name: "${name}", transportModes: BUS) {
            gtfsId
            shortName
        }
    }`;
    const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/graphql' },
        body: requestBody
    }
    let resp;
    try {
        resp = await fetch(url, req);
    } catch (err) {
        console.error('Failed to fetch gtfsId', err);
        return undefined;
    }

    const json = await resp.json()
    //console.log(json);
    for (const route of json.data.routes) {
        if (route.shortName === name) {
            //console.log(route.shortName, route.gtfsId);
            return route.gtfsId;
        }
    }
    console.log(name);
    return undefined;
}

// hakee tarkan päätepysäkin graphqlstä topicista tuodulla päätepysäkillä
/**
 * 
 * @param {string} id 
 * @returns {Promise<{lat: number, long: number}>} the location of the bus stop with the specified id.
 */
export const fetchStopLocation = async (id) => {
    if (id === undefined) console.log('id undefined at fetchStop');
    let to;
    const requestBody = `
    {
        stops(ids: "${id}") {
            gtfsId
            name
            code
            lat
            lon
        }
    }`;
    const req = {
        method: 'POST',
        headers: { "Content-Type": "application/graphql" },
        body: requestBody
    }
    let resp;
    try {
        resp = await fetch(url, req);
    } catch (err) {
        //console.error('Failed to fetch stop data', err);
        return undefined;
    }
    const json = await resp.json();

    //console.log(json.data);
    if (json.data.stops === null) {
        return undefined
    }
    to = { lat: json.data.stops[0].lat, long: json.data.stops[0].lon };
    return to;
}