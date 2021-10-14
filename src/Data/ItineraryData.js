const url = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql';

export const fetchDuration = async (from, destination) => {
    let duration = -1;
    const to = await fetchStop(destination);
    if (to === undefined) {
        console.log('undefined destination');
        return undefined;
    }
    duration = await fetchItinerary(from, to)
    //console.log('duration', duration);
    return duration;
}

// hakee kauanko kestää kohteesta A kohteeseen B, koordinaatteja käyttäen
export const fetchItinerary = async (from, to) => {
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
        console.error('Failed to fetch itinerary', err);
        return undefined;
    }
    const json = await resp.json();
    for (let i = 0; i < json.data.plan.itineraries[0].legs.length; i++) {
        if (json.data.plan.itineraries[0].legs[i].mode === 'BUS') {
            const duration = json.data.plan.itineraries[0].legs[i].endTime;
            //console.log(json.data.plan.itineraries[0].legs[i]);
            return duration;
        }
    }
}

/**
 * Query end stop id from bus data
 * @param {{route: string, direction: number, date: string, time: number}} data
 * @returns {Promise<string>}
 */
export const fuzzyTripQuery = async (data) => {
    let id;
    const { route, direction, date, time } = data;
    const requestBody = `{
    fuzzyTrip(route: "${route}", direction:${direction}, date: "${date}", time: ${time}) {
        route {
        shortName
        }
        pattern {
        name
        }
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
    if (!json.data.fuzzyTrip) console.log(requestBody);
    //console.log(json.data.fuzzyTrip);
}

// hakee päätepysäkin noin suurinpiirtein graphqlstä topicista tuodulla päätepysäkillä
export const fetchStop = async (destination) => {
    let to;
    const requestBody = `{
        stops(name: "${destination}") {
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
        console.error('Failed to fetch stop data', err);
        return undefined;
    }
    const json = await resp.json();
    /* if (json.data.stops.length < 1) {
        console.log(destination);
    } */
    for (let i = 0; i < json.data.stops.length; i++) {
        if (json.data.stops[i].name === destination) {
            to = { lat: json.data.stops[i].lat, long: json.data.stops[i].lon }
        }
    }
    return to;
}