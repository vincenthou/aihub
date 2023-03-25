import { Dialog } from '@headlessui/react'
import Button from '~app/components/Button'

interface Props {
  title: string
  isOpen: boolean
  onConfirm: () => void
  onClose: () => void
}

const ConfirmDialog = (props: Props) => {
  return (
    <Dialog open={props.isOpen} onClose={props.onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center">
          <Dialog.Panel className="mx-auto w-[400px] rounded-[30px] bg-white shadow-xl p-15 pt-5">
            <div className="text-center border-b border-solid border-[rgb(237,237,237)] flex flex-col justify-center pb-3 mb-5">
              <span className="font-semibold text-[#303030] text-lg">{props.title}</span>
            </div>
            <div className="ml-10">
              <Button
                color="primary"
                text="确定"
                className="w-fit mr-5 mb-5"
                onClick={props.onConfirm}
              />
              <Button
                color="flat"
                text="取消"
                className="w-fit mb-5"
                onClick={props.onClose}
              />
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  )
}

export default ConfirmDialog
