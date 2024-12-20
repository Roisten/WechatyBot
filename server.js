import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import fetch from 'node-fetch'
import cors from 'cors'
const app = express()
const port = process.env.PORT || 7890

app.use(cors())

app.get('/weather/:cityCode', async (req, res) => {
  const { cityCode } = req.params
  const apiKey = process.env.BAIDU_API_KEY
  const url = `https://api.map.baidu.com/weather/v1/?district_id=${cityCode}&data_type=all&ak=${apiKey}`
  try {
    const response = await fetch(url)
    const data = await response.json()
    res.json(data)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'An error occurred while fetching weather data' })
  }
})
app.get('/yiyanInfo', async (req, res) => {
  const url = 'https://api.codelife.cc/yiyan/info'
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
        Accept: 'application/json'
      }
    })
    const data = await response.json()
    res.json(data)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'An error occurred while fetching weather data' })
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
