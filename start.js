import { WechatyBuilder } from "wechaty";
import { onMessage } from "./bot.js";
import { fetchWeather, fetchDayText } from "./utils.js";
import schedule from "node-schedule";
import Config from "./config.js";
const wechaty = WechatyBuilder.build(); // get a Wechaty instance
// 联系人推送
const userInfo = Config.userInfo;
// 晚安语录
const nightList = Config.nightList;
// 发送消息给联系人
const sendMessageToContact = async (contactName, weatherData, dayText) => {
  const contact = await wechaty.Contact.find({ name: contactName });
  if (!contact) {
    console.log(`未找到联系人: ${contactName}`);
    return;
  }
  let messageText;
  if (weatherData && weatherData.status === 0) {
    messageText = `早上好 ${contactName} 😘\n当前位置：${weatherData.result["location"]["name"]}\n今天是 ${new Date().toLocaleDateString()}\n天气：${
      weatherData.result.now.text
    }\n温度：${weatherData.result.now.temp} (℃)\n体感温度：${weatherData.result.now.feels_like} (℃)\n相对湿度：${
      weatherData.result.now.rh
    } (%)\n风力等级：${weatherData.result.now.wind_class}\n风向描述：${weatherData.result.now.wind_dir}`;
  } else {
    messageText = "天气查询出错";
  }
  await contact.say(messageText); // 发送天气信息
  await contact.say(`每日一言：${dayText.data.content}`); // 发送每日一言
  console.log(`定时推送消息到 ${contact.name()}: ${messageText}`);
};
// 早安定时推送
const sendScheduledMessages = async () => {
  const dayText = await fetchDayText(); // 获取每日一言
  const promises = userInfo.map(async (user) => {
    const { name, city } = user;
    const weatherData = await fetchWeather(city); // 获取天气数据
    await sendMessageToContact(name, weatherData, dayText); // 发送消息
  });
  try {
    await Promise.all(promises); // 并行发送消息
    console.log("所有早安消息推送完成");
  } catch (error) {
    console.error("早安推送消息时发生错误", error);
  }
};
// 晚安定时推送
const sendNightMessages = async () => {
  const promises = userInfo.map(async (user) => {
    const contact = await wechaty.Contact.find({ name: user.name });
    if (!contact) {
      console.log(`未找到联系人: ${user.name}`);
      return;
    }
    await contact.say(`当前时间：${new Date().toLocaleString()}\n${nightList[Math.floor(Math.random() * nightList.length)]}`);
  });
  try {
    await Promise.all(promises); // 并行发送消息
    console.log("所有晚安消息推送完成");
  } catch (error) {
    console.error("晚安推送消息时发生错误", error);
  }
};

wechaty
  .on("scan", (qrcode, status) => console.log(`Scan QR Code to login: ${status}\nhttps://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`))
  .on("login", (user) => console.log(`User ${user} logged in`))
  .on("message", onMessage)
  // .on("room-leave", roomLeave)
  .on("ready", () => {
    // pollRoomMembers('Auto Plugin')
    // 设置定时任务，每天上午7:30执行
    schedule.scheduleJob("30 7 * * *", function () {
      sendScheduledMessages();
    });
    schedule.scheduleJob("50 22 * * *", function () {
      sendNightMessages();
    });
  });
wechaty.start();
