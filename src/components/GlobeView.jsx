import { useEffect, useMemo, useRef, useState } from 'react'
import Globe from 'react-globe.gl'

const PIN_SVG = `<svg viewBox="-4 0 36 36" fill="currentColor">
  <path d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"></path>
  <circle fill="black" fill-opacity="0.35" cx="14" cy="12.6" r="5.5"></circle>
</svg>`

export default function GlobeView({
  markers = [],
  onMarkerClick,
  onGlobeClick,
  tempPoint = null,
  focus = null,
  autoRotate = false,
}) {
  const globeRef = useRef()
  const containerRef = useRef()
  const [size, setSize] = useState({ width: 0, height: 0 })

  // 已儲存的標記 + 選點中的暫時標記(同樣的大頭針圖案,紅色區別)
  const pins = useMemo(
    () => (tempPoint ? [...markers, { ...tempPoint, __temp: true }] : markers),
    [markers, tempPoint]
  )

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ width, height })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const globe = globeRef.current
    if (!globe) return
    const controls = globe.controls()
    controls.autoRotate = autoRotate
    controls.autoRotateSpeed = 0.6
  }, [autoRotate, size.width])

  useEffect(() => {
    if (focus && globeRef.current) {
      globeRef.current.pointOfView({ lat: focus.lat, lng: focus.lng, altitude: 1.6 }, 1000)
    }
  }, [focus])

  return (
    <div ref={containerRef} className="h-full w-full">
      {size.width > 0 && (
        <Globe
          ref={globeRef}
          width={size.width}
          height={size.height}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
          atmosphereColor="#60a5fa"
          atmosphereAltitude={0.18}
          onGlobeClick={onGlobeClick}
          htmlElementsData={pins}
          htmlLat="lat"
          htmlLng="lng"
          htmlAltitude={0.01}
          htmlElement={(d) => {
            const el = document.createElement('div')
            el.innerHTML = PIN_SVG
            el.style.width = '26px'
            el.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))'
            if (d.__temp) {
              el.style.color = '#ef4444'
              el.style.pointerEvents = 'none'
            } else {
              el.style.color = '#f59e0b'
              el.style.pointerEvents = 'auto'
              el.style.cursor = 'pointer'
              el.title = `${d.name}(${d.country})`
              el.onclick = (e) => {
                e.stopPropagation()
                onMarkerClick?.(d)
              }
            }
            return el
          }}
        />
      )}
    </div>
  )
}
