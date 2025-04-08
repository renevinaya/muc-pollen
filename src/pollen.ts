export interface IPollenData {
    from: number,
    to: number,
    value: number
}

export interface IPollenMeasurement {
    polle: string,
    location: string,
    data: IPollenData[]
}

export interface IPollenResponse {
    from: number,
    to: number,
    measurements: IPollenMeasurement[]
}

const roundTime = (exact: number) => {
    // Rounds time down to last 15 minutes, so Cloudfront can cache the result
    const quarter_hour = 15 * 60
    return (Math.floor(exact / quarter_hour) * quarter_hour).toFixed()
}

const NOW = (new Date().getTime() / 1000) // seconds
const PARAM = {
    // Pollen are measured every 3h. Plus 2h delay, we request 29h of the past to get a whole day
    from: roundTime(NOW - (29 * 60 * 60)),
    to: roundTime(NOW),
    locations: 'DEMUNC'
}
const URL = 'https://d1ppjuhp1nvtc2.cloudfront.net/measurements?' + new URLSearchParams(PARAM).toString()

type success = [IPollenMeasurement[], 'POLLEN']
type failure = [undefined, 'NO_MEASUREMENT' | 'NO_POLLEN' | 'ERROR']

export async function loadPollen(): Promise<success | failure> {
    try {
        const response = (await (await fetch(URL)).json()) as IPollenResponse;
        if (response.measurements.length == 0) {
            return [undefined, 'NO_MEASUREMENT']
        }
        const measurements = filterMeasurements(response.measurements);
        if(measurements.length == 0) {
            return [undefined, 'NO_POLLEN']
        }
        return [measurements, 'POLLEN']
    } catch (error) {
        console.error(error);
        return [undefined, 'ERROR']
    }
}

export function filterMeasurements(measurements: IPollenMeasurement[]): IPollenMeasurement[] {
    return measurements.filter((measurement) => {
        return measurement.polle !== 'Varia' && sumValues(measurement) > 0
    })
}

function sumValues(measurement: IPollenMeasurement): number {
    return measurement.data.map(p => p.value).reduce((sum, cur) => {
        return sum + cur
    })
}
