import { FC, useState, useCallback, useMemo } from 'react'
import { PaperAirplaneIcon } from '@heroicons/react/20/solid'
import Button from '~app/components/Button'
import ChatMessageInput from '~app/components/Chat/ChatMessageInput'
import { useChat } from '~app/hooks/use-chat'
import { BotId, ChatConversation } from '~types'
import ConversationPanel from '../components/Chat/ConversationPanel'

const MultiBotChatPanel: FC = () => {
  const [conversations, setConversations] = useState<ChatConversation[]>([useChat(BotId.CHATGPT), useChat(BotId.BING)])
  // TODO: setConversations 改一起显示的聊天框bot
  const [leftChat, rightChat] = conversations

  const generating = useMemo(
    () => leftChat.generating || rightChat.generating,
    [leftChat.generating, rightChat.generating],
  )

  const onUserSendMessage = useCallback(
    (input: string) => {
      // 限制只能群发，不能对对比的界面单发
      leftChat.sendMessage(input)
      rightChat.sendMessage(input)
    },
    [leftChat, rightChat],
  )

  return (
    <div className="grid grid-cols-2 grid-rows-[1fr_auto] overflow-hidden gap-5 flex-1">
      {
        conversations.map(conversation => (
          <ConversationPanel
            key={conversation.botId}
            chat={conversation}
            mode="compact"
            onUserSendMessage={onUserSendMessage}
            // botId={conversation.botId}
            // messages={conversation.messages}
            // onUserSendMessage={onUserSendMessage}
            // generating={conversation.generating}
            // stopGenerating={conversation.stopGenerating}
            // mode="compact"
            // resetConversation={conversation.resetConversation}
          />
        ))
      }
      <div className="col-span-full">
      <ChatMessageInput
        mode="full"
        className="rounded-full bg-white px-[20px] py-[10px]"
        disabled={generating}
        placeholder="一起发送 ..."
        onSubmit={onUserSendMessage}
        actionButton={
          !generating && (
            <Button color="primary" isRound type="submit">
              <PaperAirplaneIcon
                className="h-5 w-5 text-white"
                aria-hidden="true"
              />
            </Button>
          )
        }
        autoFocus={true}
      />;
      </div>
    </div>
  )
}

export default MultiBotChatPanel
