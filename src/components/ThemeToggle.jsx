import { useEffect, useState } from 'react'

export default function ThemeToggle({ className = '' }) {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <button
      type="button"
      aria-label="切換亮暗模式"
      onClick={() => setDark(!dark)}
      className={`flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white/70 text-base backdrop-blur transition hover:bg-white dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20 ${className}`}
    >
      {dark ? '☀️' : '🌙'}
    </button>
  )
}
