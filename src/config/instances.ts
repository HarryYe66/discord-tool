import dotenv from 'dotenv'
dotenv.config()
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

interface AuthorT {
  username: null | string
  public_flags: number
  id: null | string
  global_name: null | string
  discriminator: null | string
  clan: null | string
  avatar_decoration_data: null | string
  avatar: null | string
}

const instances: InstanceConfig[] = [
  {
    name: 'Instance1',
    connectParams: {
      token: process.env.DISCORD_TOKEN_1,
    },
    bindings: [
      {
        discordChannelId: '1261273457337831538', //测试
        telegramBotToken: process.env.TELEGRAM_BOT_TOKEN_1 || '',
        telegramChatId: 'Dexcc_App',
      },
      {
        discordChannelId: '1244932076147441736', //推特监听
        telegramBotToken: process.env.TELEGRAM_BOT_TOKEN_1 || '',
        telegramChatId: 'Dexcc_App',
      },
      {
        discordChannelId: '1222463435476832278', //推特监控
        telegramBotToken: process.env.TELEGRAM_BOT_TOKEN_1 || '',
        telegramChatId: 'Dexcc_App',
      },
      {
        discordChannelId: '1222463137698156596', //ETH监控
        telegramBotToken: process.env.TELEGRAM_BOT_TOKEN_1 || '',
        telegramChatId: 'Dexcc_App',
      },
      {
        discordChannelId: '1242865180371587082', //情报局零号机
        telegramBotToken: process.env.TELEGRAM_BOT_TOKEN_1 || '',
        telegramChatId: 'Dexcc_App',
      },
      {
        discordChannelId: '1242865317063954524', //热门币监听
        telegramBotToken: process.env.TELEGRAM_BOT_TOKEN_1 || '',
        telegramChatId: 'Dexcc_App',
      },
      // more bindings
    ],
  },
  //   {
  //     name: 'Instance2',
  //     connectParams: {
  //       token: 'DISCORD_TOKEN_2',
  //       // other connectParams
  //     },
  //     bindings: [
  //       {
  //         discordChannelId: 'CHANNEL_ID_2',
  //         telegramBotToken: 'TELEGRAM_BOT_TOKEN_2',
  //         telegramChatId: 'TELEGRAM_CHAT_ID_2',
  //       },
  //       // more bindings
  //     ],
  //   },
]

const connectParamsConfig = {
  capabilities: 30717,
  properties: {
    os: 'Mac OS X',
    browser: 'Chrome',
    device: '',
    system_locale: 'zh-CN',
    browser_user_agent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    browser_version: '126.0.0.0',
    os_version: '10.15.7',
    referrer: 'https://discord.com/',
    referring_domain: 'discord.com',
    referrer_current: 'https://www.google.com/',
    referring_domain_current: 'www.google.com',
    search_engine_current: 'google',
    release_channel: 'stable',
    client_build_number: 314046,
    client_event_source: null,
  },
  presence: {
    status: 'unknown',
    since: 0,
    activities: [],
    afk: false,
  },
  compress: false,
  client_state: {
    guild_versions: {},
  },
}

const subParams = {
  op: 4,
  d: {
    guild_id: null,
    channel_id: null,
    self_mute: true,
    self_deaf: false,
    self_video: false,
    flags: 2,
  },
}

export { instances, connectParamsConfig, subParams }
