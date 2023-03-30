import { Link } from '@tanstack/react-router'
import { ofetch } from 'ofetch'
import { FC, useCallback, useContext, useState, ReactElement } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { chatGPTClient } from '~app/bots/chatgpt-webapp/client'
import { ConversationContext, ConversationContextValue } from '~app/context'
import { copyCookies } from '~utils'
import { ChatError, ErrorCode } from '~utils/errors'
import { fillURL } from '~utils/format'
import Button from '../Button'
import MessageBubble from './MessageBubble'

const getNewBingAuthURL = async (bingApiDomain: string | undefined) => {
  if (bingApiDomain) {
    await copyCookies(bingApiDomain)
    return fillURL(bingApiDomain, 'bingcopilotwaitlist')
  }
  return 'https://www.bing.com/msrewards/api/v1/enroll?publ=BINGIP&crea=MY00IA&pn=bingcopilotwaitlist&partnerId=BingRewards&pred=true&wtc=MktPage_MY0291'
}

const tryNewBing = async (bingApiDomain: string | undefined) => {
  const url = await getNewBingAuthURL(bingApiDomain)  
  const resp = await ofetch(url).catch((err) => {
    const errorMessage = `自动申请出错，错误参考：${err.message}，更详细参考`
    toast.error(`${errorMessage}浏览器控制台`)
    console.error(errorMessage, err);
  })
  if (resp) {
    toast.success('尝试申请成功，如果当前对话未生效，请刷新页面重试，如果仍然无权限使用请等待几天后重试')
  }
}

const ChatGPTAuthErrorAction = () => {
  const [fixing, setFixing] = useState(false)
  const [fixed, setFixed] = useState(false)

  const fixChatGPT = useCallback(async () => {
    setFixing(true)
    try {
      await chatGPTClient.fixAuthState()
    } catch (e) {
      console.error(e)
      return
    } finally {
      setFixing(false)
    }
    setFixed(true)
  }, [])

  if (fixed) {
    return <MessageBubble color="flat">已经修复, 请重试对话</MessageBubble>
  }
  return (
    <div className="flex flex-row gap-2 items-center">
      <Button color="primary" text="验证你的openAI账号是否登录" onClick={fixChatGPT} isLoading={fixing} size="small" />
      <span className="text-sm">或者</span>
      <Link to="/setting">
        <Button color="primary" text="设置你ChatGPT配置的API Key" size="small" />
      </Link>
    </div>
  )
}

const handleBingUnauthorized = () => (
  <a href="https://bing.com" target="_blank" rel="noreferrer">
    <Button color="primary" text="先在bing.com登录你的账号" size="small" />
  </a>
)
const handleBingForbidden = (error: ChatError) => (
  <>
    <Button
      color="primary"
      text="需要自己先到 bing.com/new 手动申请，或者点我👆尝试立即通过"
      size="small"
      onClick={() => tryNewBing(error.extra)}
    />
    <Toaster position="top-right" />
  </>
)
const handleChatGPTUnauthorized = () => <ChatGPTAuthErrorAction />
const handlerBingLimit = (_: ChatError, conversation: ConversationContextValue | null) => (
  <Button
    color="primary"
    text="重置对话"
    size="small"
    onClick={() => conversation?.reset()}
  />
)
const handlerBingNotFound = () => <a href="https://seigy6zzam.feishu.cn/docx/KTp7dtDJZoSbbFxxmUpcUfXznhc#DCy4doqamocU0AxPkkocGGR0nJ1" target="_blank" rel="noreferrer">
  <Button color="primary" text="👆有魔法和无魔法解法点我参考" size="small" />
</a>

type ErrorHandler = (error: ChatError, conversation: ConversationContextValue | null) => ReactElement<any, any> | null

const errorHandler: Record<string, ErrorHandler> = {
  [ErrorCode.BING_UNAUTHORIZED]: handleBingUnauthorized,
  [ErrorCode.BING_FORBIDDEN]: handleBingForbidden,
  [ErrorCode.CHATGPT_CLOUDFLARE]: handleChatGPTUnauthorized,
  [ErrorCode.CHATGPT_UNAUTHORIZED]: handleChatGPTUnauthorized,
  [ErrorCode.CONVERSATION_LIMIT]: handlerBingLimit,
  [ErrorCode.BING_NOT_FOUND]: handlerBingNotFound,
}

// 特殊展示各种异常场景
const ErrorAction: FC<{ error: ChatError }> = ({ error }) => {
  const conversation = useContext(ConversationContext)
  if (errorHandler[error.code]) {
    return errorHandler[error.code](error, conversation)
  }
  return null
}

export default ErrorAction
