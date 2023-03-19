import { FC, useContext, useEffect, useState } from 'react'
import { useChat } from '~app/hooks/use-chat'
import { BotId, ChatConversation } from '~types'
import { ConversationsContext } from '~app/context'
import { CHATBOTS } from '~app/consts'
import ConversationPanel from '../components/Chat/ConversationPanel'
import NavLink from '../components/Sidebar/NavLink'

export const SingleBotChatPanel: FC<{ botId: BotId }> = (props) => {
  const chat = useChat(props.botId)
  return (
    <div className="overflow-hidden">
      <ConversationPanel chat={chat} onUserSendMessage={chat.sendMessage} />
    </div>
  )
}

export const HistorySingleBotChatPanel: FC<{ botId: BotId, chatId: string }> = (props) => {
  const { botId, chatId } = props
  const { query } = useContext(ConversationsContext)
  const [chat, setChat] = useState<ChatConversation | null>(null)
  useEffect(() => {
    const chat = query.data?.find((d) => d.conversationId === chatId)
    !chat.botId && (chat.botId = botId)
    setChat({ ...chat })
  }, [query, botId, chatId])
  console.log(JSON.stringify(chat), chatId)

  return (
    <div className="overflow-hidden">
      {
        chat ? (
          <ConversationPanel isHistory chat={chat} onUserSendMessage={chat.sendMessage} />
        ) : (
          <div className="mx-auto w-40">
            <p className="mt-10 mb-5 flex justify-center text-dark text-sm dark:text-white/50">
              选择的历史对话不存在，点击👇链接开始新对话
            </p>
            <NavLink bot={CHATBOTS[botId]} />
          </div>
        )
      }
    </div>
  )
}
