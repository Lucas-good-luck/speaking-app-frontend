import React, { useState } from 'react'
import { fetchQuestion } from '../api'
import Timer from '../components/Timer'
import Recorder from '../components/Recorder'
import { useNavigate } from 'react-router-dom'

export default function TOEFL(){
  const [question, setQuestion] = useState(null)
  const [prepSeconds, setPrepSeconds] = useState(15)
  const [speakSeconds, setSpeakSeconds] = useState(45)
  const navigate = useNavigate()

  const getAIQuestion = async ()=> {
    const r = await fetchQuestion('TOEFL','ai',1)
    setQuestion(r.items[0])
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">TOEFL Practice</h2>
      <div className="bg-white p-3 rounded shadow space-y-2">
        <div>
          <button className="px-3 py-2 bg-indigo-600 text-white rounded mr-2" onClick={getAIQuestion}>AI 生成题目</button>
        </div>
        {question && <div>
          <h3 className="font-semibold mt-2">{question.title}</h3>
          <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(question.prompts, null, 2)}</pre>
          <div className="mt-2">
            <label>准备时间 (秒): </label>
            <input type="number" value={prepSeconds} onChange={e=>setPrepSeconds(Number(e.target.value))} className="border ml-2 p-1 w-24"/>
            <label className="ml-4">回答时间 (秒): </label>
            <input type="number" value={speakSeconds} onChange={e=>setSpeakSeconds(Number(e.target.value))} className="border ml-2 p-1 w-24"/>
          </div>
          <div className="mt-3">
            <p>准备中...</p>
            <Timer seconds={prepSeconds} onFinish={()=>alert('准备结束，开始回答！')} />
            <div className="mt-3">
              <Recorder onReport={(r)=>{ console.log('report', r); navigate('/result', { state: { report: r } })}} />
            </div>
          </div>
        </div>}
      </div>
    </div>
  )
}
