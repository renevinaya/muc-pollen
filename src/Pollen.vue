<template>
    <div v-if="status == 'POLLEN'" class="box">
        <div style="height: 500px">
            <canvas id="chartCanvas" ref="chartCanvas" />
        </div>
    </div>
    <div v-else-if="status == 'NO_POLLEN'" class="box">
        Currently no pollen in Munich!
    </div>
    <div v-else-if="status == 'LOADING'" class="skeleton-block" />
</template>

<script lang="ts" setup>
import { onUpdated, onMounted, ref, Ref } from 'vue'
import { IPollenResponse, IPollenMeasurement, filterMeasurements, createChart } from './chart.ts'

const status: Ref<'LOADING' | 'POLLEN' | 'NO_POLLEN'> = ref('LOADING')
const measurements = ref<Array<IPollenMeasurement>>([])
const chartCanvas = ref<HTMLCanvasElement>()

const now = (new Date().getTime() / 1000)

const param = {
    // Pollen are measured every 3h. Plus 2h delay, we request 29h of the past to get a whole day
    from: (now - (29 * 60 * 60)).toFixed(),
    to: now.toFixed(),
    locations: 'DEMUNC'
}
const url = 'https://d1ppjuhp1nvtc2.cloudfront.net/measurements?' + new URLSearchParams(param).toString()
onMounted(async () => {
    const response = (await (await fetch(url)).json()) as IPollenResponse
    measurements.value = filterMeasurements(response.measurements)
    status.value = measurements.value.length > 0 ? 'POLLEN' : 'NO_POLLEN'
})

onUpdated(() => {
    const chartContext = (document.getElementById('chartCanvas') as HTMLCanvasElement)?.getContext('2d')
    if (chartContext) {
        createChart(chartContext, measurements.value)
    }
})
</script>