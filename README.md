# Pollen in Munich

A web app that displays current pollen levels and forecasts for Munich as an interactive bar chart. Supports German, English, Japanese, and Latin.

## Features

- Live pollen measurements from the last 16 hours (3-hour resolution)
- Pollen forecast for the next 12 hours (shown as striped bars)
- Stacked bar chart with per-species breakdown
- Language switcher (DE / EN / JA / LA)

## Tech Stack

- [Vue 3](https://vuejs.org/) + TypeScript
- [Chart.js](https://www.chartjs.org/) for charting
- [D3](https://d3js.org/) for color interpolation
- [Bulma](https://bulma.io/) for styling
- [Vite](https://vitejs.dev/) for build tooling

## Data Sources

- [LGL Bayern](https://epin.lgl.bayern.de/) — real-time pollen measurements for Munich
- [muc-pollen-forecast](../muc-pollen-forecast) — ML-based pollen forecast generated from [PollenScience](https://pollenscience.eu), [Open-Meteo](https://open-meteo.com/), [DWD](https://www.dwd.de/), and [NASA ORNL DAAC (MODIS)](https://modis.ornl.gov/) data

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output is written to `dist/`.