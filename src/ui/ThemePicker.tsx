import { Palette } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { THEMES, useTheme } from '../lib/theme'

export function ThemePicker() {
  const [theme, setTheme] = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (e: Event) => { if (e instanceof KeyboardEvent ? e.key === 'Escape' : !ref.current?.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', close)
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', close) }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button className="btn btn-quiet px-2.5" aria-haspopup="true" aria-expanded={open} onClick={() => setOpen(o => !o)} aria-label="Edition (colour theme)">
        <Palette size={18} aria-hidden />
      </button>
      {open && (
        <fieldset className="absolute right-0 top-12 z-40 w-72 origin-top-right border border-rule bg-paper-3 p-2 shadow-xl [animation:pop_160ms_var(--ease-out)]">
          <legend className="label px-2 pb-1 pt-2 text-ink-2 float-left">Choose an edition</legend>
          {THEMES.map(t => (
            <label key={t.id} className={`clear-left flex cursor-pointer items-center gap-3 px-2 py-2 hover:bg-paper-2 ${theme === t.id ? 'bg-paper-2' : ''}`}>
              <input type="radio" name="theme" className="sr-only" checked={theme === t.id} onChange={() => setTheme(t.id)} />
              <span className="flex shrink-0 overflow-hidden rounded-full border border-rule" aria-hidden>
                {t.swatch.map(c => <span key={c} className="h-6 w-3" style={{ background: c }} />)}
              </span>
              <span>
                <span className="block font-display leading-tight">{t.name}</span>
                <span className="block text-xs text-ink-2">{t.note}</span>
              </span>
            </label>
          ))}
        </fieldset>
      )}
    </div>
  )
}
