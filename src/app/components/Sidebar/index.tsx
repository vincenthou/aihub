import { Link } from '@tanstack/react-router'
import cx from 'classnames'
import feedbackIcon from '~/assets/icons/feedback.svg'
import settingIcon from '~/assets/icons/setting.svg'
import logo from '~/assets/logo.svg'
import logoDark from '~/assets/logo-dark.svg'
import NavLink from '~app/components/Sidebar/NavLink'

function IconButton(props: { icon: string; active?: boolean }) {
  return (
    <div
      className={cx(
        'p-[6px] rounded-[10px] cursor-pointer hover:opacity-80',
        props.active ? 'bg-[#5E95FC]' : 'bg-[#F2F2F2] bg-opacity-20',
      )}
    >
      <img src={props.icon} className="w-5 h-5" />
    </div>
  )
}

function Sidebar() {
  return (
    <aside className="flex flex-col px-2">
      <div className="flex justify-between mt-3">
        <NavLink isAll>
          <img src={logo} className="w-10 block dark:hidden" />
          <img src={logoDark} className="w-10 hidden dark:block" />
        </NavLink>
        <div className="flex flex-row mt-1 ml-3 gap-[10px]">
          <a href="https://github.com/wong2/chathub/issues" target="_blank" rel="noreferrer" title="Feedback">
            <IconButton icon={feedbackIcon} />
          </a>
          <Link to="/setting">
            <IconButton icon={settingIcon} />
          </Link>
        </div>
      </div>
      <div className="mt-auto">
        <hr className="border-[#ffffff4d]" />
      </div>
    </aside>
  )
}

export default Sidebar
