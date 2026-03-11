export interface IPollenData {
    from: number,
    to: number,
    value: number,
    isForecast?: boolean
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

interface IForecastResponse {
    generated: string,
    location: string,
    measurements: IPollenMeasurement[]
}

const FORECAST_URL = 'https://d1jw9x27ug54c1.cloudfront.net/forecast.json'

const roundTime = (exact: number) => {
    // Rounds time down to last 15 minutes, which makes the request more reliable, since measurements are taken every 3h with a delay of 2h. So we want to make sure to only request measurements that are already available.
    const quarter_hour = 15 * 60
    return (Math.floor(exact / quarter_hour) * quarter_hour).toFixed()
}

type success = [IPollenMeasurement[], 'POLLEN']
type failure = [undefined, 'NO_MEASUREMENT' | 'NO_POLLEN' | 'ERROR']

export async function loadPollen(): Promise<success | failure> {
    try {
        const NOW = (new Date().getTime() / 1000) // seconds
        const PARAM = {
            // Pollen are measured every 3h. Plus 2h delay, we request 21h of the past to get a whole day
            from: roundTime(NOW - (21 * 60 * 60)),
            to: roundTime(NOW),
            locations: 'DEMUNC'
        }
        const API_URL = 'https://d1ppjuhp1nvtc2.cloudfront.net/measurements?' + new URLSearchParams(PARAM).toString()
        
        const response = (await (await fetch(API_URL)).json()) as IPollenResponse;
        if (response.measurements.length === 0) {
            return [undefined, 'NO_MEASUREMENT']
        }
        const measurements = filterMeasurements(response.measurements);
        if (measurements.length === 0) {
            return [undefined, 'NO_POLLEN']
        }
        return [measurements, 'POLLEN']
    } catch (error) {
        console.error(error);
        return [undefined, 'ERROR']
    }
}

export async function loadForecast(): Promise<IPollenMeasurement[]> {
    try {
        const response = await fetch(FORECAST_URL)
        const data = (await response.json()) as IForecastResponse
        const nowSeconds = Date.now() / 1000
        const twelveHoursAgo = nowSeconds - 12 * 60 * 60
        const twelveHoursLater = nowSeconds + 12 * 60 * 60
        return data.measurements
            .map(m => ({
                ...m,
                data: m.data
                    .filter(d => d.from >= twelveHoursAgo && d.from < twelveHoursLater)
                    .map(d => ({ ...d, isForecast: true }))
            }))
            .filter(m => m.data.length > 0)
    } catch (error) {
        console.error('Failed to load forecast:', error)
        return []
    }
}

/**
 * Merge real measurements with forecast data.
 * Real measurements prevail for overlapping time windows.
 * All species get data for every time window (zero-filled where missing).
 */
export function mergeMeasurements(
    measured: IPollenMeasurement[],
    forecast: IPollenMeasurement[]
): IPollenMeasurement[] {
    // Collect all unique time windows from both sources
    const allWindows = new Map<number, { from: number, to: number }>()
    for (const m of [...measured, ...forecast]) {
        for (const d of m.data) {
            allWindows.set(d.from, { from: d.from, to: d.to })
        }
    }
    const sortedWindows = Array.from(allWindows.values()).sort((a, b) => a.from - b.from)

    // Build per-species window maps; real measurements overwrite forecast
    const speciesMap = new Map<string, Map<number, IPollenData>>()

    for (const fm of forecast) {
        const windowMap = new Map<number, IPollenData>()
        for (const d of fm.data) {
            windowMap.set(d.from, { ...d, isForecast: true })
        }
        speciesMap.set(fm.polle, windowMap)
    }

    for (const rm of measured) {
        if (!speciesMap.has(rm.polle)) {
            speciesMap.set(rm.polle, new Map())
        }
        const windowMap = speciesMap.get(rm.polle)!
        for (const d of rm.data) {
            windowMap.set(d.from, { ...d, isForecast: false })
        }
    }

    // Build result with all species having data for every window
    const result: IPollenMeasurement[] = []
    for (const [polle, windowMap] of speciesMap) {
        const data: IPollenData[] = sortedWindows.map(w => {
            const existing = windowMap.get(w.from)
            return existing || { from: w.from, to: w.to, value: 0, isForecast: false }
        })
        if (data.some(d => d.value > 0)) {
            result.push({ polle, location: 'DEMUNC', data })
        }
    }
    return result
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
