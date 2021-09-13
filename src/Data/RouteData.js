export const fetchBusRoutes = async () => {
  const url = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql';
  const requestBody = '{routes(name: "10" transportModes: BUS) { gtfsId shortName longName mode }}';
  const req = {
    method: 'POST',
    headers: { "Content-Type": "application/graphql" },
    body: requestBody
  }
  const resp = await fetch(url, req);
  const json = await resp.json();
  return json.data;
}