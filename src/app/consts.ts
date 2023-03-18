import chatgptLogo from '~/assets/chatgpt-logo.svg'
import bingLogo from '~/assets/bing-logo.svg'
import { BotId, BotProps } from '~types'

export const CHATBOTS: Record<BotId, BotProps> = {
  [BotId.CHATGPT]: {
    id: BotId.CHATGPT,
    name: 'ChatGPT',
    avatar: chatgptLogo,
  },
  [BotId.BING]: {
    id: BotId.BING,
    name: 'Bing',
    avatar: bingLogo,
  },
  [BotId.GPT4]: {
    id: BotId.GPT4,
    name: 'GPT-4',
    avatar: chatgptLogo,
  },
}

export const CHATGPT_HOME_URL = 'https://chat.openai.com/chat'
