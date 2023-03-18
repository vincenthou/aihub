import { FC, useState, useCallback, useMemo } from 'react'
import { PaperAirplaneIcon } from '@heroicons/react/20/solid'
import Button from '~app/components/Button'
import ChatMessageInput from '~app/components/Chat/ChatMessageInput'
import { useChat } from '~app/hooks/use-chat'
import { BotId, ChatMessageModel } from '~types'
import ConversationPanel from '../components/Chat/ConversationPanel'

interface Chat {
  botId: BotId
  messages: ChatMessageModel[]
  sendMessage: (input: string) => void
  resetConversation: () => void
  generating: boolean
  stopGenerating: () => void
}

const MultiBotChatPanel: FC = () => {
  const [chats, setChats] = useState<Chat[]>([useChat(BotId.CHATGPT), useChat(BotId.BING)])
  const [leftChat, rightChat] = chats

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
    <div className="grid grid-cols-2 grid-rows-[1fr_auto] overflow-hidden gap-5">
      {
        chats.map(chat => (
          <ConversationPanel
            key={chat.botId}
            botId={chat.botId}
            messages={chat.messages}
            onUserSendMessage={onUserSendMessage}
            generating={chat.generating}
            stopGenerating={chat.stopGenerating}
            mode="compact"
            resetConversation={chat.resetConversation}
          />
        ))
      }
      <div className="col-span-full">
      <ChatMessageInput
        mode="full"
        className="rounded-full bg-white px-[20px] py-[10px]"
        disabled={generating}
        placeholder="Send to all ..."
        onSubmit={onUserSendMessage}
        actionButton={
          !generating && (
            <Button color="primary" type="submit">
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
