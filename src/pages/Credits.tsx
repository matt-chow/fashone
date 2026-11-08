import { useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import { ARCHIVE } from '../data/archive'
import { chapter } from '../data/chapters'
import { garment } from '../data/garments'
import { PHOTOS } from '../data/photos'
import { style } from '../data/styles'
import { archiveSrc, Ornament, useTitle } from '../ui/bits'

type Entry = (typeof ARCHIVE)[number] | (typeof PHOTOS)[number]

export default function Credits() {
  useTitle('Image sources & credits')
  const { hash } = useLocation()
  useEffect(() => { if (hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView() }, [hash])

  return (
    <article className="mx-auto max-w-4xl px-4 pb-16 pt-10 sm:px-6">
      <header className="text-center">
        <h1 className="text-5xl leading-[1.04] sm:text-6xl">Image sources & credits</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-2">
          Every figure, specimen and diagram in Fashone is drawn in code and original to this book. The {PHOTOS.length} photographs and {ARCHIVE.length} archival images below come from photographers, museums, archives and libraries.
          Each is in the public domain or under an open licence, which we checked against its source record before use.
        </p>
        <Ornament className="mt-6" />
      </header>

      <h2 className="mt-12 text-3xl">Photographs</h2>
      <p className="mt-2 text-sm text-ink-2">Garments and people photographed for real. Shown uncropped and untinted, so the colours are as the photographer recorded them.</p>
      <ol className="mt-4 divide-y divide-rule border-y border-rule">
        {PHOTOS.map(p => <Item key={p.id} a={p} photo used={[
          ...p.usage.garments.map(id => [`/encyclopedia/${id}`, garment(id)?.name]),
          ...p.usage.body.map(id => [`/encyclopedia/${id}`, `${garment(id)?.name} (as worn)`]),
          ...p.usage.styles.map(id => [`/atlas/${id}`, style(id)?.name]),
        ]} />)}
      </ol>

      <h2 className="mt-12 text-3xl">Archival plates</h2>
      <ol className="mt-4 divide-y divide-rule border-y border-rule">
        {ARCHIVE.map(a => <Item key={a.id} a={a} used={[
          ...a.usage.garments.map(id => [`/encyclopedia/${id}`, garment(id)?.name]),
          ...a.usage.styles.map(id => [`/atlas/${id}`, style(id)?.name]),
          ...a.usage.chapters.map(id => [`/handbook/${id}`, chapter(id)?.title]),
          ...(a.usage.home ? [['/', 'Home']] : []),
        ]} />)}
      </ol>

      <p className="mt-8 text-sm text-ink-2">
        Images were resized and converted to WebP. Nothing else was changed apart from a light tint applied on screen to the archival plates.
        The full machine-readable records live in <code>src/data/photos.json</code> and <code>src/data/archive.json</code> in the source repository.
      </p>
    </article>
  )
}

function Item({ a, used, photo }: { a: Entry; used: (string | undefined)[][]; photo?: boolean }) {
  return (
    <li id={a.id} className="grid scroll-mt-24 gap-5 py-6 sm:grid-cols-[8rem_1fr]">
      <div className="plate self-start p-1.5"><img src={archiveSrc(a)} alt={a.alt} width={a.width} height={a.height} loading="lazy" decoding="async" className={`${photo ? '' : 'archive-img '}h-auto w-full`} /></div>
      <div className="min-w-0">
        <h3 className="font-display text-2xl leading-tight">{a.title}</h3>
        <dl className="mt-2 grid gap-x-4 gap-y-1 text-sm sm:grid-cols-[7rem_1fr]">
          <dt className="label text-ink-2">Creator</dt><dd>{a.creator}</dd>
          <dt className="label text-ink-2">Date</dt><dd>{a.date}</dd>
          <dt className="label text-ink-2">Source</dt><dd><a className="xref break-words" href={a.sourceUrl} target="_blank" rel="noreferrer">{a.sourceOrg}</a></dd>
          <dt className="label text-ink-2">Licence</dt><dd>{a.licenseUrl ? <a className="xref" href={a.licenseUrl} target="_blank" rel="noreferrer">{a.license}</a> : a.license}</dd>
          <dt className="label text-ink-2">Rights</dt><dd className="text-ink-2">{a.rightsBasis}</dd>
          <dt className="label text-ink-2">Credit</dt><dd className="italic">{a.attribution}</dd>
          <dt className="label text-ink-2">Used on</dt>
          <dd>{used.map(([to, name], k) => <span key={to! + k}>{k > 0 && ', '}<Link className="xref" to={to!}>{name}</Link></span>)}</dd>
        </dl>
      </div>
    </li>
  )
}
