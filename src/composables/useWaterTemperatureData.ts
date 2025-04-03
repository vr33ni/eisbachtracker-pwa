import { ref, onMounted } from 'vue'

export function useDailyWaterTemperature() {
  const dailyAvg = ref<string | null>(null)
  const dailyMax = ref<string | null>(null)
  const dailyMin = ref<string | null>(null)

  const parseGermanFloat = (str: string) => {
    return parseFloat(str.replace(' ', '.'))
  }

  const loadDailyTemps = async () => {
    try {
      const response = await fetch('/eisbachtracker-pwa/data/16515005_tmw_daily.csv') // or whatever the path is
      const text = await response.text()
      const lines = text.trim().split('\n')

      // Find the header row and the data row
      const dataRow = lines.find(line => /^\d{4}-\d{2}-\d{2}/.test(line))
      if (!dataRow) throw new Error('No daily data row found')

      const fields = dataRow.split(';')
      dailyAvg.value = parseGermanFloat(fields[1]) + ' °C'
      dailyMax.value = parseGermanFloat(fields[2]) + ' °C'
      dailyMin.value = parseGermanFloat(fields[3]) + ' °C'
    } catch (err) {
      console.error('Failed to load daily temp data', err)
    }
  }

  onMounted(loadDailyTemps)

  return {
    dailyAvg,
    dailyMax,
    dailyMin,
  }
}
