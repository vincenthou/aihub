export * from './chat'
export * from './bot'

export interface NotificationInfo {
  message: string
  link: string
  linkTitle: string
  show: boolean
}

export interface NotificationModel {
  announcement: NotificationInfo
  version: NotificationInfo
}

export type Notification = NotificationModel | null | undefined