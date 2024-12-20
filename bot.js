import config from './config.js'
import { fetchWeather, fetchDayText } from './utils.js'
import OpenAI from 'openai'
const client = new OpenAI({
  apiKey: config.KIMI_API_KEY, // 在这里将 MOONSHOT_API_KEY 替换为你从 Kimi 开放平台申请的 API Key
  baseURL: config.kimiApiBaseUrl
})
const onMessage = async message => {
  const contact = message.talker() // 发消息人// 获取发送消息的联系人
  const text = message.text() // 消息内容
  const room = message.room() // 是否是群消息，若是，则为 Room 对象
  console.log(`收到来自 ${contact.name()}: ${text}`)
  if (config.userInfo.map(item => item.name).includes(contact.name()) && !room) {
    if (text === '每日一言') {
      const dayText = await fetchDayText()
      await contact.say(`每日一言：${dayText.data.content}`)
    } else {
      let reply = await chat(text)
      await contact.say(reply)
    }
  }
}
const systemMessages = [
  {
    role: 'system',
    content:
      '你是 Kimi，由 Moonshot AI 提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全，有帮助，准确的回答。同时，你会拒绝一切涉及恐怖主义，种族歧视，黄色暴力等问题的回答。Moonshot AI 为专有名词，不可翻译成其他语言。'
  }
]
let messages = []
async function makeMessages(input, n = 20) {
  messages.push({
    role: 'user',
    content: input
  })
  let newMessages = []
  newMessages = systemMessages.concat(newMessages)
  // 在这里，当历史消息超过 n 条时，我们仅保留最新的 n 条消息
  if (messages.length > n) {
    messages = messages.slice(-n)
  }

  newMessages = newMessages.concat(messages)
  return newMessages
}
// 处理收到的消息
async function chat(input) {
  const completion = await client.chat.completions.create({
    model: 'moonshot-v1-8k',
    messages: await makeMessages(input),
    temperature: 0.3
  })
  const assistantMessage = completion.choices[0].message
  messages.push(assistantMessage)
  return assistantMessage.content
}

export { onMessage }
