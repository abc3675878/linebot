import linebot from 'linebot'
import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
})

bot.on('message', async function (event) {
  try {
    const response = await axios.get(
      'http://cloud.culture.tw/frontsite/trans/emapOpenDataAction.do?method=exportEmapJson&typeId=H'
    )
    const text = event.message.text
    let reply = ''

    for (let data of response.data) {
      // if (data.name === text) {
      //   event.reply(['門票: ' + data.ticketPrice, data.address, '電話: ' + data.phone, '官網: ' + data.srcWebsite])
      //   break
      // }
      if (data.name === text) {
        event.reply([
          '門票資訊: ' + data.ticketPrice,
          '電話: ' + data.phone,
          '官網: ' + data.srcWebsite,
          {
            type: 'location',
            title: data.name,
            address: data.address,
            latitude: data.latitude,
            longitude: data.longitude,
          },
        ])
        break
      }
    }
    reply = reply.length === 0 ? '找不到資料，請輸入完整名稱' : reply
    event.reply(reply)
  } catch (error) {
    event.reply('發生錯誤')
  }
})

//! 監聽 env PORT
bot.listen('/', process.env.PORT, () => {
  console.log('機器人已啟動')
})
