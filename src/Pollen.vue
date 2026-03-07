<script lang="ts" setup>
import { watch, onMounted, ref, useTemplateRef, nextTick } from 'vue'
import { Chart } from 'chart.js'
import { createChart } from './chart.ts'
import { type language } from './translations.ts'
import { loadPollen, loadForecast, mergeMeasurements, type IPollenMeasurement } from './pollen.ts';

const props = defineProps<{
    language: language,
}>()

const status = ref<'LOADING' | 'POLLEN' | 'NO_POLLEN' | 'ERROR' | 'NO_MEASUREMENT'>('LOADING')
const measurements = ref<Array<IPollenMeasurement>>([])
const chartCanvas = useTemplateRef('chartCanvas')

let chart: Chart | null = null

const retryLoad = async () => {
    status.value = 'LOADING'

    const [pollenResult, forecastData] = await Promise.all([
        loadPollen(),
        loadForecast(),
    ])

    const [pollenData, pollenStatus] = pollenResult

    if (pollenStatus === 'POLLEN' && pollenData) {
        measurements.value = mergeMeasurements(pollenData, forecastData)
        status.value = 'POLLEN'
    } else if (forecastData.length > 0) {
        // No real measurements, but forecast is available
        measurements.value = mergeMeasurements([], forecastData)
        status.value = 'POLLEN'
    } else {
        status.value = pollenStatus
    }
}

onMounted(async () => {
    await retryLoad()
})

watch([measurements, () => props.language, status], async () => {
    if (status.value !== 'POLLEN' || measurements.value.length === 0) {
        return
    }
    await nextTick()
    const chartContext = chartCanvas.value?.getContext('2d')
    if (chartContext) {
        if(chart) {
            chart.destroy()
        }
        chart = createChart(chartContext, measurements.value, props.language)
    }
})
</script>

<template>
    <div v-if="status === 'POLLEN'" class="box">
        <div style="height: 500px">
            <canvas id="chartCanvas" ref="chartCanvas" />
        </div>
    </div>
    <div v-else-if="status === 'NO_POLLEN'" class="box">
        <p>Currently no pollen in Munich!</p>
    </div>
    <div v-else-if="status === 'LOADING'" class="skeleton-block" />
    <div v-else-if="status === 'ERROR'" class="box">
        <p>An error occurred!</p>
        <p class="has-text-right">
            <a class="button" @click="retryLoad">Try again</a>
        </p>
    </div>
    <div v-else-if="status === 'NO_MEASUREMENT'" class="box">
        <p>Pollen measurement currently not available</p>
    </div>
</template>