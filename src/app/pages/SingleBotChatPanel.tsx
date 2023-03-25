import { FC, useContext, useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useChat } from '~app/hooks/use-chat'
import { BotId, ChatConversation } from '~types'
import { ConversationsContext } from '~app/context'
import { CHATBOTS } from '~app/consts'
import Button from '~app/components/Button'
import ConversationPanel from '../components/Chat/ConversationPanel'
import NavLink from '../components/NavLink'

export const SingleBotChatPanel: FC<{ botId: BotId }> = (props) => {
  const { botId } = props
  const chat = useChat(botId)
  let renderExtraInfo: JSX.Element | null = null
  // 特殊处理bing显示
  if (botId === BotId.BING) {
    renderExtraInfo = <Link to="/setting">
      <Button color="flat" text="设置切换风格" size="small" />
    </Link>
  }
  return (
    <div className="overflow-hidden flex-1">
      <ConversationPanel
        chat={chat}
        onUserSendMessage={chat.sendMessage}
        renderExtraInfo={renderExtraInfo}
      />
    </div>
  )
}

export const HistorySingleBotChatPanel: FC<{ botId: BotId, chatId: string }> = (props) => {
  const { botId, chatId } = props
  const conversations = useContext(ConversationsContext)
  const [chat, setChat] = useState<ChatConversation | null>(null)
  useEffect(() => {
    const chat = conversations?.query.data?.find((d) => d.conversationId === chatId)
    if (chat) {
      !chat.botId && (chat.botId = botId)
      setChat({ ...chat })
    }
  }, [conversations?.query, botId, chatId])
  console.log(JSON.stringify(chat), chatId)

  return (
    <div className="overflow-hidden flex-1">
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
