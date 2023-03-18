import { BingWebBot } from './bing'
import { ChatGPTBot } from './chatgpt'
import { ChatGPTWebBot } from './chatgpt-webapp'
import { BotId } from '~types'

const botFactory = {
  [BotId.CHATGPT]: ChatGPTBot,
  [BotId.BING]: BingWebBot,
  [BotId.GPT4]: ChatGPTWebBot
}

export const createBot = (botId: BotId) => new botFactory[botId](botId)
