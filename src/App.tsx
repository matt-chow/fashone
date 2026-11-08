import { lazy } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { StoreProvider } from './lib/store'
import { Layout } from './ui/Layout'
import Home from './pages/Home'

const Handbook = lazy(() => import('./pages/Handbook'))
const Chapter = lazy(() => import('./pages/Chapter'))
const Encyclopedia = lazy(() => import('./pages/Encyclopedia'))
const GarmentPage = lazy(() => import('./pages/GarmentPage'))
const Compare = lazy(() => import('./pages/Compare'))
const Studio = lazy(() => import('./pages/Studio'))
const Atlas = lazy(() => import('./pages/Atlas'))
const StylePage = lazy(() => import('./pages/StylePage'))
const Practice = lazy(() => import('./pages/Practice'))
const Saved = lazy(() => import('./pages/Saved'))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const NotFound = lazy(() => import('./pages/NotFound'))

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'handbook', element: <Handbook /> },
      { path: 'handbook/:id', element: <Chapter /> },
      { path: 'encyclopedia', element: <Encyclopedia /> },
      { path: 'encyclopedia/compare', element: <Compare /> },
      { path: 'encyclopedia/:id', element: <GarmentPage /> },
      { path: 'studio', element: <Studio /> },
      { path: 'atlas', element: <Atlas /> },
      { path: 'atlas/:id', element: <StylePage /> },
      { path: 'practice', element: <Practice /> },
      { path: 'practice/:id', element: <Practice /> },
      { path: 'saved', element: <Saved /> },
      { path: 'search', element: <SearchPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
], { basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/' })

export default function App() {
  return (
    <StoreProvider>
      <RouterProvider router={router} />
    </StoreProvider>
  )
}
