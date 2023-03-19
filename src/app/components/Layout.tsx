import useSWR from 'swr'
import { useCallback } from 'react'
import { Outlet, useSearch } from '@tanstack/react-router'
import Sidebar from './Sidebar'
import { ConversationsContext } from '~app/context'
import { router } from '~app/router'
import {
  loadLocalConversations,
  addLocalConversation,
  removeLocalConversation
} from '~services/conversations'
import { ChatConversation } from '~types'

function Layout() {
  const route = router.getRoute('/layout/chat/$botId')
  const { chatId } = useSearch({ from: route.id })
  
  const query = useSWR('local-conversations', () => loadLocalConversations(), { suspense: true })
  const create = useCallback(
    async (conversation: ChatConversation) => {
      await addLocalConversation(conversation)
      query.mutate()
    },
    [query]
  )
  const remove = useCallback(
    async (id: string) => {
      await removeLocalConversation(id)
      query.mutate()
    },
    [query]
  )

  return (
    <div className="dark h-screen">
      <main className="bg-white dark:bg-gray-800 grid grid-cols-[20%_1fr] backdrop-blur-2xl h-full">
        <ConversationsContext.Provider value={{ query, create, remove }}>
          <Sidebar chatId={chatId} />
          <Outlet />
        </ConversationsContext.Provider>
      </main>
    </div>
  )
}

export default Layout
