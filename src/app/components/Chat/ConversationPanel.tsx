import cx from 'classnames'
import { FC, useCallback, useMemo, useState, useRef } from 'react'
import { BiMessageAdd } from 'react-icons/bi'
import { PhotoIcon } from '@heroicons/react/20/solid'
import { CHATBOTS } from '~app/consts'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import toast, { Toaster } from 'react-hot-toast'
import Tooltip from '~app/components/Tooltip'
import { ConversationContext, ConversationContextValue } from '~app/context'
import { PaperAirplaneIcon, DocumentArrowDownIcon } from '@heroicons/react/20/solid'
import { BotId, BotProps, ChatMessageModel } from '~types'
import Button from '../Button'
import ChatMessageInput from './ChatMessageInput'
import ChatMessageList from './ChatMessageList'
import BotSwitcher from './BotSwitcher'

interface Props {
  botId: BotId
  messages: ChatMessageModel[]
  onUserSendMessage: (input: string, botId: BotId) => void
  resetConversation: () => void
  generating: boolean
  stopGenerating: () => void
  mode?: 'full' | 'compact'
}

const buttonClassName = 'flex cursor-pointer absolute items-center text-white/50 dark:text-white'

const ConversationPanel: FC<Props> = (props) => {
  const mode = props.mode || 'full'
  const marginClass = mode === 'compact' ? 'mx-5' : 'mx-10'
  const [botInfo, setBotInfo] = useState<BotProps>(CHATBOTS[props.botId])
  const messageText = props.messages?.reduce((acc, message) => `${acc}#${message.author}\n${message.text}\n\n`, '')
  const messagesRef = useRef(null);
  console.log(messageText)

  const context: ConversationContextValue = useMemo(() => {
    return {
      reset: props.resetConversation,
    }
  }, [props.resetConversation])

  const onSubmit = useCallback(
    async (input: string) => {
      props.onUserSendMessage(input as string, botInfo.id)
    },
    [props],
  )

  const resetConversation = useCallback(() => {
    if (!props.generating) {
      props.resetConversation()
    }
  }, [props])

  const onExport = () => messagesRef.current?.export()
  const onCopySuccess = () => toast.success('复制Markdown成功')

  const hasAction = mode === 'full' && !!props.messages.length

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
                props.generating ? 'cursor-not-allowed' : 'cursor-pointer absolute'
              )}
              title="Start new conversation"
              onClick={resetConversation}
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
          messages={props.messages}
          className={marginClass}
        />
        {
          mode === "full" ? (
            <div className={cx("mt-3 flex flex-col mb-5", marginClass)}>
              <ChatMessageInput
                // mode={mode}
                mode="full"
                className="rounded-full bg-white px-[20px] py-[10px]"
                disabled={props.generating}
                placeholder="Ask me anything..."
                onSubmit={onSubmit}
                autoFocus={mode === "full"}
                actionButton={
                  props.generating ? (
                    <Button
                      text="Stop"
                      color="flat"
                      size={mode === "full" ? "normal" : "small"}
                      onClick={props.stopGenerating}
                    />
                  ) : (
                    mode === "full" && (
                      <Button color="primary" type="submit">
                        <PaperAirplaneIcon
                          className="h-5 w-5 text-white"
                          aria-hidden="true"
                        />
                      </Button>
                    )
                  )
                }
              />
            </div>
          ) : null
        }
        <Toaster position="top-right" />
      </div>
    </ConversationContext.Provider>
  )
}

export default ConversationPanel
