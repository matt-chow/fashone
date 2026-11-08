import { Fragment, type ReactNode } from 'react'
import { Link } from 'react-router'

/**
 * Tiny inline markup for authored content: **bold**, *italic*, and links
 * `[text](g:garment)`, `(s:style)`, `(c:chapter)` or `(/path)`.
 */
const TOKEN = /\*\*(.+?)\*\*|\*(.+?)\*|\[(.+?)\]\(([^)]+)\)/g

export const href = (target: string) => {
  const [k, id] = target.split(':')
  return id === undefined ? target : k === 'g' ? `/encyclopedia/${id}` : k === 's' ? `/atlas/${id}` : `/handbook/${id}`
}

export function Rich({ text }: { text: string }) {
  const out: ReactNode[] = []
  let last = 0
  for (const m of text.matchAll(TOKEN)) {
    out.push(text.slice(last, m.index))
    const [, b, i, label, to] = m
    out.push(b ? <strong key={m.index}>{b}</strong> : i ? <em key={m.index}>{i}</em> : <Link key={m.index} className="xref" to={href(to)}>{label}</Link>)
    last = m.index + m[0].length
  }
  out.push(text.slice(last))
  return <Fragment>{out}</Fragment>
}

export const plain = (text: string) => text.replace(TOKEN, (_, b, i, label) => b ?? i ?? label)

/** Every link target in a piece of text, for validation. */
export const links = (text: string) => [...text.matchAll(TOKEN)].flatMap(m => (m[4] ? [m[4]] : []))
