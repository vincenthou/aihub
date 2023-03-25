import { BotId } from '~types'
import { ChatError } from '~utils/errors'

export interface ExtraMessageInfo {
  source?: { name: string, url: string }[]
  suggests?: { text: string }[]
}

export interface ChatMessageModel {
  id: string
  author: BotId | 'user'
  text: string
  extra?: ExtraMessageInfo
  error?: ChatError
}

export interface ConversationModel {
  messages: ChatMessageModel[]
}

export interface ChatConversation {
  botId: BotId
  conversationId: string
  messages: ChatMessageModel[]
  name?: string
  generating?: boolean
  resetConversation: () => any
  getConversationContext: () => any
  sendMessage: (input: string) => void
  stopGenerating: () => void
}