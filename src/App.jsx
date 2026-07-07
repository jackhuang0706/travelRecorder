import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

const Home = lazy(() => import('./pages/Home'))
const Admin = lazy(() => import('./pages/Admin'))

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center text-gray-400">
          載入中...
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Suspense>
  )
}
