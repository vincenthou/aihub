import cx from 'classnames'
import { FC, useCallback, useMemo, useState, useRef, useContext } from 'react'
import { BiMessageAdd } from 'react-icons/bi'
import { PhotoIcon } from '@heroicons/react/20/solid'
import { CHATBOTS } from '~app/consts'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import toast, { Toaster } from 'react-hot-toast'
import Tooltip from '~app/components/Tooltip'
import {
  ConversationContext,
  ConversationContextValue,
  ConversationsContext
} from '~app/context'
import { PaperAirplaneIcon, DocumentArrowDownIcon } from '@heroicons/react/20/solid'
import { BotId, BotProps, ChatConversation } from '~types'
import Button from '../Button'
import ChatMessageInput from './ChatMessageInput'
import ChatMessageList from './ChatMessageList'
import BotSwitcher from './BotSwitcher'
import NewConversationDialog from './NewConversationDialog'

interface Props {
  mode?: 'full' | 'compact'
  onUserSendMessage: (input: string, botId: BotId) => void
  chat: ChatConversation
  isHistory?: boolean
}

const buttonClassName = 'flex cursor-pointer absolute items-center text-white/50 dark:text-white'

const ConversationPanel: FC<Props> = (props) => {
  const { mode = 'full', onUserSendMessage, chat } = props
  const {
    botId,
    messages,
    resetConversation,
    stopGenerating,
    generating
  } = chat
  const marginClass = mode === 'compact' ? 'mx-5' : 'mx-10'
  const [botInfo, setBotInfo] = useState<BotProps>(CHATBOTS[botId])
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const messageText = messages?.reduce((acc, message) => `${acc}#${message.author}\n${message.text}\n\n`, '')
  const messagesRef = useRef<{ export: () => void }>(null);
  const conversations = useContext(ConversationsContext)

  const context: ConversationContextValue = useMemo(() => {
    return {
      reset: resetConversation,
    }
  }, [resetConversation])

  const onSubmit = useCallback(
    async (input: string) => {
      onUserSendMessage(input as string, botInfo.id)
    },
    [onUserSendMessage, botInfo.id],
  )

  const resetConversationCallback = useCallback(() => {
    !generating && resetConversation()
  }, [generating, resetConversation])

  const setConversationName = useCallback((name: string) => {
    // 也可以在这里通过 chat.getConversationContext 传更完整会话上下文
    chat.name = name
    conversations?.create(chat)
    resetConversationCallback()
    setIsDialogOpen(false)
  }, [chat, conversations?.create, resetConversationCallback])

  const onCreateNewConversation = () => {
    if (props.isHistory) {
      location.href = `/app.html#/chat/${botId}`
    } else {
      setIsDialogOpen(true)
    }
  }
  const onExport = () => messagesRef.current?.export()
  const onCopySuccess = () => toast.success('复制Markdown成功')

  const hasAction = mode === 'full' && !!messages?.length

  return (
    <ConversationContext.Provider value={context}>
      <div className="flex flex-col overflow-hidden h-full">
        <div
          className={cx(
            'relative border-b border-solid border-[#ededed] h-[60px] flex flex-row items-center justify-center gap-2 py-2',
            marginClass,
          )}
        >
          {hasAction && (
            <div
              className={cx(
                buttonClassName,
                'left-0',
                generating ? 'cursor-not-allowed' : 'cursor-pointer absolute'
              )}
              title="Start new conversation"
              onClick={onCreateNewConversation}
            >
              <BiMessageAdd size={16} />
              <span className='text-sm ml-1'>开始新对话</span>
            </div>
          )}
          <img src={botInfo.avatar} className="w-5 h-5 object-contain rounded-full" />
          <span className="font-semibold text-white/50 dark:text-white text-sm">{botInfo.name}</span>
          <BotSwitcher mode={mode} botId={botInfo.id} onChange={setBotInfo} />
          {hasAction && (<>
            <button className={cx(buttonClassName, 'right-0')} onClick={onExport}>
              <Tooltip content="导出图片">
                <PhotoIcon
                  className="h-5 w-5 hover:text-violet-100"
                  aria-hidden="true"
                />
              </Tooltip>
            </button>
            <CopyToClipboard text={messageText} onCopy={onCopySuccess}>
              <button className={cx(buttonClassName, 'right-8')}>
                <Tooltip content="复制对话">
                  <DocumentArrowDownIcon
                    className="h-5 w-5 hover:text-violet-100"
                    aria-hidden="true"
                  />
                </Tooltip>
              </button>
            </CopyToClipboard>
          </>)}
        </div>
        <ChatMessageList
          ref={messagesRef}
          botId={botInfo.id}
          messages={messages}
          className={marginClass}
        />
        {
          mode === "full" ? (
            <div className={cx("mt-3 flex flex-col mb-5", marginClass)}>
              <ChatMessageInput
                // mode={mode}
                mode="full"
                className="rounded-full bg-white px-[20px] py-[10px]"
                disabled={generating}
                readOnly={!onUserSendMessage}
                placeholder={!onUserSendMessage ? '抱歉，除了chatGPT其他机器人暂不支持基于历史记录继续对话' : '随便问我点啥...'}
                onSubmit={onSubmit}
                autoFocus={mode === "full"}
                actionButton={
                  generating ? (
                    <Button
                      text="停"
                      color="flat"
                      size={mode === "full" ? "normal" : "small"}
                      onClick={stopGenerating}
                    />
                  ) : (
                    mode === "full" && !!onUserSendMessage ? (
                      <Button color="primary" isRound type="submit">
                        <PaperAirplaneIcon
                          className="h-5 w-5 text-white"
                          aria-hidden="true"
                        />
                      </Button>
                    ) : null
                  )
                }
              />
            </div>
          ) : null
        }
        <Toaster position="top-right" />
      </div>
      <NewConversationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        setName={setConversationName}
      />
    </ConversationContext.Provider>
  )
}

export default ConversationPanel
