import { Menu, Transition } from '@headlessui/react'
import { FC, Fragment } from 'react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { CHATBOTS } from '~/app/consts'
import { BotId, BotProps } from '~types'
import NavLink from '../NavLink'

interface Props {
  mode: string
  botId: BotId
  onChange: (botProps: BotProps) => void
}

const compactItemClassName = 'flex h-10 px-3 py-1 items-center cursor-pointer rounded-md'

const BotSwitcher: FC<Props> = (props) => {
  const { mode, botId, onChange } = props

  return (
    <div className="z-10 relative text-right">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-1 py-1 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            <ChevronDownIcon
              className="h-5 w-5 hover:text-violet-100"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="bg-white dark:bg-gray-600 absolute right-0 mt-2 w-40 origin-top-right rounded-md shadow-lg focus:outline-none">
            {Object.entries(CHATBOTS).map(([key, value]) => (
              <Menu.Item key={key}>
                {({ close }) => (
                  mode === "compact" ? (
                    <div
                      className={`${compactItemClassName} ${botId === key ? 'bg-white/70 dark:bg-gray-500' : ''}`}
                      onClick={() => {
                        onChange(value)
                        close()
                      }}
                    >
                      {value.avatar ? (
                        <img
                          src={value.avatar}
                          className="w-5 h-5 object-contain rounded-full mr-2"
                        />
                      ) : null}
                      <span className="dark:text-white">{value.name}</span>
                    </div>
                  ) : <NavLink bot={value} onClick={() => {
                    onChange(value)
                    close()
                  }} />
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

export default BotSwitcher