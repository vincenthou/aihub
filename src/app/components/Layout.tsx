import { Outlet } from '@tanstack/react-router'
import Sidebar from './Sidebar'

function Layout() {
  return (
    <div className="dark h-screen">
      <main className="bg-white dark:bg-gray-800 grid grid-cols-[20%_1fr] backdrop-blur-2xl h-full">
        <Sidebar />
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
