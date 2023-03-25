import Browser from 'webextension-polyfill'
import { ChatConversation } from '~types'

export async function loadLocalConversations() {
  const { conversations: value } = await Browser.storage.local.get('conversations')
  return (value || []) as ChatConversation[]
}

export async function importAllLocalConversations(conversations: ChatConversation[]) {
  await Browser.storage.local.set({ conversations })
}

export async function removeAllLocalConversations() {
  await Browser.storage.local.set({ conversations: [] })
}

export async function addLocalConversation(conversation: ChatConversation) {
  const conversations = await loadLocalConversations()
  if (conversations.find(c => c.conversationId === conversation.conversationId)) {
    return
  }
  await Browser.storage.local.set({ conversations: [conversation, ...conversations] })
}

export async function removeLocalConversation(id: string) {
  const conversations = await loadLocalConversations()
  await Browser.storage.local.set({ conversations: conversations.filter((c) => c.conversationId !== id) })
}
