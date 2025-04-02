<template>
  <div id="app" class="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-b from-blue-100 to-white dark:from-gray-900 dark:to-gray-800 text-center transition-all">

    <h1 class="text-4xl sm:text-5xl font-bold text-blue-600 dark:text-blue-300 mb-8">
      Eisbach Water Level
    </h1>

    <div class="text-2xl text-gray-800 dark:text-gray-200 mb-4">
      {{ waterLevelText }}
    </div>

    <div class="text-xl text-gray-600 dark:text-gray-400 mb-6">
      {{ waterFlowText }}
    </div>

    <div class="alert text-red-600 font-bold mb-6" v-show="showWaterLevelAlert">
      🚨 Water level exceeds threshold!
    </div>

    <button
      @click="checkWaterLevel"
      class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-lg font-semibold shadow-md transition"
    >
      Refresh Data
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const waterLevelText = ref('Loading...');
const waterFlowText = ref('Loading...');
const showWaterLevelAlert = ref(false);

const apiUrl = import.meta.env.VITE_API_URL;

const fetchWaterData = async () => {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data?.payload?.stations?.length > 0) {
      const station = data.payload.stations[0];
      const waterLevel = station.data[0]?.value;
      const waterFlow = station.data[1]?.value;

      waterLevelText.value = `Current Water Level: ${waterLevel} cm`;
      waterFlowText.value = `Current Water Flow: ${waterFlow} m³/s`;

      showWaterLevelAlert.value = waterLevel <= 140;
    } else {
      console.error("Stations data is missing or undefined");
    }
  } catch (error) {
    console.error('Error fetching water level data:', error);
  }
};

const checkWaterLevel = () => {
  fetchWaterData();
};

fetchWaterData();
</script>

<style scoped>
.alert {
  font-size: 1.25rem;
}
</style>
