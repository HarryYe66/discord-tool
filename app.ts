import express from 'express'
import channelRoutes from './src/api/Channel'
import cors from 'cors'

const app = express()

// 使用 CORS 中间件，允许所有源的跨域请求
// app.use(cors())

app.use(
  cors({
    origin: (origin, callback) => {
      // 允许所有来源访问
      callback(null, origin)
    },
    credentials: true, // 允许请求携带凭证
  })
)
// app.use(cors({
//   origin: 'http://localhost:3000' // 只允许来自这个来源的请求
// }))

// app.use(cors({
//   origin: ['http://localhost:3000', 'http://another-allowed-origin.com']
// }))
app.use(express.json())
app.use('/api', channelRoutes)

const PORT = process.env.PORT || 3013

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
