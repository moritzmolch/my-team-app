import { NavLink, Route, Routes } from 'react-router-dom'
import { DashboardPage } from './pages/DashboardPage'
import { PlayersPage } from './pages/PlayersPage'
import { SchedulePage } from './pages/SchedulePage'

const NAV_LINKS = [
  { to: '/', label: 'Players', end: true },
  { to: '/schedule', label: 'Schedule' },
  { to: '/dashboard', label: 'Dashboard' },
]

function navLinkClassName({ isActive }: { isActive: boolean }) {
  return `rounded-md px-3 py-1.5 text-sm font-medium ${
    isActive
      ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
      : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
  }`
}

function App() {
  return (
    <div className="mx-auto min-h-screen max-w-5xl px-4 py-6">
      <nav className="mb-6 flex gap-2">
        {NAV_LINKS.map(({ to, label, end }) => (
          <NavLink key={to} to={to} end={end} className={navLinkClassName}>
            {label}
          </NavLink>
        ))}
      </nav>
      <Routes>
        <Route path="/" element={<PlayersPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </div>
  )
}

export default App
