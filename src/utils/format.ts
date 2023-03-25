export function formatDecimal(value: number) {
  return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(value)
}

export function formatAmount(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

export function fillURL(targetURL: string, path: string) {
  let url = targetURL;
  if  (!url.endsWith('/'))  {
    url = url+'/';
  }
  url = url + path;
  return url;
}