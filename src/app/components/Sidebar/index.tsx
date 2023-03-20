import { FC, useContext } from 'react'
import { Link } from '@tanstack/react-router'
import cx from 'classnames'
import { ConversationsContext } from '~app/context'
import feedbackIcon from '~/assets/icons/feedback.svg'
import settingIcon from '~/assets/icons/setting.svg'
import logo from '~/assets/logo.svg'
import logoDark from '~/assets/logo-dark.svg'
import ConversationHistoryItem from './ConversationHistoryItem'
import { ChatConversation } from '~types'

function IconButton(props: { icon: string; active?: boolean }) {
  return (
    <div
      className={cx(
        'p-[3px] rounded-[4px] cursor-pointer hover:opacity-80',
        props.active ? 'bg-[#5E95FC]' : 'bg-[#F2F2F2] bg-opacity-20',
      )}
    >
      <img src={props.icon} className="w-5 h-5" />
    </div>
  )
}

const Sidebar: FC<{ chatId?: string }> = (props) => {
  const conversations = useContext(ConversationsContext)

  return (
    <aside className="flex flex-col px-2">
      <div className="flex justify-between py-2 border-b border-white/20">
        <Link to="/">
          <img src={logo} className="h-8 block dark:hidden" />
          <img src={logoDark} className="h-8 hidden dark:block" />
        </Link>
        <p className="text-white text-xs flex-1 ml-2">
          本项目基于开源项目搭建，可以免费使用
        </p>
        <div className="flex flex-row mt-1 ml-3 gap-[10px]">
          <a href="https://www.bilibili.com/video/BV1NM411p7CN/" target="_blank" rel="noreferrer" title="给我反馈">
            <IconButton icon={feedbackIcon} />
          </a>
          <Link to="/setting">
            <IconButton icon={settingIcon} />
          </Link>
        </div>
      </div>
      <div className="flex-1 py-3">
      {
        conversations?.query.data.length ? conversations?.query.data.map(
          (conversation: ChatConversation) => (
            <ConversationHistoryItem
              key={conversation.conversationId}
              id={conversation.conversationId}
              chatId={props.chatId}
              botId={conversation.botId}
              name={conversation?.name}
              remove={conversations.remove}
            />
          )
        ) : <p className="mt-5 flex justify-center text-dark text-sm dark:text-white/50">暂无历史对话</p>
      }
      </div>
    </aside>
  )
}

export default Sidebar
