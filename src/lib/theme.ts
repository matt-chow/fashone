import { useEffect, useState } from 'react'

export const THEMES = [
  { id: 'study', name: 'The Tailor\'s Study', note: 'Warm parchment, oxblood and bottle green.', swatch: ['#f4ecdc', '#7a1f2b', '#2f4a3a'] },
  { id: 'heritage', name: 'The Heritage Catalogue', note: 'Sepia mail-order pages and tan leather.', swatch: ['#f1e6cf', '#6b3f22', '#8a5a2e'] },
  { id: 'midnight', name: 'The Midnight Edition', note: 'Ink-blue evening pages with brass.', swatch: ['#131b2e', '#d1b26a', '#9fb3c8'] },
  { id: 'archive', name: 'The Modern Archive', note: 'Clean museum stock, rust and olive.', swatch: ['#efe9dd', '#a8461f', '#5d6236'] },
] as const
export type ThemeId = (typeof THEMES)[number]['id']

const KEY = 'fashone-theme'
const read = (): ThemeId => {
  try {
    const t = localStorage.getItem(KEY)
    return THEMES.some(x => x.id === t) ? (t as ThemeId) : 'study'
  } catch { return 'study' }
}

export function useTheme() {
  const [theme, setTheme] = useState<ThemeId>(read)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem(KEY, theme) } catch { /* private mode: theme lasts this visit */ }
  }, [theme])
  return [theme, setTheme] as const
}
