import {
    BarElement,
    CategoryScale,
    LinearScale,
    BarController,
    Tooltip,
    Chart,
    ChartDataset,
    ChartConfiguration,
    Legend
} from 'chart.js'

import {
    interpolateHslLong
} from 'd3'

const timeFormat = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Berlin',
    hour: 'numeric',
    minute: '2-digit'
})

export function formatTime(unixtime: number) {
    return timeFormat.format(unixtime * 1000)
}

Chart.register(BarElement, CategoryScale, LinearScale, BarController, Tooltip, Legend);

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

function getValue(pollenData: IPollenData): number {
    return pollenData.value
}

function sumValues(measurement: IPollenMeasurement): number {
    return measurement.data.map(getValue).reduce((sum, cur) => {
        return sum + cur
    })
}

const COLOR_SCALE = interpolateHslLong('#E74C3C', '#357DED')

function toChartData(measurement: IPollenMeasurement, index: number, array: IPollenMeasurement[]): ChartDataset<'bar', number[]> {
    return {
        label: measurement.polle,
        data: measurement.data.map(getValue),
        backgroundColor: COLOR_SCALE(index / (array.length - 1))
    }
}

function toLabels(measurement: IPollenMeasurement): string[] {
    return measurement.data.map<string>((data) => {
        return formatTime(data.from) + " - " + formatTime(data.to)
    })
}

export function filterMeasurements(measurements: IPollenMeasurement[]): IPollenMeasurement[] {
    return measurements.filter((measurement) => {
        return measurement.polle !== 'Varia' && sumValues(measurement) > 0
    })
}

export function createChart(chartContext: CanvasRenderingContext2D, measurements: IPollenMeasurement[]) {
    const chartData = measurements.map(toChartData)
    const chartConfig: ChartConfiguration<'bar', number[], string> = {
        type: 'bar',
        data: {
            labels: toLabels(measurements[0]),
            datasets: chartData,
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true
                }
            },
            maintainAspectRatio: false,
        }
    }
    console.log(chartConfig)
    new Chart(chartContext, chartConfig)
}