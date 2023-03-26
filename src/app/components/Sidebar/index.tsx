import { FC, useContext, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import cx from 'classnames'
import fileDownload from 'js-file-download';
import toast, { Toaster } from 'react-hot-toast'
import { MdOutlineFeedback, MdHelp } from 'react-icons/md'
import { AiFillSetting, AiFillDelete, AiFillInfoCircle } from 'react-icons/ai'
import { AiOutlineMenuUnfold, AiOutlineMenuFold } from 'react-icons/ai'
import { BiImport, BiExport } from 'react-icons/bi'
import logo from '~/assets/logo.svg'
import logoDark from '~/assets/logo-dark.svg'
import { ConversationsContext } from '~app/context'
import Tooltip from '~app/components/Tooltip'
import { ChatConversation } from '~types'
import ConfirmDialog from './ConfirmDialog'
import ConversationHistoryItem from './ConversationHistoryItem'

let conversationsCache: ChatConversation[] = []

const Sidebar: FC<{ chatId?: string }> = (props) => {
  const conversations = useContext(ConversationsContext)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)
  const [isShown, setIsShown] = useState(true)

  const toggleSidebar = () => setIsShown(!isShown)

  const onImport = () => {
    if (inputRef.current) {
      const reader = new FileReader();
      reader.onload = function fileReadCompleted() {
        if (reader.result) {
          // 先缓存下等用户确认
          try {
            conversationsCache = JSON.parse(reader.result.toString())
            setIsImportDialogOpen(true)
          } catch (err) {
            console.error(err)
            toast.error('导入文件不是JSON格式，请确认文件是否损坏')
          }
        }
      }
      if (inputRef.current?.files) {
        reader.readAsText(inputRef.current?.files[0]);
      } else {
        toast.error('加载文件失败，请刷新重试')
      }
    }
  }

  const onDelete = () => setIsResetDialogOpen(true)

  const onExport = () => {
    if (conversations?.query.data) {
      fileDownload(JSON.stringify(conversations?.query.data), '所有历史对话记录.json')
    }
  }

  const onConfirmImport = async () => {
    await conversations?.importAll(conversationsCache)
    toast.success('导入文件成功')
    setIsImportDialogOpen(false)
  }

  const onConfirmReset = async () => {
    await conversations?.removeAll()
    toast.success('清空本地对话记录成功')
    setIsResetDialogOpen(false)
  }

  const onClose = () => {
    setIsImportDialogOpen(false)
    setIsResetDialogOpen(false)
  }

  const version = conversations?.notifications?.data?.version

  return (
    <div className="relative h-full">
      <div className="absolute right-[-30px] top-[50%] cursor-pointer z-10">
      {
        isShown ? (
          <AiOutlineMenuFold size="1.5em" color="#fff" onClick={toggleSidebar} />
        ) : (
          <AiOutlineMenuUnfold size="1.5em" color="#fff" onClick={toggleSidebar} />
        )
      }
      </div>
      <aside
        className={cx(
          'flex h-full flex-1 flex-col space-y-1 p-2 transition-all',
          isShown ? 'opacity-100' : 'opacity-0 w-0 p-0'
        )}
      >
        <div className="flex justify-between py-2">
          <Link to="/">
            <img src={logo} className="h-8 block dark:hidden" />
            <img src={logoDark} className="h-8 hidden dark:block" />
          </Link>
          <p className="text-white text-xs flex-1 ml-2">
            基于<a className="underline" href="https://github.com/chathub-dev/chathub" target="_blank" rel="noreferrer">开源项目</a>增强
            <br></br>
            由<a className="underline" href="https://space.bilibili.com/1532854091" target="_blank" rel="noreferrer">AI乐桃为💗发电</a>
          </p>
          <div className="flex flex-row mt-1 ml-3 gap-[10px]">
            <Tooltip content="给我反馈">
              <a href="https://vika.cn/share/shrQUgYknjwPQXsjzCmQi" target="_blank" rel="noreferrer" >
                <MdOutlineFeedback size="1.5em" color="#fff"/>
              </a>
            </Tooltip>
            <Tooltip content="常见问题">
              <a href="https://seigy6zzam.feishu.cn/docx/KTp7dtDJZoSbbFxxmUpcUfXznhc" target="_blank" rel="noreferrer" >
                <MdHelp size="1.5em" color="#fff" />
              </a>
            </Tooltip>
            <Tooltip content="全局配置">
              <Link to="/setting">
                <AiFillSetting size="1.5em" color="#fff" />
              </Link>
            </Tooltip>
          </div>
        </div>
        <div
          className="flex-col flex-1 py-3 overflow-y-auto border-b border-white/20"
          style={{
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
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
        <div className="flex justify-between py-2 border-b border-white/20">
          <p className="text-white text-xs flex-1 ml-2">
            历史对话管理（导入、导出和删除）
          </p>
          <label htmlFor="import">
            <BiExport
              className="mr-2 cursor-pointer"
              size="1.5em"
              color="#fff"
              title="导入历史对话"
            />
          </label>
          <input
            id="import"
            type="file"
            accept=".json"
            ref={inputRef}
            onChange={onImport}
            style={{ opacity: 0, height: 1, width: 1 }}
          />
          <ConfirmDialog
            title="确定导入所有对话？本地历史对话会被覆盖"
            isOpen={isImportDialogOpen}
            onConfirm={onConfirmImport}
            onClose={onClose}
          />
          <Toaster position="top-right" />
          <BiImport
            className="mr-2 cursor-pointer"
            size="1.5em"
            color="#fff"
            title="导出历史对话"
            onClick={onExport}
          />
          <AiFillDelete
            className="cursor-pointer"
            size="1.5em"
            color="#fff"
            title="删除所有对话"
            onClick={onDelete}
          />
          <ConfirmDialog
            title="确定删除所有本地历史对话吗？"
            isOpen={isResetDialogOpen}
            onConfirm={onConfirmReset}
            onClose={onClose}
          />
        </div>
        {version?.show && <div className="flex justify-between py-2 text-white text-ms">
          <AiFillInfoCircle
            className="mr-2 cursor-pointer"
            size="1em"
            color="#fff"
            title="版本信息"
          />
          <p className="text-xs">
            {version?.message}
            <a
              className="text-xs underline"
              href={version?.link}
              target="_blank"
              rel="noreferrer"
            >
              {version?.linkTitle}
            </a>
          </p>
        </div>}
      </aside>
    </div>
  )
}

export default Sidebar
