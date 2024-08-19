import { pool } from '../database/mySql'

export const tableName = 'Channels'
interface Binding {
  discordChannelId: string
  telegramBotToken: string
  telegramChatId: string
}

interface InstanceConfig {
  name: string
  connectParams: object
  bindings: Binding[]
}
export default class ChannelsService {
  async addChannel(
    name: string,
    channelId: string,
    chatId: string,
    token: string,
    botKey: string,
    delay: number
  ) {
    const client = await pool.getConnection()
    try {
      const insertQuery: any = await client.query(
        `INSERT INTO ${tableName} (name, channelId, chatId, token, botKey, delay) VALUES (?, ?, ?, ?, ?, ?)`,
        [name, channelId, chatId, token, botKey, delay]
      )

      const insertId = insertQuery[0].insertId

      const [rows] = await client.query(
        `SELECT * FROM ${tableName} WHERE id = ?`,
        [insertId]
      )

      const result = rows as any
      return result.length ? result[0] : null
    } catch (error) {
      console.error('Error addChannel', error)
      throw error
    } finally {
      client.release()
    }
  }

  async findChannelById(id: number) {
    const client = await pool.getConnection()
    try {
      const [rows] = await client.query(
        `SELECT * FROM ${tableName} WHERE id = ?`,
        [id]
      )
      const result = rows as any
      return result.length ? result[0] : null
    } catch (error) {
      console.error('Error findChannelById', error)
      throw error
    } finally {
      client.release()
    }
  }

  async findChannels(page: number, limit: number) {
    const client = await pool.getConnection()
    try {
      const offset = (page - 1) * limit
      const [rows] = await client.query(
        `SELECT * FROM ${tableName} LIMIT ?, ?`,
        [offset, limit]
      )
      return rows
    } catch (error) {
      console.error('Error findChannels', error)
      throw error
    } finally {
      client.release()
    }
  }

  /**
   * 删除指定ID的频道
   * @param id 频道的ID
   * @returns 删除操作的结果
   */
  async deleteChannel(id: number) {
    const client = await pool.getConnection()
    try {
      const [result]: any = await client.query(
        `DELETE FROM ${tableName} WHERE id = ?`,
        [id]
      )
      return result.affectedRows > 0
    } catch (error) {
      console.error('Error deleting channel:', error)
      throw error
    } finally {
      client.release()
    }
  }

  async countChannels() {
    const client = await pool.getConnection()
    try {
      const [rows] = await client.query(
        `SELECT COUNT(*) as total FROM ${tableName}`
      )
      const result = rows as any
      return result[0].total
    } catch (error) {
      console.error('Error countChannels', error)
      throw error
    } finally {
      client.release()
    }
  }

  async updateChannel(
    id: number,
    name: string,
    channelId: string,
    chatId: string,
    token: string,
    botKey: string,
    delay: number
  ) {
    const client = await pool.getConnection()
    try {
      // 更新频道信息
      const [result]: any = await client.query(
        `UPDATE ${tableName} SET name = ?, channelId = ?, chatId = ?, token = ?, botKey = ?, delay = ? WHERE id = ?`,
        [name, channelId, chatId, token, botKey, delay, id]
      )

      if (result.affectedRows > 0) {
        // 如果更新成功，查询并返回更新后的记录
        const [rows] = await client.query(
          `SELECT * FROM ${tableName} WHERE id = ?`,
          [id]
        )
        const updatedChannel = rows as any
        return updatedChannel.length ? updatedChannel[0] : null
      } else {
        // 如果没有更新任何记录，返回 null
        return null
      }
    } catch (error) {
      console.error('Error updating channel:', error)
      throw error
    } finally {
      client.release()
    }
  }

  // 新增组织实例的功能
  async organizeInstances(): Promise<InstanceConfig[]> {
    const client = await pool.getConnection()
    try {
      const [rows] = await client.query(`SELECT * FROM ${tableName}`)
      const channels = rows as any[]

      const instancesMap: { [key: string]: InstanceConfig } = {}

      channels.forEach((channel) => {
        const { name, token, channelId, botKey, chatId } = channel

        if (!instancesMap[token]) {
          instancesMap[token] = {
            name: name || `Instance for token ${token}`,
            connectParams: { token },
            bindings: [],
          }
        }

        instancesMap[token].bindings.push({
          discordChannelId: channelId,
          telegramBotToken: botKey,
          telegramChatId: chatId,
        })
      })

      return Object.values(instancesMap)
    } catch (error) {
      console.error('Error organizing instances:', error)
      throw error
    } finally {
      client.release()
    }
  }
}
