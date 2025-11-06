import React from 'react'
import { useLocation, Link } from 'react-router-dom'

export default function Result(){
  const loc = useLocation()
  const report = loc.state && loc.state.report
  return (
    <div>
      <h2 className="text-xl font-bold">Result / 报告</h2>
      {!report && <p>No report (模拟) — 练习后会显示报告。</p>}
      {report && <div className="bg-white p-4 rounded shadow">
        <h3>Transcript</h3>
        <pre className="bg-gray-100 p-2 rounded">{report.transcript}</pre>
        <h3 className="mt-3">Scores</h3>
        <ul>
          <li>Fluency: {report.scores.fluency}</li>
          <li>Grammar: {report.scores.grammar}</li>
          <li>Vocabulary: {report.scores.vocabulary}</li>
          <li>Pronunciation: {report.scores.pronunciation}</li>
          <li>Overall: {report.scores.overall_percent}%</li>
        </ul>
        <h3 className="mt-3">Suggestions</h3>
        <ul className="list-disc ml-6">
          {report.suggestions.map((s,i)=><li key={i}>{s}</li>)}
        </ul>
      </div>}
      <div className="mt-4">
        <Link to="/" className="px-3 py-2 bg-gray-200 rounded">Back</Link>
      </div>
    </div>
  )
}
