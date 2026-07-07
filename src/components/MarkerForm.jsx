import { useEffect, useState } from 'react'
import { supabase, MEDIA_BUCKET } from '../lib/supabase'

const EMPTY = {
  name: '',
  country: '',
  lat: '',
  lng: '',
  description: '',
  travel_start: '',
  travel_end: '',
}

// 從 Google 地圖複製的內容解析經緯度,支援:
// 1. 純座標 "25.0330, 121.5654"
// 2. 網址中的 @lat,lng
// 3. 地點網址中的 !3d<lat>!4d<lng>
function parseGoogleMapsCoords(text) {
  let m = text.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/)
  if (m) return { lat: Number(m[1]), lng: Number(m[2]) }
  m = text.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/)
  if (m) return { lat: Number(m[1]), lng: Number(m[2]) }
  m = text.match(/(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/)
  if (m) return { lat: Number(m[1]), lng: Number(m[2]) }
  return null
}

export default function MarkerForm({ editing, pickedPoint, onSaved, onCancelEdit }) {
  const [form, setForm] = useState(EMPTY)
  const [files, setFiles] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [mapQuery, setMapQuery] = useState('')
  const [pasteStatus, setPasteStatus] = useState(null)

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name || '',
        country: editing.country || '',
        lat: editing.lat,
        lng: editing.lng,
        description: editing.description || '',
        travel_start: editing.travel_start || '',
        travel_end: editing.travel_end || '',
      })
    } else {
      setForm(EMPTY)
    }
    setFiles([])
  }, [editing])

  useEffect(() => {
    if (pickedPoint) {
      setForm((f) => ({
        ...f,
        lat: pickedPoint.lat.toFixed(5),
        lng: pickedPoint.lng.toFixed(5),
      }))
    }
  }, [pickedPoint])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  function openGoogleMaps() {
    const q = mapQuery.trim()
    if (!q) return
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`,
      '_blank'
    )
  }

  function handlePasteCoords(e) {
    const text = e.target.value
    if (!text.trim()) {
      setPasteStatus(null)
      return
    }
    const coords = parseGoogleMapsCoords(text)
    if (coords) {
      setForm((f) => ({ ...f, lat: coords.lat, lng: coords.lng }))
      setPasteStatus({ ok: true, msg: `已填入座標(${coords.lat}, ${coords.lng})` })
      e.target.value = ''
    } else {
      setPasteStatus({ ok: false, msg: '無法辨識,請貼上座標(如 25.033, 121.565)或 Google 地圖網址' })
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!form.name || !form.country || form.lat === '' || form.lng === '') {
      setError('請填寫名稱、國家,並在地球上點選位置或由 Google 地圖取得座標')
      return
    }

    setSaving(true)
    try {
      const payload = {
        name: form.name,
        country: form.country,
        lat: Number(form.lat),
        lng: Number(form.lng),
        description: form.description,
        travel_start: form.travel_start || null,
        travel_end: form.travel_end || null,
      }

      let markerId = editing?.id
      if (editing) {
        const { error } = await supabase.from('markers').update(payload).eq('id', editing.id)
        if (error) throw error
      } else {
        const { data, error } = await supabase.from('markers').insert(payload).select().single()
        if (error) throw error
        markerId = data.id
      }

      for (const file of files) {
        const path = `${markerId}/${Date.now()}-${file.name}`
        const { error: upErr } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file)
        if (upErr) throw upErr
        const { data: pub } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path)
        const { error: mediaErr } = await supabase.from('media').insert({
          marker_id: markerId,
          type: file.type.startsWith('video') ? 'video' : 'image',
          url: pub.publicUrl,
          path,
        })
        if (mediaErr) throw mediaErr
      }

      setForm(EMPTY)
      setFiles([])
      setPasteStatus(null)
      onSaved?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const inputCls =
    'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-500 dark:focus:border-amber-400'
  const labelCls = 'mb-1 block text-sm text-gray-500 dark:text-gray-400'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {editing ? '編輯標記' : '新增標記'}
        </h2>
        {editing && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            取消編輯
          </button>
        )}
      </div>

      <div>
        <label className={labelCls}>地點名稱 *</label>
        <input className={inputCls} value={form.name} onChange={set('name')} placeholder="例:京都紅葉散策" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className={labelCls}>國家 *</label>
          <input className={inputCls} value={form.country} onChange={set('country')} placeholder="日本" />
        </div>
        <div>
          <label className={labelCls}>緯度 *</label>
          <input className={inputCls} value={form.lat} onChange={set('lat')} placeholder="點地球選取" />
        </div>
        <div>
          <label className={labelCls}>經度 *</label>
          <input className={inputCls} value={form.lng} onChange={set('lng')} placeholder="點地球選取" />
        </div>
      </div>

      <div className="space-y-2 rounded-xl border border-gray-300 bg-gray-50 p-3 dark:border-white/10 dark:bg-white/5">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">📍 從 Google 地圖取得精確座標</p>
        <div className="flex gap-2">
          <input
            className={inputCls}
            value={mapQuery}
            onChange={(e) => setMapQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                openGoogleMaps()
              }
            }}
            placeholder="輸入地點名稱,例:東京鐵塔"
          />
          <button
            type="button"
            onClick={openGoogleMaps}
            className="shrink-0 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500"
          >
            開啟 Google 地圖
          </button>
        </div>
        <input
          className={inputCls}
          onChange={handlePasteCoords}
          placeholder="再把地圖上的座標或網址貼到這裡,自動填入經緯度"
        />
        {pasteStatus && (
          <p className={`text-xs ${pasteStatus.ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
            {pasteStatus.msg}
          </p>
        )}
        <p className="text-xs text-gray-500">
          小技巧:在 Google 地圖上對目標位置按「右鍵」,點選最上方的座標即可複製。
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>旅遊開始日</label>
          <input type="date" className={inputCls} value={form.travel_start} onChange={set('travel_start')} />
        </div>
        <div>
          <label className={labelCls}>旅遊結束日</label>
          <input type="date" className={inputCls} value={form.travel_end} onChange={set('travel_end')} />
        </div>
      </div>

      <div>
        <label className={labelCls}>文字紀錄</label>
        <textarea
          className={inputCls}
          rows={5}
          value={form.description}
          onChange={set('description')}
          placeholder="寫下這段旅程的回憶..."
        />
      </div>

      <div>
        <label className={labelCls}>上傳照片 / 影音(可多選)</label>
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={(e) => setFiles([...e.target.files])}
          className="block w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-amber-500 file:px-4 file:py-2 file:text-sm file:font-medium file:text-gray-900 hover:file:bg-amber-400 dark:text-gray-400"
        />
        {files.length > 0 && (
          <p className="mt-1 text-xs text-gray-500">已選 {files.length} 個檔案</p>
        )}
      </div>

      {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-lg bg-amber-500 py-2.5 font-medium text-gray-900 transition hover:bg-amber-400 disabled:opacity-50"
      >
        {saving ? '儲存中...' : editing ? '更新標記' : '新增標記'}
      </button>
    </form>
  )
}
