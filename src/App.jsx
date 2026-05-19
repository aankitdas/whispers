import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SendPage from './pages/SendPage'
import HerPage from './pages/HerPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/send" element={<SendPage />} />
        <Route path="/her" element={<HerPage />} />
        <Route path="/" element={<Navigate to="/send" replace />} />
        <Route path="*" element={<Navigate to="/send" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
