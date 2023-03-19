import {
  createHashHistory,
  ReactRouter,
  RootRoute,
  Route,
  useParams,
  useSearch,
  useRouter
} from '@tanstack/react-router'
import { BotId } from '~/types'
import Layout from './components/Layout'
import MultiBotChatPanel from './pages/MultiBotChatPanel'
import SettingPage from './pages/SettingPage'
import { SingleBotChatPanel, HistorySingleBotChatPanel } from './pages/SingleBotChatPanel'

const rootRoute = new RootRoute()

const layoutRoute = new Route({
  getParentRoute: () => rootRoute,
  component: Layout,
  id: 'layout',
})

const indexRoute = new Route({
  getParentRoute: () => layoutRoute,
  path: '/',
  component: MultiBotChatPanel,
})

function ChatRoute() {
  const { botId } = useParams({ from: chatRoute.id })
  const { chatId } = useSearch({ from: chatRoute.id })

  if (chatId) {
    return <HistorySingleBotChatPanel botId={botId as BotId} chatId={chatId} />
  } else {
    return <SingleBotChatPanel botId={botId as BotId} />
  }
}

const chatRoute = new Route({
  getParentRoute: () => layoutRoute,
  path: 'chat/$botId',
  component: ChatRoute,
})

const settingRoute = new Route({
  getParentRoute: () => layoutRoute,
  path: 'setting',
  component: SettingPage,
})

const routeTree = rootRoute.addChildren([layoutRoute.addChildren([indexRoute, chatRoute, settingRoute])])

const hashHistory = createHashHistory()
const router = new ReactRouter({ routeTree, history: hashHistory })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export { router }
