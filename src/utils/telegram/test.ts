import getBotInstance from './botInstance'

// 获取 Telegram Bot 实例
const bot = getBotInstance('7375019076:AAHpC2tANTtwjeOsiiqAEyAKJehyKfWIPWM')

// 存储用户首次交互时间的对象
const userInteractions: { [key: string]: string } = {}

bot.on('message', async (msg: any) => {
  try {
    const chatId = msg.chat.id
    const userId = msg.from?.id.toString()
    const userLanguage_code = msg.from?.language_code.toString() || 'en'
    const messageText = msg.text
    console.log(msg, 'msg')
    let replyContent: any = {}
    // // replyContent.caption = 'test'
    // replyContent.message = 'test'
    replyContent.mediaGroup = [
      //   {
      //     url: 'https://cdn.discordapp.com/attachments/1261273457337831538/1273564183233036320/image.png?ex=66bf1292&is=66bdc112&hm=86202ee4b77aa093ab91645e36b29ca476c16f1b5b18682a5946542ee24bbfd7&',
      //     // caption: 'First photo test',
      //     type: 'photo',
      //   },
      {
        url: 'https://cdn.discordapp.com/attachments/1261273457337831538/1273564183233036320/image.png?ex=66bf1292&is=66bdc112&hm=86202ee4b77aa093ab91645e36b29ca476c16f1b5b18682a5946542ee24bbfd7&',
        caption: '11',
        type: 'photo',
      },
      //   {
      //     url: 'https://cdn.discordapp.com/attachments/1261273457337831538/1273568795172012063/55636_1723703075.mp4?ex=66bf16de&is=66bdc55e&hm=c97a9700bc64a517a92faaaa5a4fc18de844dab9f9e01462bff4400b001b89cd&',
      //     // caption: '',
      //     type: 'video',
      //   },
    ]

    const test = sendMediaGroup('@Dexcc_App', replyContent)
    // const test = sendTextMessage('@Dexcc_App', replyContent)
    // const test = sendMediaGroup('@Dexcc_App', replyContent)

    // await processMessages(chatId, replyTrigger)
  } catch (error) {
    console.error(`Error message on`, error)
  }
})

// 处理内联按钮点击事件
bot.on('callback_query', async (callbackQuery: any) => {
  const message: any = callbackQuery.message
  const messageId = message.message_id
  const data = callbackQuery.data
  const chatId = message.chat.id
  const userId = callbackQuery.from?.id.toString()
  try {
    // await processMessages(chatId, )
  } catch (error) {
    console.error(`Error callback_query `, error)
  }
})

// 发送带有文字的消息
async function sendTextMessage(chatId: number | string, replyContent: any) {
  try {
    await bot.sendMessage(chatId, replyContent.message || '收到您的消息！')
    console.log('Text message sent.')
  } catch (error) {
    console.error('Error sending text message:', error)
  }
}

// 发送带有图片和文字的消息
async function sendPhotoWithTextMessage(
  chatId: number | string,
  replyContent: any
) {
  const photoUrl = replyContent.photoUrl || 'https://example.com/default.jpg' // 替换成默认图片URL
  const options: any = {
    caption: replyContent.caption || '这里是图片说明',
  }

  try {
    await bot.sendPhoto(chatId, photoUrl, options)
    console.log('Photo with text message sent.')
  } catch (error) {
    console.error('Error sending photo with text message:', error)
  }
}

// 发送带有视频和文字的消息
async function sendVideoWithTextMessage(
  chatId: number | string,
  replyContent: any
) {
  const photoUrl =
    replyContent.video ||
    'https://cdn.discordapp.com/attachments/1261273457337831538/1273568795172012063/55636_1723703075.mp4?ex=66bf16de&is=66bdc55e&hm=c97a9700bc64a517a92faaaa5a4fc18de844dab9f9e01462bff4400b001b89cd&' // 替换成默认图片URL
  const options: any = {
    caption: replyContent.caption || '',
  }

  try {
    await bot.sendVideo(chatId, photoUrl, options)
    console.log('Photo with text message sent.')
  } catch (error) {
    console.error('Error sending photo with text message:', error)
  }
}

// 发送媒体组的函数
async function sendMediaGroup(chatId: number | string, replyContent: any) {
  const { mediaGroup } = replyContent
  if (!mediaGroup || mediaGroup.length === 0) {
    console.error('No media provided for the media group.')
    return
  }

  // 构建媒体组的数组
  const mediaArray = mediaGroup.map((media: any) => ({
    type: media.type, // 根据需要更改为 'video' 等
    media: media.url,
    caption: media.caption || '', // 可以为每个媒体单独指定说明
  }))

  try {
    await bot.sendMediaGroup(chatId, mediaArray)
    console.log('Media group message sent.')
  } catch (error) {
    console.error('Error sending media group message:', error)
  }
}
