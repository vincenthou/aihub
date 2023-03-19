import { FC, PropsWithChildren } from 'react'
import { Link } from '@tanstack/react-router'
import { BotProps } from '~types'

interface Props {
  bot?: BotProps
  isAll?: boolean
}

const commonClassName = 'hover:bg-white/70 dark:hover:bg-gray-500 flex h-10 items-center'

const NavLink: FC<PropsWithChildren<Props>> = (props) => {
  const { bot, isAll = false } = props

  return (
    <Link
      className={`${commonClassName} ${isAll ? '' : 'pl-3'}`}
      activeOptions={{ exact: true }}
      activeProps={{ className: 'bg-white/70 dark:bg-gray-500' }}
      // inactiveProps={{ className: 'bg-[#F2F2F2] bg-opacity-20' }}
      to={isAll ? '/' : `/chat/${bot?.id}`}
    >
      { bot?.avatar ? <img src={bot.avatar} className="w-5 h-5 object-contain rounded-full mr-2" /> : null}
      {props.children || <span className="text-dark dark:text-white font-medium text-sm">{bot?.name}</span>}
    </Link>
  )
}

export default NavLink
