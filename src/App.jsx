import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import SendPage from './pages/SendPage'
import HerPage from './pages/HerPage'
import DemoPage from './pages/DemoPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/send" element={<SendPage />} />
        <Route path="/her" element={<HerPage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/" element={<Navigate to="/send" replace />} />
        <Route path="*" element={<Navigate to="/send" replace />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  )
}
