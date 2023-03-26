import { ofetch } from 'ofetch'
import { Notification } from '~types'

export async function loadRemoteNotifications() {
  return ofetch<Notification>('https://15bddu875x.hk.aircode.run/notify').catch((err) => {
    console.error('Failed to load remote notification', err)
    return null
  })
}
