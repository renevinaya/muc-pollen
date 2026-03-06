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

import { type language, translations } from './translations'
import { type IPollenMeasurement } from './pollen'

const timeFormat = new Intl.DateTimeFormat(navigator.language, {
    timeZone: 'Europe/Berlin',
    hour: 'numeric',
    minute: '2-digit'
})

function formatTime(unixtime: number) {
    return timeFormat.format(unixtime * 1000)
}

Chart.register(BarElement, CategoryScale, LinearScale, BarController, Tooltip, Legend);

const COLOR_SCALE = interpolateHslLong('#E74C3C', '#357DED')

function getTranslation(polle: string, language: language): string {
    if (language === 'la') {
        return polle;
    }
    // Fallback to the Latin/scientific name if no translation is found
    const translation = translations[polle];
    return translation ? translation[language] : polle;
}

function toChartData(measurement: IPollenMeasurement, index: number, array: IPollenMeasurement[], language: language): ChartDataset<'bar', number[]> {
    // Guard against division by zero when there's only one measurement
    const colorValue = array.length === 1 ? 0 : index / (array.length - 1);
    return {
        label: getTranslation(measurement.polle, language),
        data: measurement.data.map(p => Math.ceil(p.value)),
        backgroundColor: COLOR_SCALE(colorValue)
    }
}

function toLabels(measurement: IPollenMeasurement): string[] {
    return measurement.data.map<string>((data) => {
        return formatTime(data.from) + " - " + formatTime(data.to)
    })
}

export function createChart(chartContext: CanvasRenderingContext2D, measurements: IPollenMeasurement[], language: language) {
    const chartData = measurements.map((m, i, a) => toChartData(m, i, a, language))
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
    return new Chart(chartContext, chartConfig)
}