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

<script lang="ts" setup>
import { onUpdated, onMounted, ref, Ref } from 'vue'
import { IPollenResponse, IPollenMeasurement, filterMeasurements, createChart } from './chart.ts'

const status: Ref<'LOADING' | 'POLLEN' | 'NO_POLLEN' | 'ERROR' | 'NO_MEASUREMENT'> = ref('LOADING')
const measurements = ref<Array<IPollenMeasurement>>([])
const chartCanvas = ref<HTMLCanvasElement>()

const now = (new Date().getTime() / 1000) // seconds

const roundTime = (exact: number) => {
    // Rounds time down to last 15 minutes, so Cloudfront can cache the result
    const quarter_hour = 15 * 60
    return (Math.floor(exact / quarter_hour) * quarter_hour).toFixed()
}

const param = {
    // Pollen are measured every 3h. Plus 2h delay, we request 29h of the past to get a whole day
    from: roundTime(now - (29 * 60 * 60)),
    to: roundTime(now),
    locations: 'DEMUNC'
}
const url = 'https://d1ppjuhp1nvtc2.cloudfront.net/measurements?' + new URLSearchParams(param).toString()
const loadPollen = async () => {
    status.value = 'LOADING'
    try {
        const response = (await (await fetch(url)).json()) as IPollenResponse;
        if (response.measurements.length == 0) {
            status.value = 'NO_MEASUREMENT'
            return
        }
        measurements.value = filterMeasurements(response.measurements);
        status.value = measurements.value.length > 0 ? 'POLLEN' : 'NO_POLLEN';
    } catch (error) {
        console.log(error);
        status.value = 'ERROR';
    }
};
onMounted(loadPollen)

onUpdated(() => {
    const chartContext = (document.getElementById('chartCanvas') as HTMLCanvasElement)?.getContext('2d')
    if (chartContext) {
        createChart(chartContext, measurements.value)
    }
})
</script>
