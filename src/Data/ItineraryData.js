const url = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql';

export const fetchDuration = async (from, id) => {
    let duration = -1;
    const to = await fetchStop(id);
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
    //console.log(json.data);
    if (json.data.plan === null) {
        return undefined
    }
    let duration;
    for (let i = 0; i < json.data.plan.itineraries[0].legs.length; i++) {
        if (json.data.plan.itineraries[0].legs[i].mode === 'BUS') {
            duration = json.data.plan.itineraries[0].legs[i].endTime;
            //console.log(json.data.plan.itineraries[0].legs[i]);
        }
    }
    return duration;
}

/**
 * Query end stop id from bus data
 * @param {{route: string, direction: number, date: string, time: number}} data
 * @returns {Promise<string>}
 */
export const fuzzyTripQuery = async (data) => {
    if (data === undefined) console.log('data undefined at fuzzyTripQuery');
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
    if (!json.data.fuzzyTrip) {
        console.log(requestBody);
        return undefined
    };
    const idIndex = json.data.fuzzyTrip.pattern.name.indexOf('HSL')
    const hslId = json.data.fuzzyTrip.pattern.name.substring(idIndex, idIndex + 11)
    return hslId
    //console.log(hslId);

}

export const fetchEndStopId = async (name) => {
    const requestBody = `{
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
            return route.gtfsId
        }
    }
    console.log(name);
    return undefined
}

// hakee päätepysäkin noin suurinpiirtein graphqlstä topicista tuodulla päätepysäkillä
export const fetchStop = async (id) => {
    if (id === undefined) console.log('id undefined at fetchStop');
    let to;
    const requestBody = `{
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
        console.error('Failed to fetch stop data', err);
        return undefined;
    }
    const json = await resp.json();

    //console.log(json.data);
    if (json.data.stops === null) {
        return undefined
    }
    to = { lat: json.data.stops[0].lat, long: json.data.stops[0].lon }


    return to;
}