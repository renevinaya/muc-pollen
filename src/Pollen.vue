<script lang="ts" setup>
import { watch, onMounted, ref, useTemplateRef, nextTick } from 'vue'
import { Chart } from 'chart.js'
import { createChart } from './chart.ts'
import { type language, ui } from './translations.ts'
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
        // LGL measurements unavailable, but forecast is: show forecast only.
        const merged = mergeMeasurements([], forecastData)
        measurements.value = merged
        // Forecast may predict zero pollen across the window -> show the
        // friendly "no pollen" message instead of an empty/blank chart.
        status.value = merged.length > 0 ? 'POLLEN' : 'NO_POLLEN'
    } else {
        // Neither measurements nor forecast available: genuine error state.
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
        <p>{{ ui['noPollen'][language] }}</p>
    </div>
    <div v-else-if="status === 'LOADING'" class="skeleton-block" />
    <div v-else-if="status === 'ERROR'" class="box">
        <p>{{ ui['error'][language] }}</p>
        <p class="has-text-right">
            <a class="button" @click="retryLoad">{{ ui['tryAgain'][language] }}</a>
        </p>
    </div>
    <div v-else-if="status === 'NO_MEASUREMENT'" class="box">
        <p>{{ ui['noMeasurement'][language] }}</p>
    </div>
</template>