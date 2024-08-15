// src/utils/telegram/botInstance.ts
import TelegramBot from 'node-telegram-bot-api'

let bot: TelegramBot | null = null

const getBotInstance = (token: string): TelegramBot => {
  if (!bot) {
    bot = new TelegramBot(token, { polling: true })
    // bot = new TelegramBot(token, { polling: true })

    // 监听应用程序关闭事件，自动断开 Telegram Bot 的连接
    process.on('SIGINT', () => {
      bot?.stopPolling()
      console.log('Telegram Bot polling stopped.')
      process.exit()
    })
    process.on('SIGTERM', () => {
      bot?.stopPolling()
      console.log('Telegram Bot polling stopped.')
      process.exit()
    })
  }
  return bot
}

export default getBotInstance
