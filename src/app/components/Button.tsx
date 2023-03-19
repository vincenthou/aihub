import cx from 'classnames'
import { ButtonHTMLAttributes, FC, PropsWithChildren } from 'react'
import { BeatLoader } from 'react-spinners'

interface Props {
  text?: string
  className?: string
  color?: 'primary' | 'flat'
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type']
  onClick?: () => void
  isLoading?: boolean
  isRound?: boolean
  size?: 'small' | 'normal'
}

const Button: FC<PropsWithChildren<Props>> = (props) => {
  const size = props.size || 'normal'
  return (
    <button
      type={props.type}
      className={cx(
        props.isRound ? 'rounded-[60px]' : '',
        size === 'normal' ? 'text-base font-medium px-2 py-2' : 'rounded-[30px] text-sm px-4 py-1',
        props.color === 'primary' ? 'text-white bg-[#4987FC]' : 'text-[#303030] bg-[#F2F2F2]',
        props.className,
      )}
      onClick={props.onClick}
    >
      {props.isLoading ? (
        <BeatLoader size={size === 'normal' ? 10 : 5} color={props.color === 'primary' ? 'white' : '#303030'} />
      ) : (
        props.children || props.text
      )}
    </button>
  )
}

export default Button
