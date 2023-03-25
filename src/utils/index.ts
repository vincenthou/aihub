import Browser from 'webextension-polyfill'
import { v4 } from 'uuid'

interface Cookie {
  domain: string;
  name: string;
  value: string;
  path: string;
}

export function uuid() {
  return v4()
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
