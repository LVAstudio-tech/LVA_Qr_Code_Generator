import { useState, useRef, useCallback, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { toPng } from 'html-to-image';
import Sidebar from './components/Sidebar';
import './App.css';

const DEFAULT_URL = 'https://www.lvastudio.tech/';
const STORAGE_KEY = 'qr_history';

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(history) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

function App() {
  const [inputValue, setInputValue] = useState(DEFAULT_URL);
  const [qrValue, setQrValue] = useState(DEFAULT_URL);
  const [fgColor, setFgColor] = useState('#ffffff');
  const [bgColor, setBgColor] = useState('#0f0f23');
  const [history, setHistory] = useState(loadHistory);
  const [downloading, setDownloading] = useState(false);
  const qrRef = useRef(null);

  const addToHistory = useCallback((url) => {
    if (!url.trim()) return;
    setHistory((prev) => {
      const filtered = prev.filter((item) => item !== url);
      const updated = [url, ...filtered].slice(0, 20);
      saveHistory(updated);
      return updated;
    });
  }, []);

  const handleGenerate = useCallback(() => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    setQrValue(trimmed);
    addToHistory(trimmed);
  }, [inputValue, addToHistory]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') handleGenerate();
    },
    [handleGenerate]
  );

  const handleHistorySelect = useCallback((url) => {
    setInputValue(url);
    setQrValue(url);
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const handleDownload = useCallback(async () => {
    if (!qrRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(qrRef.current, { pixelRatio: 3 });
      const link = document.createElement('a');
      link.download = 'qr-code.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download QR code:', err);
    } finally {
      setDownloading(false);
    }
  }, []);

  // Generate on mount with default URL so history is populated
  useEffect(() => {
    if (history.length === 0) {
      addToHistory(DEFAULT_URL);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app">
      <Sidebar
        history={history}
        onSelect={handleHistorySelect}
        onClear={handleClearHistory}
      />

      <main className="main">
        <header className="main__header">
          <div className="main__logo">
            <span className="main__logo-icon">◈</span>
            <span className="main__logo-text">LVA QR Generator</span>
          </div>
        </header>

        <div className="main__content">
          {/* Input row */}
          <section className="card input-card">
            <label className="input-label" htmlFor="url-input">
              URL / Text
            </label>
            <div className="input-row">
              <input
                id="url-input"
                className="url-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="https://example.com"
                spellCheck={false}
              />
              <button className="btn btn--primary" onClick={handleGenerate}>
                Generate
              </button>
            </div>
          </section>

          <div className="lower-grid">
            {/* QR Preview */}
            <section className="card preview-card">
              <h2 className="card__title">Preview</h2>
              <div
                className="qr-wrapper"
                ref={qrRef}
                style={{ background: bgColor, padding: '24px', borderRadius: '12px' }}
              >
                <QRCode
                  value={qrValue || ' '}
                  size={220}
                  fgColor={fgColor}
                  bgColor={bgColor}
                  style={{ width: '100%', height: 'auto' }}
                  viewBox="0 0 256 256"
                />
              </div>
              <p className="qr-url" title={qrValue}>{qrValue}</p>
              <button
                className="btn btn--download"
                onClick={handleDownload}
                disabled={downloading}
              >
                {downloading ? 'Saving…' : '⬇ Download PNG'}
              </button>
            </section>

            {/* Color customization */}
            <section className="card colors-card">
              <h2 className="card__title">Colors</h2>

              <div className="color-option">
                <label className="color-label" htmlFor="fg-color">
                  <span className="color-swatch" style={{ background: fgColor }} />
                  Foreground (dots)
                </label>
                <input
                  id="fg-color"
                  type="color"
                  className="color-picker"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                />
              </div>

              <div className="color-option">
                <label className="color-label" htmlFor="bg-color">
                  <span className="color-swatch" style={{ background: bgColor }} />
                  Background
                </label>
                <input
                  id="bg-color"
                  type="color"
                  className="color-picker"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                />
              </div>

              <button
                className="btn btn--ghost reset-btn"
                onClick={() => { setFgColor('#ffffff'); setBgColor('#0f0f23'); }}
              >
                Reset Colors
              </button>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
