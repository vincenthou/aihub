import useSWR from 'swr'
import { useCallback } from 'react'
import { Resizable } from 're-resizable'
import { Outlet } from '@tanstack/react-router'
import Sidebar from './Sidebar'
import { ConversationsContext } from '~app/context'
import {
  loadLocalConversations,
  addLocalConversation,
  removeLocalConversation
} from '~services/conversations'
import { ChatConversation } from '~types'

function Layout() {
  const chatId = location.hash.split('?')?.[1]?.split('=')?.[1]
  
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
      <main className="bg-white dark:bg-gray-800 flex backdrop-blur-2xl h-full">
        <ConversationsContext.Provider value={{ query, create, remove }}>
          <Resizable
            defaultSize={{ height: '100%', width: 256 }}
            minWidth={256}
            enable={{ 
              top:false,
              right:true,
              bottom:false,
              left:false,
              topRight:false,
              bottomRight:false,
              bottomLeft:false,
              topLeft:false
            }}
          >
            <Sidebar chatId={chatId} />
          </Resizable>
          <Outlet />
        </ConversationsContext.Provider>
      </main>
    </div>
  )
}

export default Layout
