import { useEffect, useState } from 'react'
import GlobeView from '../components/GlobeView'
import MarkerDetail from '../components/MarkerDetail'
import ThemeToggle from '../components/ThemeToggle'
import { isDemoMode, fetchMarkers } from '../lib/supabase'
import demoMarkers from '../data/demoMarkers'

export default function Home() {
  const [markers, setMarkers] = useState([])
  const [selected, setSelected] = useState(null)
  const [error, setError] = useState(null)
  const [rotateMode, setRotateMode] = useState('auto')

  useEffect(() => {
    if (isDemoMode) {
      setMarkers(demoMarkers)
      return
    }
    fetchMarkers()
      .then(setMarkers)
      .catch((e) => setError(e.message))
  }, [])

  const countries = new Set(markers.map((m) => m.country))

  return (
    <div className="relative h-full w-full overflow-hidden">
      <GlobeView
        markers={markers}
        onMarkerClick={setSelected}
        focus={selected ? { lat: selected.lat, lng: selected.lng } : null}
        autoRotate={rotateMode === 'auto' && !selected}
      />

      <header className="pointer-events-none absolute top-0 left-0 z-10 w-full p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-wide text-gray-900 drop-shadow-lg dark:text-white">
              旅行紀錄
            </h1>
            <p className="mt-1 text-sm text-gray-600 drop-shadow dark:text-gray-300">
              足跡遍及 {countries.size} 個國家 · {markers.length} 段旅程
              {isDemoMode && ' ·(示範模式)'}
            </p>
          </div>
          <div className="pointer-events-auto flex items-center gap-2">
            <div
              className="flex overflow-hidden rounded-lg border border-gray-300 text-sm backdrop-blur dark:border-white/20"
              role="group"
              aria-label="地球操作模式"
            >
              <button
                type="button"
                onClick={() => setRotateMode('auto')}
                className={
                  rotateMode === 'auto'
                    ? 'bg-amber-500 px-3 py-1.5 font-medium text-gray-900'
                    : 'bg-white/70 px-3 py-1.5 text-gray-600 transition hover:bg-white dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/20'
                }
              >
                轉動
              </button>
              <button
                type="button"
                onClick={() => setRotateMode('manual')}
                className={
                  rotateMode === 'manual'
                    ? 'bg-amber-500 px-3 py-1.5 font-medium text-gray-900'
                    : 'bg-white/70 px-3 py-1.5 text-gray-600 transition hover:bg-white dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/20'
                }
              >
                手動
              </button>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {error && (
        <div className="absolute bottom-14 left-1/2 z-10 -translate-x-1/2 rounded-lg bg-red-500/90 px-4 py-2 text-sm text-white">
          載入失敗:{error}
        </div>
      )}

      {!selected && markers.length > 0 && (
        <p className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 text-sm text-gray-500 dark:text-gray-400">
          點擊地球上的標記,查看旅行紀錄
        </p>
      )}

      <footer className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 text-xs text-gray-500">
        © 2026 · fijjj
      </footer>

      <MarkerDetail marker={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
