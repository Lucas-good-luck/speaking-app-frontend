import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import SPM from './pages/SPM'
import TOEFL from './pages/TOEFL'
import IELTS from './pages/IELTS'
import Result from './pages/Result'

export default function App(){
  return (
    <div className="min-h-screen">
      <nav className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-bold text-lg">Speaking Practice</Link>
          <div className="space-x-3">
            <Link to="/spm" className="text-sm">SPM</Link>
            <Link to="/toefl" className="text-sm">TOEFL</Link>
            <Link to="/ielts" className="text-sm">IELTS</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/spm" element={<SPM/>} />
          <Route path="/toefl" element={<TOEFL/>} />
          <Route path="/ielts" element={<IELTS/>} />
          <Route path="/result" element={<Result/>} />
        </Routes>
      </main>
    </div>
  )
}
