import { useEffect, useRef, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { toPng } from 'html-to-image'

const HISTORY_KEY = 'lva_qr_history'
const STYLE_PRESETS = [
  { name: 'Classic', fgColor: '#000000', bgColor: '#ffffff', borderColor: '#d6dce4' },
  { name: 'Navy + Orange', fgColor: '#1F3C68', bgColor: '#F7941D', borderColor: '#1F3C68' },
  { name: 'Orange + Navy', fgColor: '#F7941D', bgColor: '#1F3C68', borderColor: '#F7941D' },
  { name: 'Slate', fgColor: '#1B263B', bgColor: '#E8EEF6', borderColor: '#415A77' },
]

function App() {
  const [url, setUrl] = useState('')
  const [styleIndex, setStyleIndex] = useState(0)
  const [fgColor, setFgColor] = useState(STYLE_PRESETS[0].fgColor)
  const [bgColor, setBgColor] = useState(STYLE_PRESETS[0].bgColor)
  const [borderColor, setBorderColor] = useState(STYLE_PRESETS[0].borderColor)
  const [history, setHistory] = useState([])
  const [historyOpen, setHistoryOpen] = useState(true)
  const [studioOpen, setStudioOpen] = useState(true)
  const qrRef = useRef(null)

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(HISTORY_KEY)) || []
      if (Array.isArray(saved)) setHistory(saved)
    } catch {
      setHistory([])
    }
  }, [])

  const saveToHistory = () => {
    const normalized = url.trim()
    if (!normalized || history.includes(normalized)) return

    const newHistory = [normalized, ...history].slice(0, 10)
    setHistory(newHistory)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))
  }

  const clearAll = () => {
    setHistory([])
    localStorage.removeItem(HISTORY_KEY)
  }

  const downloadQr = async () => {
    if (!qrRef.current) return

    try {
      const dataUrl = await toPng(qrRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: bgColor,
      })

      const link = document.createElement('a')
      link.download = `LVA-QR-${Date.now()}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Failed to generate PNG', err)
    }
  }

  const applyStylePreset = (index) => {
    const preset = STYLE_PRESETS[index]
    setStyleIndex(index)
    setFgColor(preset.fgColor)
    setBgColor(preset.bgColor)
    setBorderColor(preset.borderColor)
  }

  const cycleStylePreset = () => {
    const nextIndex = (styleIndex + 1) % STYLE_PRESETS.length
    applyStylePreset(nextIndex)
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <button className="section-toggle" onClick={() => setHistoryOpen((open) => !open)} type="button">
          <span>History</span>
          <span>{historyOpen ? '−' : '+'}</span>
        </button>

        {historyOpen && (
          <>
            <div className="history-list">
              {history.map((item, i) => (
                <button key={`${item}-${i}`} onClick={() => setUrl(item)} className="history-item" type="button">
                  {item.length > 24 ? `${item.slice(0, 24)}...` : item}
                </button>
              ))}
            </div>

            <div className="color-section">
              <h4>Custom Colors</h4>
              <div className="quick-schemes">
                <button
                  className="scheme-btn"
                  onClick={() => {
                    applyStylePreset(1)
                  }}
                  type="button"
                >
                  Navy + Orange
                </button>
                <button
                  className="scheme-btn"
                  onClick={() => {
                    applyStylePreset(2)
                  }}
                  type="button"
                >
                  Orange + Navy
                </button>
              </div>
              <div className="color-row">
                <label htmlFor="dots-color">Dots</label>
                <input
                  id="dots-color"
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                />
              </div>
              <div className="color-row">
                <label htmlFor="bg-color">BG</label>
                <input
                  id="bg-color"
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                />
              </div>
              <div className="color-row">
                <label htmlFor="border-color">Border</label>
                <input
                  id="border-color"
                  type="color"
                  value={borderColor}
                  onChange={(e) => setBorderColor(e.target.value)}
                />
              </div>
            </div>

            <button className="clear-btn" onClick={clearAll} type="button">
              Clear All
            </button>
          </>
        )}
      </aside>

      <main className="main-content">
        <button className="section-toggle" onClick={() => setStudioOpen((open) => !open)} type="button">
          <span>QR Studio</span>
          <span>{studioOpen ? '−' : '+'}</span>
        </button>

        {studioOpen && (
          <>
            <div className="input-box">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL..."
              />
              <button onClick={() => setUrl('')} className="ghost-btn" type="button">
                Clear Input
              </button>
              <button onClick={saveToHistory} className="save-btn" type="button">
                Save to History
              </button>
            </div>

            <div className="preview-card">
              <div className="style-row">
                <span className="style-label">Style: {STYLE_PRESETS[styleIndex].name}</span>
                <button onClick={cycleStylePreset} className="style-btn" type="button">
                  Change QR Style
                </button>
              </div>
              <div
                ref={qrRef}
                className="qr-container"
                style={{ backgroundColor: bgColor, borderColor }}
              >
                <QRCodeSVG value={url || ' '} size={256} fgColor={fgColor} bgColor={bgColor} />
              </div>
              <p className="url-display">{url}</p>
              <button onClick={downloadQr} className="dl-btn" type="button">
                Download PNG
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default App
