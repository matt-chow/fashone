import { Link } from 'react-router'
import { Ornament, useTitle } from '../ui/bits'

export default function NotFound() {
  useTitle('Page not found')
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-5xl">A missing page</h1>
      <p className="mt-4 text-lg text-ink-2">This leaf seems to have been torn from the book. The page you asked for does not exist, or has moved.</p>
      <Ornament className="my-8" />
      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn btn-primary">Back to the cover</Link>
        <Link to="/search" className="btn">Search instead</Link>
      </div>
    </div>
  )
}
