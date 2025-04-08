<script lang="ts" setup>
import { onUpdated, onMounted, ref, Ref, useTemplateRef } from 'vue'
import { Chart } from 'chart.js'
import { createChart } from './chart.ts'
import { type language } from './translations.ts'
import { loadPollen, type IPollenMeasurement } from './pollen.ts';

const props = defineProps<{
    language: language,
}>()

const status: Ref<'LOADING' | 'POLLEN' | 'NO_POLLEN' | 'ERROR' | 'NO_MEASUREMENT'> = ref('LOADING')
const measurements = ref<Array<IPollenMeasurement>>([])
const chartCanvas = useTemplateRef('chartCanvas')

let chart: Chart | null = null

onMounted(async () => {
    status.value = 'LOADING'
    const [data, statusV] = await loadPollen()
    if (statusV == 'POLLEN') {
        measurements.value = data
    }
    status.value = statusV
})

onUpdated(() => {
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
    <div v-if="status == 'POLLEN'" class="box">
        <div style="height: 500px">
            <canvas id="chartCanvas" ref="chartCanvas" />
        </div>
    </div>
    <div v-else-if="status == 'NO_POLLEN'" class="box">
        <p>Currently no pollen in Munich!</p>
    </div>
    <div v-else-if="status == 'LOADING'" class="skeleton-block" />
    <div v-else-if="status == 'ERROR'" class="box">
        <p>An error occured!</p>
        <p class="has-text-right">
            <a class="button" @click="loadPollen">Try again</a>
        </p>
    </div>
    <div v-else-if="status == 'NO_MEASUREMENT'" class="box">
        <p>Pollen measurement currently not available</p>
    </div>
</template>