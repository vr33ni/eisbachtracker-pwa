<template>
  <div id="app" class="min-h-screen flex items-center justify-center bg-gray-100">
    <h1 class="text-4xl font-bold text-center text-blue-600">
      Eisbach Water Level
    </h1>

    <div class="mt-6">
      <span class="text-xl">{{ waterLevelText }}</span>
    </div>
    
    <div class="mt-4">
      <span class="text-xl">{{ waterFlowText }}</span>
    </div>
    
    <div class="alert mt-6 text-red-600 font-bold" v-show="showWaterLevelAlert">
      🚨 Water level exceeds threshold!
    </div>

    <button @click="checkWaterLevel" class="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
      Check data
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const waterLevelText = ref('Loading...');
const waterFlowText = ref('Loading...');
const showWaterLevelAlert = ref(false);

// API URL for Eisbach River
const apiUrl = 'https://api.pegelalarm.at/api/station/1.0/list?commonid=16515005-de&responseDetailLevel=high';

// Fetch water level and display it
const fetchWaterData = () => {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data && data.payload && data.payload.stations && data.payload.stations.length > 0) {
        const waterLevel = data.payload.stations[0].data[0].value;
        waterLevelText.value = `Current Water Level: ${waterLevel} cm`;
        const waterFlow = data.payload.stations[0].data[1].value;
        waterFlowText.value = `Current Water Flow: ${waterFlow} m³/s`;

        // Show alert if water level is below threshold
        if (waterLevel <= 140) {
          showWaterLevelAlert.value = true;
        } else {
          showWaterLevelAlert.value = false;
        }
      } else {
        console.error("Stations data is missing or undefined");
      }
    })
    .catch((error) => {
      console.error('Error fetching water level data:', error);
    });
};

const checkWaterLevel = () => {
  fetchWaterData();
};

fetchWaterData();
</script>

<style scoped>
.alert {
  font-size: 1.5rem;
}
</style>
