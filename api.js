// 天气接口
export async function getBaiduWeather(city) {
  const url = `http://localhost:7890/weather/${city}`
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Could not fetch weather data:', error)
    return null
  }
}
//每日一言
export async function getDayText() {
  const url = 'http://localhost:7890/yiyanInfo'
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Could not fetch weather data:', error)
    return null
  }
}
