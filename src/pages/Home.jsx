import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Speaking Practice</h1>
      <p>Choose a mode to start practicing. 支持中文/英文双语界面。</p>
      <div className="space-x-3 mt-4">
        <Link to="/spm" className="px-4 py-2 bg-green-600 text-white rounded">SPM</Link>
        <Link to="/toefl" className="px-4 py-2 bg-yellow-600 text-white rounded">TOEFL</Link>
        <Link to="/ielts" className="px-4 py-2 bg-blue-600 text-white rounded">IELTS</Link>
      </div>
    </div>
  )
}
