import WebSocketAsPromised from 'websocket-as-promised'
import { BingConversationStyle, getUserConfig } from '~services/user-config'
import { ChatError, ErrorCode } from '~utils/errors'
import { fillURL } from '~utils/format'
import { ExtraMessageInfo } from '~types/chat'
import { AbstractBot, SendMessageParams } from '../abstract-bot'
import { createConversation } from './api'
import { ChatResponseMessage, ConversationInfo, InvocationEventType } from './types'
import { convertMessageToMarkdown, websocketUtils } from './utils'

const styleOptionMap: Record<BingConversationStyle, string> = {
  [BingConversationStyle.Balanced]: 'harmonyv3',
  [BingConversationStyle.Creative]: 'h3imaginative',
  [BingConversationStyle.Precise]: 'h3precise',
}

const getWebSocketURL = (useBingChatHubProxy: string, bingApiDomain: string) => {
  if (useBingChatHubProxy === 'true' && bingApiDomain) {
    return fillURL(bingApiDomain.replace('http','ws'),"ChatHub");
  }
  return 'wss://sydney.bing.com/sydney/ChatHub'
}

export class BingWebBot extends AbstractBot {
  private conversationContext?: ConversationInfo

  private buildChatRequest(conversation: ConversationInfo, message: string) {
    const styleOption = styleOptionMap[conversation.conversationStyle]
    return {
      arguments: [
        {
          source: 'cib',
          optionsSets: [
            'deepleo',
            'nlu_direct_response_filter',
            'disable_emoji_spoken_text',
            'responsible_ai_policy_235',
            'enablemm',
            'dtappid',
            'rai253',
            'dv3sugg',
            styleOption,
          ],
          allowedMessageTypes: ['Chat', 'InternalSearchQuery'],
          isStartOfSession: conversation.invocationId === 0,
          message: {
            author: 'user',
            inputMethod: 'Keyboard',
            text: message,
            messageType: 'Chat',
          },
          conversationId: conversation.conversationId,
          conversationSignature: conversation.conversationSignature,
          participant: { id: conversation.clientId },
        },
      ],
      invocationId: conversation.invocationId.toString(),
      target: 'chat',
      type: InvocationEventType.StreamInvocation,
    }
  }

  async doSendMessage(params: SendMessageParams) {
    if (!this.conversationContext) {
      const [
        conversation,
        { bingConversationStyle }
      ] = await Promise.all([createConversation(), getUserConfig()])
      this.conversationContext = {
        conversationId: conversation.conversationId,
        conversationSignature: conversation.conversationSignature,
        clientId: conversation.clientId,
        invocationId: 0,
        conversationStyle: bingConversationStyle,
      }
    }

    const conversation = this.conversationContext!

    const { useBingChatHubProxy, bingApiDomain } = await getUserConfig()
    const wsp = new WebSocketAsPromised(getWebSocketURL(
      useBingChatHubProxy,
      bingApiDomain
    ), {
      packMessage: websocketUtils.packMessage,
      unpackMessage: websocketUtils.unpackMessage,
    })

    wsp.onUnpackedMessage.addListener((events) => {
      for (const event of events) {
        if (JSON.stringify(event) === '{}') {
          wsp.sendPacked({ type: 6 })
          wsp.sendPacked(this.buildChatRequest(conversation, params.prompt))
          conversation.invocationId += 1
        } else if (event.type === 6) {
          wsp.sendPacked({ type: 6 })
        } else if (event.type === 3) {
          params.onEvent({ type: 'DONE' })
          wsp.removeAllListeners()
          wsp.close()
        } else if (event.type === 1) {
          // 处理消息
          if (event?.arguments[0]?.messages) {
            const message: ChatResponseMessage = event.arguments[0].messages[0]
            const text = convertMessageToMarkdown(message)
            const data: { text: string, extra?: ExtraMessageInfo } = { text }
            if (message.sourceAttributions) {
              data.extra = {
                source: message.sourceAttributions.map(item => ({
                  name: item.providerDisplayName,
                  url: item.seeMoreUrl,
                }))
              }
            }
            params.onEvent({ type: 'UPDATE_ANSWER', data })
          }
          // 处理剩余次数
          // if (event?.arguments[0]?.throttling) {
          //   const {
          //     maxNumUserMessagesInConversation,
          //     numUserMessagesInConversation
          //   // eslint-disable-next-line no-unsafe-optional-chaining
          //   } = event?.arguments[0]?.throttling
          //   params.onEvent({
          //     type: 'UPDATE_THROTTLING',
          //     data: {
          //       max: maxNumUserMessagesInConversation,
          //       current: numUserMessagesInConversation,
          //     }
          //   })
          // }
        } else if (event.type === 2) {
          const messages = event.item.messages as ChatResponseMessage[]
          const limited = messages?.some((message) => message.contentOrigin === 'TurnLimiter')
          if (limited) {
            params.onEvent({
              type: 'ERROR',
              error: new ChatError(
                '抱歉，你已经达到了单次对话的最大次数，请点击左上方按钮开始一段新对话',
                ErrorCode.CONVERSATION_LIMIT,
              ),
            })
          }
        }
      }
    })

    wsp.onClose.addListener(() => {
      params.onEvent({ type: 'DONE' })
    })

    params.signal?.addEventListener('abort', () => {
      wsp.removeAllListeners()
      wsp.close()
    })

    await wsp.open()
    wsp.sendPacked({ protocol: 'json', version: 1 })
  }

  resetConversation(): any {
    const originContext = this.conversationContext
    this.conversationContext = undefined
    return originContext
  }

  getConversationContext(): any {
    return this.conversationContext
  }
}
