import { ofetch } from 'ofetch'
import { getUserConfig } from '~services/user-config'
import { ChatError, ErrorCode } from '~utils/errors'
import { ConversationResponse } from './types'
import { copyCookies } from '~utils'

const URLExp = new RegExp('^(https?://)([-a-zA-z0-9]+\\.)+([-a-zA-z0-9]+)+');

const createHeaders = () => ({
  'authority': 'edgeservices.bing.com',
  'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  "accept-language": "en-US,en;q=0.9",
  'cache-control': 'max-age=0',
  'sec-ch-ua': '"Chromium";v="110", "Not A(Brand";v="24", "Microsoft Edge";v="110"',
  'sec-ch-ua-arch': '"x86"',
  'sec-ch-ua-bitness': '"64"',
  'sec-ch-ua-full-version': '"110.0.1587.69"',
  'sec-ch-ua-full-version-list': '"Chromium";v="110.0.5481.192", "Not A(Brand";v="24.0.0.0", "Microsoft Edge";v="110.0.1587.69"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-model': '""',
  'sec-ch-ua-platform': '"Windows"',
  'sec-ch-ua-platform-version': '"15.0.0"',
  'sec-fetch-dest': 'document',
  'sec-fetch-mode': 'navigate',
  'sec-fetch-site': 'none',
  'sec-fetch-user': '?1',
  'upgrade-insecure-requests': '1',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.69',
  'x-edge-shopping-flag': '1',
  // 'x-forwarded-for': '1.1.1.1'
})

const getCreateURL = async () => {
  const { bingApiDomain } = await getUserConfig()

  if (bingApiDomain) {
    if (!URLExp.test(bingApiDomain)) {
      throw new ChatError(`API设置错误${bingApiDomain}，粉丝可咨询up主`, ErrorCode.BING_DOMAIN_INVALID)
    }
    await copyCookies(bingApiDomain)
    return `${bingApiDomain}/Create`
  }
  return 'https://www.bing.com/turing/conversation/create'
}

export async function createConversation(): Promise<ConversationResponse> {
  const createURL = await getCreateURL()
  const resp = await ofetch<ConversationResponse>(createURL, {
    headers: createHeaders(),
  })
  if (!resp) {
    throw new ChatError('Bing限制了你的访问，请求访问返回空内容，可以尝试更改魔法节点，或者调整配置中x-forwared-for的IP', ErrorCode.BING_RESPONSE_EMPTY)
  }
  if (resp.result.value !== 'Success') {
    const message = `${resp.result.value}: ${resp.result.message}`
    if (resp.result.value === 'UnauthorizedRequest') {
      throw new ChatError(message, ErrorCode.BING_UNAUTHORIZED)
    }
    if (resp.result.value === 'Forbidden') {
      const { bingApiDomain } = await getUserConfig()
      throw new ChatError(message, ErrorCode.BING_FORBIDDEN, bingApiDomain)
    }
    throw new Error(message)
  }
  return resp
}
