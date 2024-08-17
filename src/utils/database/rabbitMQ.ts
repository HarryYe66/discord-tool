import amqp from 'amqplib'
import { config } from '../../config/config'
import { RabbitMessages } from '../../../types/user'

class RabbitMQManager {
  private connection: amqp.Connection | null = null
  private channel: amqp.Channel | null = null
  private isConnected: boolean = false
  private connectRetryInterval: number = 5000 // 重连间隔时间，单位毫秒
  private reconnectTimeout: NodeJS.Timeout | null = null

  async connectQueue(): Promise<void> {
    try {
      this.connection = await amqp.connect(config.amqp.host)
      this.channel = await this.connection.createChannel()
      await this.channel.assertQueue(config.amqp.database, { durable: true })
      this.isConnected = true
      console.log('Connected to RabbitMQ')
    } catch (error: any) {
      console.error('Failed to connect to RabbitMQ:', error.message)
      this.isConnected = false
      // 如果连接失败，尝试自动重连
      this.scheduleReconnect()
      throw error
    }
  }

  async sendToQueue(operation: RabbitMessages): Promise<void> {
    await this.ensureConnected()
    try {
      if (!this.channel) {
        throw new Error('Channel not available')
      }
      await this.channel.sendToQueue(
        config.amqp.database,
        Buffer.from(JSON.stringify(operation)),
        { persistent: true }
      )
      console.log('Message sent to RabbitMQ', operation)
    } catch (error: any) {
      console.error('Failed to send message to RabbitMQ:', error.message)
      throw error
    }
  }

  async consumeQueue(
    callback: (operation: RabbitMessages) => void
  ): Promise<void> {
    await this.ensureConnected()
    try {
      if (!this.channel) {
        throw new Error('Channel not available')
      }
      await this.channel.consume(
        config.amqp.database,
        (msg) => {
          if (msg !== null) {
            const operation: RabbitMessages = JSON.parse(msg.content.toString())
            callback(operation)
            this.channel!.ack(msg)
          }
        },
        { noAck: false }
      )
      console.log('Started consuming messages from RabbitMQ')
    } catch (error: any) {
      console.error('Failed to consume messages from RabbitMQ:', error.message)
      throw error
    }
  }

  async close(): Promise<void> {
    try {
      if (this.connection) {
        await this.connection.close()
        console.log('Closed RabbitMQ connection')
        this.isConnected = false
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout)
          this.reconnectTimeout = null
        }
      }
    } catch (error: any) {
      console.error('Failed to close RabbitMQ connection:', error.message)
      throw error
    }
  }

  private async ensureConnected(): Promise<void> {
    if (!this.isConnected) {
      await this.connectQueue()
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
    }
    this.reconnectTimeout = setTimeout(async () => {
      console.log('Attempting to reconnect to RabbitMQ...')
      try {
        await this.connectQueue()
      } catch (error: any) {
        console.error('Failed to reconnect to RabbitMQ:', error.message)
        this.scheduleReconnect() // 如果重连失败，继续尝试重连
      }
    }, this.connectRetryInterval)
  }
}

// 单例模式，确保只有一个实例
// export const rabbitMQManager = new RabbitMQManager()

// 或者使用依赖注入的方式
export default RabbitMQManager
