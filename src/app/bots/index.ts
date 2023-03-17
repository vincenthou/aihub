import { BingWebBot } from './bing'
import { ChatGPTBot } from './chatgpt'
import { ChatGPTWebBot } from './chatgpt-webapp'

export enum BotId {
  CHATGPT = 'chatgpt',
  BING = 'bing',
  GPT4 = 'gpt-4',
}

const botFactory = {
  [BotId.CHATGPT]: ChatGPTBot,
  [BotId.BING]: BingWebBot,
  [BotId.GPT4]: ChatGPTWebBot
}

export function createBot(botId: BotId) {
  return new botFactory[botId](botId)
}
