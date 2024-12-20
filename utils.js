import { getBaiduWeather, getDayText } from './api.js'
// 公共方法：获取天气数据
export const fetchWeather = async cityCode => {
  if (!cityCode) return null // 如果没有城市代码，直接返回
  try {
    const weatherData = await getBaiduWeather(cityCode) // 调用API获取天气
    console.log(`获取天气数据成功 for ${cityCode}`)
    return weatherData
  } catch (error) {
    console.error(`获取天气数据出错 for ${cityCode}: `, error)
    return null // 或者根据需求抛出错误
  }
}
// 公共方法：获取每日一言
export const fetchDayText = async () => {
  try {
    const dayText = await getDayText()
    console.log('获取每日一言成功:', dayText)
    return dayText
  } catch (error) {
    console.error('获取每日一言出错: ', error)
    return { data: { content: '获取每日一言失败' } } // 返回默认值
  }
}
