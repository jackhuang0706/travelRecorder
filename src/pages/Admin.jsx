import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import GlobeView from '../components/GlobeView'
import MarkerForm from '../components/MarkerForm'
import ThemeToggle from '../components/ThemeToggle'
import { supabase, isDemoMode, fetchMarkers, MEDIA_BUCKET } from '../lib/supabase'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  const inputCls =
    'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-500 dark:focus:border-amber-400'

  return (
    <div className="relative flex h-full items-center justify-center p-6">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm space-y-4 rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-white/10 dark:bg-white/5 dark:shadow-none dark:backdrop-blur"
      >
        <h1 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
          管理後台登入
        </h1>
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputCls}
        />
        <input
          type="password"
          required
          placeholder="密碼"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputCls}
        />
        {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-amber-500 py-2.5 font-medium text-gray-900 hover:bg-amber-400 disabled:opacity-50"
        >
          {loading ? '登入中...' : '登入'}
        </button>
        <Link
          to="/"
          className="block text-center text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          ← 回到地球
        </Link>
      </form>
      <footer className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-gray-500">
        © 2026 · fijjj
      </footer>
    </div>
  )
}

export default function Admin() {
  const [session, setSession] = useState(null)
  const [checking, setChecking] = useState(true)
  const [markers, setMarkers] = useState([])
  const [pickedPoint, setPickedPoint] = useState(null)
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    if (isDemoMode) {
      setChecking(false)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setChecking(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session) loadMarkers()
  }, [session])

  async function loadMarkers() {
    try {
      setMarkers(await fetchMarkers())
    } catch (e) {
      console.error(e)
    }
  }

  async function handleDelete(marker) {
    if (!confirm(`確定刪除「${marker.name}」?相關照片影音也會一併刪除。`)) return
    const paths = (marker.media || []).map((m) => m.path).filter(Boolean)
    if (paths.length > 0) {
      await supabase.storage.from(MEDIA_BUCKET).remove(paths)
    }
    const { error } = await supabase.from('markers').delete().eq('id', marker.id)
    if (error) alert(`刪除失敗:${error.message}`)
    if (editing?.id === marker.id) setEditing(null)
    loadMarkers()
  }

  async function handleDeleteMedia(media) {
    if (!confirm('確定刪除此檔案?')) return
    if (media.path) await supabase.storage.from(MEDIA_BUCKET).remove([media.path])
    await supabase.from('media').delete().eq('id', media.id)
    loadMarkers()
  }

  if (isDemoMode) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">尚未連接 Supabase</h1>
        <p className="max-w-md text-gray-500 dark:text-gray-400">
          請先在專案根目錄建立 <code className="text-amber-600 dark:text-amber-400">.env</code> 並填入
          <code className="text-amber-600 dark:text-amber-400"> VITE_SUPABASE_URL</code> 與
          <code className="text-amber-600 dark:text-amber-400"> VITE_SUPABASE_ANON_KEY</code>
          (參考 .env.example 與 README),即可使用管理後台。
        </p>
        <Link to="/" className="text-amber-600 hover:underline dark:text-amber-400">← 回到地球</Link>
      </div>
    )
  }

  if (checking) return null
  if (!session) return <Login />

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b border-gray-200 px-6 py-3 dark:border-white/10">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">旅行紀錄 · 管理後台</h1>
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            前台預覽
          </Link>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-500">{session.user.email}</span>
          <ThemeToggle />
          <button
            onClick={() => supabase.auth.signOut()}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-gray-600 hover:bg-gray-100 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/10"
          >
            登出
          </button>
        </div>
      </header>

      <div className="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-2">
        <div className="relative flex flex-col overflow-hidden border-r border-gray-200 dark:border-white/10">
          <p className="border-b border-gray-200 px-4 py-2 text-sm text-gray-500 dark:border-white/10 dark:text-gray-400">
            在地球上點擊,紅色標記即為新標記的位置;或用右側 Google 地圖搜尋取得精確座標
          </p>
          <div className="min-h-[300px] flex-1">
            <GlobeView
              markers={markers}
              tempPoint={pickedPoint}
              onGlobeClick={({ lat, lng }) => setPickedPoint({ lat, lng })}
              onMarkerClick={(m) => setEditing(m)}
            />
          </div>
        </div>

        <div className="overflow-y-auto p-6">
          <MarkerForm
            editing={editing}
            pickedPoint={pickedPoint}
            onCancelEdit={() => setEditing(null)}
            onSaved={() => {
              setEditing(null)
              setPickedPoint(null)
              loadMarkers()
            }}
          />

          <hr className="my-6 border-gray-200 dark:border-white/10" />

          <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
            已有標記({markers.length})
          </h2>
          <ul className="space-y-3">
            {markers.map((m) => (
              <li
                key={m.id}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {m.name}
                      <span className="ml-2 text-xs text-amber-600 dark:text-amber-400">{m.country}</span>
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      ({m.lat.toFixed(3)}, {m.lng.toFixed(3)})
                      {m.travel_start && ` · ${m.travel_start}`}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2 text-sm">
                    <button onClick={() => setEditing(m)} className="text-amber-600 hover:underline dark:text-amber-400">
                      編輯
                    </button>
                    <button onClick={() => handleDelete(m)} className="text-red-500 hover:underline dark:text-red-400">
                      刪除
                    </button>
                  </div>
                </div>
                {(m.media || []).length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {m.media.map((md) => (
                      <div key={md.id} className="group relative">
                        {md.type === 'image' ? (
                          <img src={md.url} alt="" className="h-16 w-16 rounded-lg object-cover" />
                        ) : (
                          <video src={md.url} className="h-16 w-16 rounded-lg object-cover" />
                        )}
                        <button
                          onClick={() => handleDeleteMedia(md)}
                          className="absolute -top-1.5 -right-1.5 hidden h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white group-hover:flex"
                          title="刪除檔案"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <footer className="border-t border-gray-200 py-2 text-center text-xs text-gray-500 dark:border-white/10">
        © 2026 · fijjj
      </footer>
    </div>
  )
}
