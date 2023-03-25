import Browser, { Cookies } from 'webextension-polyfill'
import { ChatResponseMessage } from './types'

export function convertMessageToMarkdown(message: ChatResponseMessage): string {
  if (message.messageType === 'InternalSearchQuery') {
    return message.text
  }
  for (const card of message.adaptiveCards) {
    for (const block of card.body) {
      if (block.type === 'TextBlock') {
        return block.text
      }
    }
  }
  return ''
}

const RecordSeparator = String.fromCharCode(30)

export const websocketUtils = {
  packMessage(data: any) {
    return `${JSON.stringify(data)}${RecordSeparator}`
  },
  unpackMessage(data: string | ArrayBuffer | Blob) {
    return data
      .toString()
      .split(RecordSeparator)
      .filter(Boolean)
      .map((s) => JSON.parse(s))
  },
}

interface Cookie {
  domain: string;
  name: string;
  value: string;
  path: string;
}

export async function copyCookies(proxyURL: string){
	const cookiesJSON: Cookie[] = [];
	const sourceDomains = [".bing.com"];
	for (let i = 0; i < sourceDomains.length; i++) {
		const cookies = await Browser.cookies.getAll({
			domain: sourceDomains[i]
		});
		cookies.map((item) => {
			cookiesJSON[cookiesJSON.length] = {
				domain: item.domain,
				name: item.name,
				value: item.value,
				path: item.path
			};
		});
	}
	for (const key in cookiesJSON) {
		await Browser.cookies.set({
			url: proxyURL,
			//domain: cookiesJSON[key].domain,
			name: cookiesJSON[key].name,
			value: cookiesJSON[key].value,
			path: cookiesJSON[key].path
		});
	}
}