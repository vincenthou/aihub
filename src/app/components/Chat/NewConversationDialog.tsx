import { useState, SyntheticEvent } from 'react'
import { Dialog } from '@headlessui/react'
import Button from '~app/components/Button'
import { Input } from '~app/components/Input'

interface Props {
  isOpen: boolean
  onClose: () => void
  setName: (name: string) => void
}

const NewConversationDialog = (props: Props) => {
  const [name, setName] = useState('')
  const onChange = (e: SyntheticEvent<HTMLInputElement>) => setName(e.currentTarget.value)
  const onConfirm = () => props.setName(name)

  return (
    <Dialog open={props.isOpen} onClose={props.onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center">
          <Dialog.Panel className="mx-auto w-[800px] rounded-[30px] bg-white shadow-xl p-15 pt-5">
            <div className="text-center border-b border-solid border-[rgb(237,237,237)] flex flex-col justify-center pb-3 mb-5">
              <span className="font-semibold text-[#303030] text-lg">取个名字</span>
            </div>
            <div className="ml-10">
              <Input
                className="w-[300px]"
                placeholder="我自己起个名字"
                value={name}
                onChange={onChange}
              />
              <Button
                color="primary"
                text="确定"
                className="w-fit mt-10 mb-5"
                onClick={onConfirm}
              />
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  )
}

export default NewConversationDialog
