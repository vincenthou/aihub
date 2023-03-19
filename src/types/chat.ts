import { BotId } from '~types'
import { ChatError } from '~utils/errors'

export interface ChatMessageModel {
  id: string
  author: BotId | 'user'
  text: string
  error?: ChatError
}

export interface ConversationModel {
  messages: ChatMessageModel[]
}

export interface ChatConversation {
  botId: BotId
  name?: string
  conversationId: string
  messages: ChatMessageModel[]
  resetConversation: () => any
  getConversationContext: () => any
  sendMessage: (input: string) => void
  generating: boolean
  stopGenerating: () => void
}