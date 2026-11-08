import { Menu, Search, X } from 'lucide-react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { Suspense, useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, ScrollRestoration, useLocation } from 'react-router'
import { useStore } from '../lib/store'
import { SearchDialog } from './SearchDialog'
import { ThemePicker } from './ThemePicker'

export const NAV = [
  { to: '/handbook', label: 'Handbook', note: 'The curriculum, chapter by chapter' },
  { to: '/encyclopedia', label: 'Encyclopedia', note: 'Every garment, dissected' },
  { to: '/studio', label: 'Studio', note: 'Dress the figure' },
  { to: '/atlas', label: 'Atlas', note: 'Styles and traditions' },
  { to: '/practice', label: 'Practice', note: 'Exercises and challenges' },
]

export function Layout() {
  const [menu, setMenu] = useState(false)
  const [search, setSearch] = useState(false)
  const { pathname } = useLocation()
  const { status } = useStore()
  const main = useRef<HTMLElement>(null)

  const first = useRef(true)
  useEffect(() => {
    setMenu(false)
    // Move focus to the new page so screen readers announce it; skip the initial load.
    if (first.current) first.current = false
    else main.current?.focus({ preventScroll: true })
  }, [pathname])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && e.target.closest('input, textarea, select, [contenteditable]')
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) { e.preventDefault(); setSearch(true) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="label sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:bg-paper-3 focus:px-3 focus:py-2">Skip to content</a>
      <header className="sticky top-0 z-30 border-b border-rule bg-paper/92 backdrop-blur-[6px]">
        <div className="mx-auto flex h-16 max-w-[84rem] items-center gap-4 px-4 sm:px-6">
          <Link to="/" className="flex items-baseline gap-2 font-display text-[1.65rem] leading-none tracking-tight" aria-label="Fashone, home">
            Fashone
            <span className="label hidden text-ink-2 md:inline">Handbook of Men's Style</span>
          </Link>
          <nav aria-label="Main" className="ml-auto hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map(n => (
                <li key={n.to}>
                  <NavLink to={n.to} className={({ isActive }) => `label block px-3 py-2 transition-colors hover:text-accent ${isActive ? 'text-accent' : 'text-ink'}`}>
                    {({ isActive }) => <span className={isActive ? 'border-b border-accent pb-0.5' : ''}>{n.label}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="ml-auto flex items-center gap-1 lg:ml-2">
            <button className="btn btn-quiet px-2.5" onClick={() => setSearch(true)} aria-label="Search (press /)">
              <Search size={18} aria-hidden /> <span className="hidden sm:inline">Search</span>
              <kbd className="hidden rounded-sm border border-rule px-1.5 font-sans text-[0.7rem] text-ink-2 xl:inline">/</kbd>
            </button>
            <NavLink to="/saved" className={({ isActive }) => `label hidden px-3 py-2 hover:text-accent sm:block ${isActive ? 'text-accent' : ''}`}>Saved</NavLink>
            <ThemePicker />
            <button className="btn btn-quiet px-2.5 lg:hidden" onClick={() => setMenu(true)} aria-label="Open menu" aria-expanded={menu} aria-controls="drawer">
              <Menu size={20} aria-hidden />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menu && <Drawer onClose={() => setMenu(false)} onSearch={() => { setMenu(false); setSearch(true) }} />}
      </AnimatePresence>
      <SearchDialog open={search} onClose={() => setSearch(false)} />

      {status === 'memory' && (
        <p role="status" className="label border-b border-rule bg-paper-2 px-4 py-2 text-center text-ink-2">
          Storage is unavailable in this browser — saved outfits and progress will last only for this visit. Use Export on the Saved page to keep them.
        </p>
      )}

      <main id="main" ref={main} tabIndex={-1} className="outline-none">
        <Suspense fallback={<div className="min-h-[70vh]" aria-busy="true" />}>
          <motion.div key={pathname.split('/')[1]} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}>
            <Outlet />
          </motion.div>
        </Suspense>
      </main>
      <Footer />
      <ScrollRestoration />
    </MotionConfig>
  )
}

function Drawer({ onClose, onSearch }: { onClose: () => void; onSearch: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null
    ref.current?.querySelector<HTMLElement>('a, button')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && ref.current) {
        const f = [...ref.current.querySelectorAll<HTMLElement>('a, button')]
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f.at(-1)?.focus() }
        else if (!e.shiftKey && document.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; prev?.focus() }
  }, [onClose])
  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <motion.div className="absolute inset-0 bg-ink/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div
        ref={ref} id="drawer" role="dialog" aria-modal="true" aria-label="Menu"
        className="absolute inset-y-0 right-0 flex w-[min(22rem,88vw)] flex-col border-l border-rule bg-paper px-6 pb-8 pt-4 shadow-2xl"
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
      >
        <button className="btn btn-quiet ml-auto px-2.5" onClick={onClose} aria-label="Close menu"><X size={20} aria-hidden /></button>
        <nav aria-label="Main" className="mt-4">
          <ul className="divide-y divide-rule border-y border-rule">
            {[...NAV, { to: '/saved', label: 'Saved', note: 'Outfits, bookmarks, progress' }].map(n => (
              <li key={n.to}>
                <NavLink to={n.to} className={({ isActive }) => `block py-3.5 ${isActive ? 'text-accent' : ''}`}>
                  <span className="block font-display text-2xl">{n.label}</span>
                  <span className="text-sm text-ink-2">{n.note}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <button className="btn mt-6 justify-center" onClick={onSearch}><Search size={16} aria-hidden /> Search the handbook</button>
      </motion.div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="mt-24 border-t border-rule">
      <div className="mx-auto grid max-w-[84rem] gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl">Fashone</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-2">An illustrated handbook of men's style. Every figure is drawn in code, archival plates are credited to their sources, and your outfits and progress stay in this browser.</p>
        </div>
        <nav aria-label="Footer">
          <ul className="space-y-1.5 text-sm">
            {NAV.map(n => <li key={n.to}><Link className="hover:text-accent" to={n.to}>{n.label}</Link></li>)}
          </ul>
        </nav>
        <ul className="space-y-1.5 text-sm">
          <li><Link className="hover:text-accent" to="/saved">Saved & progress</Link></li>
          <li><Link className="hover:text-accent" to="/search">Search</Link></li>
          <li><Link className="hover:text-accent" to="/credits">Image sources & credits</Link></li>
          <li className="pt-2 text-ink-2">Advice is marked <em>convention</em> or <em>interpretation</em>. Neither is law.</li>
        </ul>
      </div>
    </footer>
  )
}
