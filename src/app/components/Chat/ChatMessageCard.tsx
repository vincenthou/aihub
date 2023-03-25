import cx from 'classnames'
import { FC, memo, useEffect, useMemo, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { IoCopy, IoCopyOutline } from 'react-icons/io5'
import { BeatLoader } from 'react-spinners'
import { BotId, BotProps, ChatMessageModel } from '~types'
import { CHATBOTS } from '~/app/consts'
import Markdown from '../Markdown'
import ErrorAction from './ErrorAction'
import MessageBubble from './MessageBubble'

interface Props {
  botId: BotId
  message: ChatMessageModel
  className?: string
}

const copyIconClassName = 'absolute top-2 self-center cursor-pointer invisible group-hover:visible'

const ChatMessageCard: FC<Props> = ({ botId, message, className }) => {
  const [copied, setCopied] = useState(false)
  const bot: BotProps = CHATBOTS[botId]

  const copyText = useMemo(() => {
    if (message.text) {
      return message.text
    }
    if (message.error) {
      return message.error.message
    }
  }, [message.error, message.text])

  useEffect(() => {
    if (copied) {
      setTimeout(() => setCopied(false), 1000)
    }
  }, [copied])

  const isUser = message.author === 'user'

  return (
    <div
      className={cx('group flex gap-3 w-full', message.author === 'user' ? 'flex-row-reverse' : 'flex-row', className)}
    >
      <div className="flex w-11/12  max-w-fit items-start gap-2">
        {!isUser ? (
          <img src={bot.avatar} className="w-10 h-10 object-contain rounded-full" />
        ) : null }
        <MessageBubble color={message.author === 'user' ? 'primary' : 'flat'}>
          {message.text ? (
            <Markdown>{message.text}</Markdown>
          ) : (
            !message.error && <BeatLoader size={10} className="leading-tight" />
          )}
          {message.extra ? (
            <div className="py-2 text-sm flex flex-wrap gap-1">
              <span className="font-medium">参考来源：</span>
              {message.extra?.source?.map(item => (
                <a
                  className="bg-[#4987FC] p-1 mr-2 rounded text-white"
                  key={item.url}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.name}
                </a>
              ))}
            </div>
          ) : null}
          {!!message.error && <p className="text-[#e00]">{message.error.message}</p>}
          {!!copyText && (
            <CopyToClipboard text={copyText} onCopy={() => setCopied(true)}>
              {copied ? (
                <IoCopy className={cx(copyIconClassName, isUser ? 'left-2' : 'right-2')} color="#707070" />
              ) : (
                <IoCopyOutline className={cx(copyIconClassName, isUser ? 'left-2' : 'right-2')} />
              )}
            </CopyToClipboard>
          )}
        </MessageBubble>
        {isUser ? (
          <div className="rounded-[50%] h-10 w-10 flex items-center justify-center bg-[#4987FC] text-white">我</div>
        ) : null }
        {!!message.error && <ErrorAction error={message.error} />}
      </div>
    </div>
  )
}

export default memo(ChatMessageCard)
