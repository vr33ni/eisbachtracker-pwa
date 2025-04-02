<template>
  <div
    id="app"
    class="min-h-screen bg-gradient-to-b from-blue-100 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-10"
  >
    <div class="w-full max-w-md text-center space-y-8">

      <!-- Title -->
      <h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-blue-600 dark:text-blue-300">
        Eisbach Tracker
      </h1>

      <!-- Water Data -->
      <div class="space-y-2">
        <p class="text-xl text-gray-800 dark:text-gray-200">
          {{ waterLevelText }}
        </p>
        <p class="text-lg text-gray-700 dark:text-gray-300">
          {{ waterFlowText }}
        </p>
      </div>

      <!-- Alert -->
      <div v-if="showWaterLevelAlert" class="text-red-600 font-semibold text-base">
        🚨 Water level exceeds threshold!
      </div>

      <!-- Button -->
      <button
        @click="checkWaterLevel"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-medium shadow transition-all"
      >
        Refresh Data
      </button>
    </div>
  </div>
</template>



<script setup lang="ts">
import { ref } from 'vue'

const waterLevelText = ref('Loading...')
const waterFlowText = ref('Loading...')
const showWaterLevelAlert = ref(false)

const apiUrl = import.meta.env.VITE_API_URL

const fetchWaterData = async () => {
  try {
    const response = await fetch(apiUrl)
    const data = await response.json()

    if (data?.payload?.stations?.length > 0) {
      const station = data.payload.stations[0]
      const waterLevel = station.data[0]?.value
      const waterFlow = station.data[1]?.value

      waterLevelText.value = `Current Water Level: ${waterLevel} cm`
      waterFlowText.value = `Current Water Flow: ${waterFlow} m³/s`

      showWaterLevelAlert.value = waterLevel <= 140
    } else {
      console.error('Stations data is missing or undefined')
    }
  } catch (error) {
    console.error('Error fetching water level data:', error)
  }
}

const checkWaterLevel = () => {
  fetchWaterData()
}

fetchWaterData()
</script>

<style scoped>
.alert {
  font-size: 1.25rem;
}

html,
body,
#app {
  height: 100%;
  margin: 0;
}
</style>
