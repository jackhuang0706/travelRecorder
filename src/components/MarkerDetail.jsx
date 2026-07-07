import { useEffect, useState } from 'react'

function formatRange(start, end) {
  if (!start && !end) return null
  if (start && end && start !== end) return `${start} ~ ${end}`
  return start || end
}

// 全螢幕檢視:點入照片/影片後,可直接切換上一張或下一張
function Lightbox({ media, index, onClose, onNavigate }) {
  const current = media[index]
  const prev = () => onNavigate((index - 1 + media.length) % media.length)
  const next = () => onNavigate((index + 1) % media.length)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const navBtnCls =
    'absolute top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-3xl leading-none text-white shadow-lg backdrop-blur-sm transition hover:bg-black/80'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      {current.type === 'image' ? (
        <img
          src={current.url}
          alt=""
          onClick={(e) => e.stopPropagation()}
          className="max-h-[88vh] max-w-[92vw] rounded-lg object-contain"
        />
      ) : (
        <video
          key={current.id}
          src={current.url}
          controls
          autoPlay
          onClick={(e) => e.stopPropagation()}
          className="max-h-[88vh] max-w-[92vw] rounded-lg"
        />
      )}

      {media.length > 1 && (
        <>
          <button
            type="button"
            aria-label="上一張"
            onClick={(e) => {
              e.stopPropagation()
              prev()
            }}
            className={`${navBtnCls} left-4`}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="下一張"
            onClick={(e) => {
              e.stopPropagation()
              next()
            }}
            className={`${navBtnCls} right-4`}
          >
            ›
          </button>
          <span className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-sm text-white shadow-lg backdrop-blur-sm">
            {index + 1} / {media.length}
          </span>
        </>
      )}

      <button
        type="button"
        aria-label="關閉"
        onClick={onClose}
        className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-xl text-white shadow-lg backdrop-blur-sm transition hover:bg-black/80"
      >
        ✕
      </button>
    </div>
  )
}

export default function MarkerDetail({ marker, onClose }) {
  const [lightboxIndex, setLightboxIndex] = useState(null)

  useEffect(() => setLightboxIndex(null), [marker])

  if (!marker) return null
  const dateRange = formatRange(marker.travel_start, marker.travel_end)
  const images = (marker.media || []).filter((m) => m.type === 'image')
  const videos = (marker.media || []).filter((m) => m.type === 'video')
  // 依畫面顯示順序(先照片後影音)組成切換清單
  const allMedia = [...images, ...videos]
  const openLightbox = (item) => setLightboxIndex(allMedia.indexOf(item))

  return (
    <aside className="absolute top-0 right-0 z-20 flex h-full w-full flex-col border-l border-gray-200 bg-white/95 shadow-2xl backdrop-blur-md md:w-3/4 dark:border-white/10 dark:bg-gray-950/90">
      <div className="flex items-start justify-between gap-4 border-b border-gray-200 p-5 dark:border-white/10">
        <div>
          <div className="mb-1 inline-block rounded-full bg-amber-500/20 px-3 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300">
            {marker.country}
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{marker.name}</h2>
          {dateRange && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">🗓 {dateRange}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
          aria-label="關閉"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-5">
        {marker.description && (
          <p className="max-w-prose whitespace-pre-wrap leading-relaxed text-gray-700 dark:text-gray-200">
            {marker.description}
          </p>
        )}

        {images.length > 0 && (
          <section>
            <h3 className="mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400">照片及影音</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
              {images.map((m) => (
                <button key={m.id} type="button" onClick={() => openLightbox(m)}>
                  <img
                    src={m.url}
                    alt=""
                    loading="lazy"
                    className="aspect-[4/3] w-full cursor-pointer rounded-lg object-cover transition hover:opacity-80"
                  />
                </button>
              ))}
            </div>
          </section>
        )}

        {videos.length > 0 && (
          <section>
            <h3 className="mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400">影音</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {videos.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => openLightbox(m)}
                  className="group relative block w-full cursor-pointer"
                >
                  <video src={m.url} preload="metadata" muted className="w-full rounded-lg" />
                  <span className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/25 transition group-hover:bg-black/40">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/85 pl-1 text-2xl text-gray-900">
                      ▶
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          media={allMedia}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </aside>
  )
}
