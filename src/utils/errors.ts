export enum ErrorCode {
  CONVERSATION_LIMIT = 'CONVERSATION_LIMIT',
  UNKOWN_ERROR = 'UNKOWN_ERROR',
  CHATGPT_CLOUDFLARE = 'CHATGPT_CLOUDFLARE',
  CHATGPT_UNAUTHORIZED = 'CHATGPT_UNAUTHORIZED',
  BING_UNAUTHORIZED = 'BING_UNAUTHORIZED',
  BING_FORBIDDEN = 'BING_FORBIDDEN',
  BING_DOMAIN_INVALID = 'BING_DOMAIN_INVALID',
  API_KEY_NOT_SET = 'API_KEY_NOT_SET',
}

export class ChatError extends Error {
  code: ErrorCode
  extra?: string
  constructor(message: string, code: ErrorCode, extra?: string) {
    super(message)
    this.code = code
    if (extra) {
      this.extra = extra
    }
  }
}
