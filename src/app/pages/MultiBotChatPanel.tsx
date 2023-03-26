import { useAtomValue } from 'jotai'
import { uniqBy } from 'lodash-es'
import { FC, useState, useCallback, useMemo } from 'react'
import { PaperAirplaneIcon } from '@heroicons/react/20/solid'
import Button from '~app/components/Button'
import ChatMessageInput from '~app/components/Chat/ChatMessageInput'
import { useChat } from '~app/hooks/use-chat'
import { compareBotsAtom } from '~app/state'
import { BotId, ChatConversation } from '~types'
import ConversationPanel from '../components/Chat/ConversationPanel'

const MultiBotChatPanel: FC = () => {
  const [leftBotId, rightBotId] = useAtomValue(compareBotsAtom)
  const leftChat = useChat(leftBotId)
  const rightChat = useChat(rightBotId)
  const chats = useMemo(() => [leftChat, rightChat], [leftChat, rightChat])

  const generating = useMemo(() => chats.some((c) => c.generating), [chats])

  const onUserSendMessage = useCallback(
    (input: string, botId?: BotId) => {
      if (botId) {
        const chat = chats.find((c) => c.botId === botId)
        chat?.sendMessage(input)
      } else {
        uniqBy(chats, (c) => c.botId).forEach((c) => c.sendMessage(input))
      }
    },
    [chats],
  )

  return (
    <div className="grid grid-cols-2 grid-rows-[1fr_auto] overflow-hidden gap-5 flex-1">
      {
        chats.map((chat, index) => (
          <ConversationPanel
            key={`${chat.botId}-${index}`}
            index={index}
            chat={chat}
            mode="compact"
            onUserSendMessage={onUserSendMessage}
            // botId={conversation.botId}
            // messages={conversation.messages}
            // generating={conversation.generating}
            // stopGenerating={conversation.stopGenerating}
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
