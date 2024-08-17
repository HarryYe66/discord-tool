import express from 'express'
import ChannelsService from '../utils/sql/Channels'
import { SuccessMsg, ErrorMsg } from '../utils/resMsg'

const router = express.Router()
const channelService = new ChannelsService()

// 添加新频道
router.post('/add/channels', async (req, res) => {
  try {
    console.log(req, 'req \n')
    console.log(res, 'res')

    const { name, channelId, chatId, token, botKey, delay } = req.body

    // 输入验证
    if (!name || !channelId || !chatId || !token || !botKey) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const newChannel = await channelService.addChannel(
      name,
      channelId,
      chatId,
      token,
      botKey,
      delay
    )
    return SuccessMsg(res, newChannel, '添加成功')
  } catch (error) {
    console.error('Error adding channel:', error)
    return ErrorMsg(res, [], 'Error adding channel')

    // res.status(500).json({ message: 'Error adding channel', error })
  }
})

// 获取单个频道
router.get('/channels/:id', async (req, res) => {
  try {
    const channelId = Number(req.params.id)
    if (isNaN(channelId)) {
      return res.status(400).json({ message: 'Invalid channel ID' })
    }

    const channel = await channelService.findChannelById(channelId)
    if (channel) {
      res.status(200).json(channel)
    } else {
      res.status(404).json({ message: 'Channel not found' })
    }
  } catch (error) {
    console.error('Error fetching channel:', error)
    res.status(500).json({ message: 'Error fetching channel', error })
  }
})

// 删除指定ID的频道
router.delete('/channels/:id', async (req, res) => {
  try {
    const channelId = Number(req.params.id)

    if (isNaN(channelId)) {
      return res.status(400).json({ message: 'Invalid channel ID' })
    }

    const deleteSuccess = await channelService.deleteChannel(channelId)

    if (deleteSuccess) {
      return SuccessMsg(res, null, '删除成功')
    } else {
      return ErrorMsg(res, null, '频道未找到或删除失败')
    }
  } catch (error) {
    console.error('Error deleting channel:', error)
    return ErrorMsg(res, null, '删除频道时发生错误')
  }
})

// 获取所有频道
router.post('/channels', async (req, res) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10

    if (isNaN(page) || isNaN(limit)) {
      return res
        .status(400)
        .json({ message: 'Invalid page or limit parameter' })
    }

    const channels = await channelService.findChannels(page, limit)
    const total = await channelService.countChannels()
    return SuccessMsg(res, { channels, total }, '获取成功')
  } catch (error) {
    console.error('Error fetching channels:', error)
    res.status(500).json({ message: 'Error fetching channels', error })
  }
})

export default router
