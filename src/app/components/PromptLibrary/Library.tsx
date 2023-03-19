import useSWR from 'swr'
import { Suspense } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../Tabs'
import { IoIosCloseCircleOutline } from 'react-icons/io'
import { addLocalPrompt, loadLocalPrompts, loadRemotePrompts, removeLocalPrompt } from '~services/prompts'
import Button from '../Button'
import { useCallback, useState } from 'react'
import { Input, Textarea } from '../Input'
import { uuid } from '~utils'
import { BeatLoader } from 'react-spinners'

const PromptItem = (props: {
  prompt: {
    title: string
    prompt: string
    contributor: string
  }
  remove?: () => void
  insertPrompt: (text: string) => void
}) => {
  const { prompt } = props
  return (
    <div className="group relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-5 py-4 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900">{prompt.title}</p>
        <p className="truncate text-xs font-medium text-gray-500">贡献者：{prompt.contributor || '为爱发电'}</p>
      </div>
      <div>
        <a
          className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 cursor-pointer"
          onClick={() => props.insertPrompt(prompt.prompt)}
        >
          使用
        </a>
      </div>
      {props.remove && (
        <IoIosCloseCircleOutline
          className="hidden group-hover:block absolute right-[-8px] top-[-8px] bg-white cursor-pointer"
          size={20}
          onClick={props.remove}
        />
      )}
    </div>
  )
}

function CreatePromptForm(props: { onSubmit: (title: string, prompt: string) => void }) {
  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      e.stopPropagation()
      const formdata = new FormData(e.currentTarget)
      const json = Object.fromEntries(formdata.entries())
      if (json.title && json.prompt) {
        props.onSubmit(json.title as string, json.prompt as string)
      }
    },
    [props],
  )
  return (
    <form className="flex flex-col gap-2 w-1/2" onSubmit={onSubmit}>
      <div className="w-full">
        <span className="text-sm font-semibold block mb-1">Prompt Title</span>
        <Input className="w-full" name="title" />
      </div>
      <div className="w-full">
        <span className="text-sm font-semibold block mb-1">Prompt Content</span>
        <Textarea className="w-full" name="prompt" />
      </div>
      <Button color="primary" text="Create" className="w-fit" size="small" type="submit" />
    </form>
  )
}

function LocalPrompts(props: { insertPrompt: (text: string) => void }) {
  const [showForm, setShowForm] = useState(false)
  const localPromptsQuery = useSWR('local-prompts', () => loadLocalPrompts(), { suspense: true })

  const createPrompt = useCallback(
    async (title: string, prompt: string) => {
      await addLocalPrompt({ id: uuid(), title, prompt })
      localPromptsQuery.mutate()
      setShowForm(false)
    },
    [localPromptsQuery],
  )

  const removePrompt = useCallback(
    async (id: string) => {
      await removeLocalPrompt(id)
      localPromptsQuery.mutate()
    },
    [localPromptsQuery],
  )

  return (
    <>
      {localPromptsQuery.data.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
          {localPromptsQuery.data.map((prompt) => (
            <PromptItem
              key={prompt.id}
              prompt={{ 
                title: prompt.title,
                prompt: prompt.prompt,
                contributor: '本地',
              }}
              remove={() => removePrompt(prompt.id)}
              insertPrompt={props.insertPrompt}
            />
          ))}
        </div>
      ) : (
        <div className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-3 text-center text-sm mt-5">
          你还没有本地咒语
        </div>
      )}
      <div className="mt-5">
        {showForm ? (
          <CreatePromptForm onSubmit={createPrompt} />
        ) : (
          <Button text="创建本地咒语" size="small" onClick={() => setShowForm(true)} />
        )}
      </div>
    </>
  )
}

function CommunityPrompts(props: { insertPrompt: (text: string) => void }) {
  const promptsQuery = useSWR('community-prompts', () => loadRemotePrompts(), { suspense: true })
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
        {promptsQuery.data.map((prompt, index) => (
          <PromptItem key={index} prompt={prompt} insertPrompt={props.insertPrompt} />
        ))}
      </div>
      <span className="text-sm mt-5 block">
        给社区咒语(prompts)做贡献👉{' '}
        <a
          href="https://vika.cn/share/shrNceaxJpLo3Te0QYzTL"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          提交我的咒语
        </a>
      </span>
    </>
  )
}

const PromptLibrary = (props: { insertPrompt: (text: string) => void }) => {
  return (
    <Tabs defaultValue="local" className="w-full">
      <TabsList>
        <TabsTrigger value="local">本地咒语</TabsTrigger>
        <TabsTrigger value="community">社区咒语</TabsTrigger>
      </TabsList>
      <TabsContent value="local">
        <Suspense fallback={<BeatLoader size={10} className="mt-5" />}>
          <LocalPrompts insertPrompt={props.insertPrompt} />
        </Suspense>
      </TabsContent>
      <TabsContent value="community">
        <Suspense fallback={<BeatLoader size={10} className="mt-5" />}>
          <CommunityPrompts insertPrompt={props.insertPrompt} />
        </Suspense>
      </TabsContent>
    </Tabs>
  )
}

export default PromptLibrary
