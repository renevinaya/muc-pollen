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

const localeMap: Record<language, string> = {
    'de': 'de-DE',
    'en': 'en-GB',
    'ja': 'ja-JP',
    'la': 'la',
}

function getShortDateFormat(lang: language) {
    return new Intl.DateTimeFormat(localeMap[lang], {
        timeZone: 'Europe/Berlin',
        weekday: 'short',
    })
}

function formatTime(unixtime: number) {
    return timeFormat.format(unixtime * 1000)
}

Chart.register(BarElement, CategoryScale, LinearScale, BarController, Tooltip, Legend);

const COLOR_SCALE = interpolateHslLong('#E74C3C', '#357DED')

function createStripePattern(ctx: CanvasRenderingContext2D, color: string): CanvasPattern {
    const size = 10
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const pCtx = canvas.getContext('2d')!
    // Light background
    pCtx.fillStyle = color
    pCtx.globalAlpha = 0.25
    pCtx.fillRect(0, 0, size, size)
    // Diagonal stripes
    pCtx.globalAlpha = 0.7
    pCtx.strokeStyle = color
    pCtx.lineWidth = 2.5
    pCtx.beginPath()
    pCtx.moveTo(-1, size + 1)
    pCtx.lineTo(size + 1, -1)
    pCtx.stroke()
    pCtx.beginPath()
    pCtx.moveTo(-1 - size, size + 1)
    pCtx.lineTo(size + 1 - size, -1)
    pCtx.stroke()
    pCtx.beginPath()
    pCtx.moveTo(-1 + size, size + 1)
    pCtx.lineTo(size + 1 + size, -1)
    pCtx.stroke()
    return ctx.createPattern(canvas, 'repeat')!
}

function getTranslation(polle: string, language: language): string {
    if (language === 'la') {
        return polle;
    }
    // Fallback to the Latin/scientific name if no translation is found
    const translation = translations[polle];
    return translation ? translation[language] : polle;
}

function toChartData(
    chartContext: CanvasRenderingContext2D,
    measurement: IPollenMeasurement,
    index: number,
    array: IPollenMeasurement[],
    language: language
): ChartDataset<'bar', number[]> {
    // Guard against division by zero when there's only one measurement
    const colorValue = array.length === 1 ? 0 : index / (array.length - 1);
    const solidColor = COLOR_SCALE(colorValue)
    const pattern = createStripePattern(chartContext, solidColor)

    return {
        label: getTranslation(measurement.polle, language),
        data: measurement.data.map(p => Math.ceil(p.value)),
        backgroundColor: measurement.data.map(p =>
            p.isForecast ? pattern : solidColor
        ),
    }
}

function toLabels(measurement: IPollenMeasurement, language: language): string[] {
    // Check if data spans multiple calendar days
    const days = new Set(
        measurement.data.map(d =>
            new Date(d.from * 1000).toLocaleDateString('en', { timeZone: 'Europe/Berlin' })
        )
    )
    const multiDay = days.size > 1
    const dateFormat = getShortDateFormat(language)

    return measurement.data.map<string>((data) => {
        const time = formatTime(data.from) + " - " + formatTime(data.to)
        if (multiDay) {
            return dateFormat.format(data.from * 1000) + '\n' + time
        }
        return time
    })
}

export function createChart(chartContext: CanvasRenderingContext2D, measurements: IPollenMeasurement[], language: language) {
    const chartData = measurements.map((m, i, a) => toChartData(chartContext, m, i, a, language))
    const chartConfig: ChartConfiguration<'bar', number[], string> = {
        type: 'bar',
        data: {
            labels: toLabels(measurements[0], language),
            datasets: chartData,
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                    ticks: {
                        callback: (value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const label = context.dataset.label || '';
                            const value = String(context.parsed.y).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
                            return label + ': ' + value;
                        }
                    }
                }
            },
            maintainAspectRatio: false,
        }
    }
    return new Chart(chartContext, chartConfig)
}