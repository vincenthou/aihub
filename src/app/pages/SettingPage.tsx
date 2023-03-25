import { useCallback, useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import Browser from 'webextension-polyfill'
import Button from '~app/components/Button'
import { Input } from '~app/components/Input'
import Select from '~app/components/Select'
import { getTokenUsage } from '~services/storage'
import { BingConversationStyle, getUserConfig, StartupPage, updateUserConfig, UserConfig } from '~services/user-config'
import { formatAmount, formatDecimal } from '~utils/format'
import { CHATBOTS } from '~app/consts'
import PagePanel from '../components/Page'

function KDB(props: { text: string }) {
  return (
    <kbd className="px-2 py-1.5 text-sm font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
      {props.text}
    </kbd>
  )
}

function getAPIHost(apiHost: string | undefined) {
  let newAPIHost: string | undefined = apiHost
  if (apiHost) {
    newAPIHost = apiHost.replace(/\/$/, '')
    if (!apiHost.startsWith('http')) {
      apiHost = 'https://' + apiHost
    }
  } else {
    newAPIHost = undefined
  }
  return newAPIHost
}

function SettingPage() {
  const [shortcuts, setShortcuts] = useState<string[]>([])
  const [userConfig, setUserConfig] = useState<UserConfig | undefined>(undefined)
  const [tokenUsed, setTokenUsed] = useState(0)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    Browser.commands.getAll().then((commands) => {
      for (const c of commands) {
        if (c.name === 'open-app' && c.shortcut) {
          console.log(c.shortcut)
          setShortcuts(c.shortcut ? [c.shortcut] : [])
        }
      }
    })
    getUserConfig().then((config) => setUserConfig(config))
    getTokenUsage().then((used) => setTokenUsed(used))
  }, [])

  const openShortcutPage = useCallback(() => {
    Browser.tabs.create({ url: 'chrome://extensions/shortcuts' })
  }, [])

  const updateConfigValue = useCallback(
    (update: Partial<UserConfig>) => {
      setUserConfig({ ...userConfig!, ...update })
      setDirty(true)
    },
    [userConfig],
  )

  const save = useCallback(async () => {
    await updateUserConfig({
      ...userConfig!,
      openaiApiHost: getAPIHost(userConfig?.openaiApiHost),
      bingApiDomain: getAPIHost(userConfig?.bingApiDomain),
    })
    toast.success('保存成功')
    setTimeout(() => history.back(), 500)
  }, [userConfig])

  if (!userConfig) {
    return null
  }

  return (
    <PagePanel title="全局设置">
      <div className="flex flex-col gap-8 mt-3 pr-3">
        <div className="flex flex-row justify-between items-center">
          <div>
            <p className="font-bold mb-2 text-xl">打开应用的快捷键</p>
            <div className="flex flex-row gap-1">
              {shortcuts.length ? shortcuts.map((s) => <KDB key={s} text={s} />) : '暂未设置'}
            </div>
          </div>
          <div>
            <Button text="调整快捷键" size="normal" onClick={openShortcutPage} />
          </div>
        </div>
        <div>
          <p className="font-bold mb-2 text-xl">应用默认打开AI</p>
          <div className="w-[200px]">
            <Select
              options={Object.entries(CHATBOTS).map(([key, value]) => ({
                name: value.name,
                value: key,
              }))}
              value={userConfig.startupPage}
              onChange={(v) => updateConfigValue({ startupPage: (v as StartupPage) })}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-bold text-xl">ChatGPT配置</p>
          <div className="flex flex-row gap-8">
            <div className="flex flex-col gap-1">
              <p className="font-medium text-base">
                API Key
                👉<a href='https://platform.openai.com/account/api-keys' target="_blank" rel="noreferrer">这里生成</a>
              </p>
              <Input
                className="w-[300px]"
                placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                value={userConfig.openaiApiKey}
                onChange={(e) => updateConfigValue({ openaiApiKey: e.currentTarget.value })}
                type="password"
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-medium text-base">API 域名</p>
              <Input
                className="w-[300px]"
                placeholder="https://api.openai.com"
                value={userConfig.openaiApiHost}
                onChange={(e) => updateConfigValue({ openaiApiHost: e.currentTarget.value })}
              />
            </div>
          </div>
          {tokenUsed > 0 && (
            <p className="text-sm">
              已使用: {formatDecimal(tokenUsed)} tokens (大概花费~{formatAmount((tokenUsed / 1000) * 0.002)})
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-bold text-xl">Bing配置</p>
          <div className="flex flex-row gap-8">
            <div className="flex flex-col gap-1">
              <p className="font-medium text-base">对话风格</p>
              <div className="w-[150px]">
                <Select
                  options={[
                    {
                      name: '创意',
                      value: BingConversationStyle.Creative,
                    },
                    {
                      name: '平衡',
                      value: BingConversationStyle.Balanced,
                    },
                    {
                      name: '精准',
                      value: BingConversationStyle.Precise,
                    },
                  ]}
                  value={userConfig.bingConversationStyle}
                  onChange={(v) => updateConfigValue({ bingConversationStyle: v })}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-medium text-base">
                API 域名
                <span className="font-normal text-xs bg-red-300 p-1">
                  ！注意不要使用任何不信任的人分享的地址
                </span>
              </p>
              <Input
                className="w-[300px]"
                placeholder="https://mydomain.com"
                value={userConfig.bingApiDomain}
                onChange={(e) => updateConfigValue({ bingApiDomain: e.currentTarget.value })}
              />
              <div className="font-normal text-xs bg-red-300 p-1">
                该方式会获取你的登录信息，所以请用自己的或者新账号
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-medium text-base">
                对话增强
                <span className="font-normal text-xs bg-blue-300 p-1">
                正常情况无需开启这个选项
                </span>
              </p>
              <div className="w-[150px]">
                <Select
                  options={[
                    {
                      name: '是',
                      value: 'true',
                    },
                    {
                      name: '否',
                      value: '',
                    },
                  ]}
                  value={userConfig.useBingChatHubProxy}
                  onChange={(v) => updateConfigValue({ useBingChatHubProxy: v })}
                />
                <div className="font-normal text-xs bg-red-300 p-1">
                  开启后每条对话消息也会使用API域名，仅在对话无法进行时开启
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Button color={dirty ? 'primary' : 'flat'} text="保存" className="w-fit mt-10 mb-5" onClick={save} />
      <Toaster position="top-right" />
    </PagePanel>
  )
}

export default SettingPage
