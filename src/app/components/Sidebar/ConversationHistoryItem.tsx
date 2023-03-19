import { FC } from 'react'
import cx from 'classnames'
import { Link } from '@tanstack/react-router'
import { BsChatLeft } from 'react-icons/bs'
import { RiDeleteBinLine } from 'react-icons/ri'
import { BotId } from '~types'

interface Props {
  botId: BotId
  id: string
  chatId?: string
  name?: string
  remove: (id: string) => void
}

const ConversationHistoryItem: FC<Props> = (props) => {
  const onRemove = () => props.remove(props.id)

  return (
    <div className="flex-col flex-1 overflow-y-auto hidden-scroll-bar">
      <div className="flex flex-col gap-2 text-gray-100 text-sm">
        <button className={cx(
          'text-white/50 dark:text-white hover:bg-gray-600  bg-gray-800',
          props.id === props.chatId ? 'bg-gray-600' : '',
          'flex px-3 items-center relative rounded-md break-all group'
        )}>
          <Link
            className="flex py-3 gap-3 cursor-pointer flex-1"
            to="/chat/$botId"
            params={{ botId: props.botId }}
            search={{ chatId: props.id }}
          >
            <BsChatLeft size={16} />
            <div className="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative text-left text-xs">
              {props.name || '未命名对话'}
            </div>
          </Link>
          <RiDeleteBinLine size={16} onClick={onRemove} />
        </button>
      </div>
    </div>
  )
}

export default ConversationHistoryItem
