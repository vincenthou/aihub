import { SWRResponse } from 'swr'
import { createContext } from 'react'
import { ChatConversation, Notification } from '~types'

export interface ConversationContextValue {
  reset: () => void
}

export interface ConversationsContextValue {
  notifications: SWRResponse<Notification, any, Required<{ suspense: true }>>
  query: SWRResponse<ChatConversation[], any, Required<{ suspense: true }>>
  create: (conversation: ChatConversation) => void
  remove: (id: string) => void
  removeAll: () => void
  importAll: (conversations: ChatConversation[]) => void
}

export const ConversationContext = createContext<ConversationContextValue | null>(null)

export const ConversationsContext = createContext<ConversationsContextValue | null>(null)
