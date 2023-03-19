import { forwardRef, useRef, useImperativeHandle } from 'react'
import cx from 'classnames'
import html2canvas from "html2canvas"
import ScrollToBottom from 'react-scroll-to-bottom'
import toast, { Toaster } from 'react-hot-toast'
import { BotId, ChatMessageModel } from '~types'
import ChatMessageCard from './ChatMessageCard'

interface Props {
  botId: BotId
  messages: ChatMessageModel[]
  className?: string
}

const exportAsImage = (element: HTMLElement | null, filename: string) => {
  if (!element) {
    toast.error('导出失败')
    return
  }
  // 调用html2canvas函数
  html2canvas(element, { 
    scrollX: 0,
    scrollY: 0,
    width: element.scrollWidth,
    height: element.scrollHeight + 200, // 留点余量
  }).then(canvas => {
    // 创建一个虚拟的a标签
    const link = document.createElement("a")
    // 设置a标签的href属性为图片数据
    link.href = canvas.toDataURL()
    // 设置a标签的download属性为文件名
    link.download = filename
    // 模拟点击a标签
    link.click()
  })
}

interface ExportChatHandle {
  export: () => void
}

const ChatMessageList = forwardRef<ExportChatHandle, Props>((props, ref) => {
  const messagesRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    export() {
      exportAsImage(messagesRef.current, "chat-history.png")
    }
  }))

  return (
    <>
      <ScrollToBottom className="overflow-auto h-full">
        <div ref={messagesRef} className={cx('flex flex-col gap-3 h-full', props.className)}>
          {props.messages?.map((message, index) => (
            <ChatMessageCard 
              key={message.id}
              botId={props.botId}
              message={message}
              className={index === 0 ? 'mt-5' : undefined}
            />
          ))}
        </div>
      </ScrollToBottom>
      <Toaster position="top-right" />
    </>
  )
})

ChatMessageList.displayName = 'ChatMessageList'

export default ChatMessageList
