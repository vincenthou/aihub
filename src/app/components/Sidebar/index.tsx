import { FC, useContext } from 'react'
import { Link } from '@tanstack/react-router'
import cx from 'classnames'
import { ConversationsContext } from '~app/context'
import { MdOutlineFeedback, MdHelp } from 'react-icons/md'
import { AiFillSetting } from 'react-icons/ai'
import logo from '~/assets/logo.svg'
import logoDark from '~/assets/logo-dark.svg'
import ConversationHistoryItem from './ConversationHistoryItem'
import { ChatConversation } from '~types'

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
          基于开源项目<br></br>可以免费使用
        </p>
        <div className="flex flex-row mt-1 ml-3 gap-[10px]">
          <a href="https://www.bilibili.com/video/BV1NM411p7CN/" target="_blank" rel="noreferrer" >
            <MdOutlineFeedback size="1.5em" color="#fff" title="给我反馈" />
          </a>
          <a href="https://seigy6zzam.feishu.cn/docx/KTp7dtDJZoSbbFxxmUpcUfXznhc" target="_blank" rel="noreferrer" >
            <MdHelp size="1.5em" color="#fff" title="常见问题" />
          </a>
          <Link to="/setting">
            <AiFillSetting size="1.5em" color="#fff" title="全局配置" />
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
