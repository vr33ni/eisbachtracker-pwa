<template>
  <div id="app"
    class="min-h-screen bg-gradient-to-b from-blue-100 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-10">
    <div class="w-full max-w-md text-center space-y-8">

      <!-- Title -->
      <h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-blue-600 dark:text-blue-300">
        Eisbach Tracker
      </h1>

      <!-- Water Data -->
      <div class="space-y-2">
        <p class="text-xl text-gray-700 dark:text-gray-300">
          {{ waterLevelText }}
        </p>
        <p class="text-lg text-gray-700 dark:text-gray-300">
          {{ waterFlowText }}
        </p>
        <!-- Underneath water flow -->
        <div v-if="dailyAvg" class="mt-8 text-gray-700 dark:text-gray-300 text-sm">
          <p>🌡️ Water Temp Avg: <strong>{{ dailyAvg }}</strong></p>
          <p>⬆️ Max: <strong>{{ dailyMax }}</strong> · ⬇️ Min: <strong>{{ dailyMin }}</strong></p>
        </div>

      </div>

      <!-- Alert -->
      <div v-if="showWaterLevelAlert" class="text-red-600 font-semibold text-base">
        🚨 Water level exceeds threshold!
      </div>

      <!-- Button -->
      <button @click="checkWaterLevel"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-medium shadow transition-all">
        Refresh Data
      </button>
    </div>
    <WaterChart :labels="chartLabels" :values="chartValues" />
  </div>
</template>



<script setup lang="ts">
import { ref, onMounted } from 'vue'
import WaterChart from './components/WaterChart.vue'
import { useDailyWaterTemperature } from '@/composables/useWaterTemperatureData';
const { dailyAvg, dailyMax, dailyMin } = useDailyWaterTemperature()


const chartLabels = ref<string[]>([])
const chartValues = ref<number[]>([])

const waterLevelText = ref('Loading...')
const waterFlowText = ref('Loading...')
const showWaterLevelAlert = ref(false)

const apiUrl = import.meta.env.VITE_API_URL

const notifyUser = (waterLevel: number) => {
  if ("Notification" in window) {
    if (Notification.permission === "granted") {
      new Notification("🌊 Eisbach Alert", {
        body: `Water level is currently ${waterLevel}cm — longboard only 🏄‍♀️`,
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("🌊 Eisbach Alert", {
            body: `Water level is currently ${waterLevel}cm — longboard only 🏄‍♀️`,
          });
        }
      });
    }
  }
};


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

      if (waterLevel <= 140) {
        showWaterLevelAlert.value = true
        notifyUser(waterLevel)
      } else {
        showWaterLevelAlert.value = false
      }

      // ✅ Push to chart data
      chartLabels.value.push(new Date().toLocaleTimeString())
      chartValues.value.push(waterLevel)

      // ✅ Optional: Keep it short
      if (chartLabels.value.length > 10) chartLabels.value.shift()
      if (chartValues.value.length > 10) chartValues.value.shift()

      console.log("Labels:", chartLabels.value)
      console.log("Values:", chartValues.value)

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
