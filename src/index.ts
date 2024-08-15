import WebSocket from 'ws'
import zlib from 'zlib'
import axios from 'axios'
import getBotInstance from '../src/utils/telegram/botInstance'

import { instances, connectParamsConfig, subParams } from './config/instances'

const createDiscordListener = (instance: (typeof instances)[0]) => {
  const inflate = zlib.createInflate()
  let dataBuffer: any
  let decompressedData: any

  let heartbeat = 0
  const ws = new WebSocket(
    'wss://gateway.discord.gg/?encoding=json&v=9&compress=zlib-stream'
  )

  inflate.on('data', (chunk) => {
    decompressedData = Buffer.concat([decompressedData, chunk])
  })

  inflate.on('error', async (err) => {
    console.error('解压缩错误:', err)
    inflate.reset()
    dataBuffer = Buffer.alloc(0)
  })

  ws.on('open', () => {
    console.log(`Connected to Discord instance: ${instance.name}`)
  })

  ws.on('message', async (data: Buffer) => {
    dataBuffer = Buffer.alloc(0)
    decompressedData = Buffer.alloc(0)

    inflate.write(data, async (err) => {
      if (err) {
        console.error('Decompression error:', err)
        return
      }

      if (decompressedData.length > 0) {
        const message = JSON.parse(decompressedData.toString())

        decompressedData = Buffer.alloc(0)
        if (message.op === 10 && message.s === null) {
          let heartbeat_interval = message.d?.heartbeat_interval || 41250
          setInterval(() => {
            heartbeat -= 1
            ws.send(JSON.stringify({ op: 1, d: heartbeat }))
          }, heartbeat_interval)
          ws.send(
            JSON.stringify({
              op: 2,
              d: { ...instance.connectParams, ...connectParamsConfig },
            })
          )
        }

        if (message.op === 0 && message.s === 1) {
          ws.send(JSON.stringify(subParams))
        }

        if (message.op === 11) {
          console.log('接收心跳_')
        }

        if (message.t && message.t === 'MESSAGE_CREATE' && message.op === 0) {
          const {
            content,
            guild_id,
            author,
            channel_id,
            attachments,
            timestamp,
          } = message.d
          //   console.log(message.d.content, 'message_')
          const binding = instance.bindings.find(
            (b) => b.discordChannelId === channel_id
          )
          console.log(content, '_messages')

          if (binding) {
            // console.log(message, '_message')
            const { telegramBotToken, telegramChatId } = binding
            let newtelegramChatId = telegramChatId

            // 判断并去除@
            if (newtelegramChatId.startsWith('@')) {
              newtelegramChatId = telegramChatId.slice(1)
            }
            const bot = getBotInstance(telegramBotToken)

            //首先判断是图文还是纯文本
            if (attachments.length === 0) {
              //图文
              if (content !== '') {
                await bot.sendMessage(`@${newtelegramChatId}`, content)
              }
            } else {
              let mediaGroup: any[] = []
              attachments.forEach((file: any) => {
                if (file.content_type.startsWith('image/')) {
                  console.log(`${file.filename} is an image.`)
                  mediaGroup.push({
                    type: 'photo',
                    media: file.url,
                    caption: content,
                  })
                } else if (file.content_type.startsWith('video/')) {
                  console.log(`${file.filename} is a video.`)
                  mediaGroup.push({
                    type: 'video',
                    media: file.url,
                    caption: content,
                  })
                }
              })
              await bot.sendMediaGroup(`@${newtelegramChatId}`, mediaGroup)
            }

            // console.log(
            //   content,
            //   guild_id,
            //   channel_id,
            //   author,
            //   attachments,
            //   timestamp,
            //   '_message_info',
            //   attachments.length
            // )

            // await axios.post(
            //   `https://api.telegram.org/bot${binding.telegramBotToken}/sendMessage`,
            //   {
            //     chat_id: binding.telegramChatId,
            //     text: content,
            //   }
            // )
          }
        }
      }
    })
  })

  ws.on('close', () => {
    console.log(`Discord instance ${instance.name} connection closed`)
  })

  ws.on('error', (err) => {
    console.error(`Error in Discord instance ${instance.name}:`, err)
  })
}

instances.forEach(createDiscordListener)
