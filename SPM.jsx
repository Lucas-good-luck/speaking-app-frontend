import React, { useState, useEffect, useRef } from 'react'
console.log("🔥 SPM.jsx reloaded test");
import { fetchQuestion, generateMindmap } from '../api'
import Timer from '../components/Timer'
import Recorder from '../components/Recorder'
import Mindmap from '../components/Mindmap'
import { useNavigate } from 'react-router-dom'

/**
 * SPM.jsx
 * Single-file page including Part1 / Part2 / Part3 subcomponents.
 * Replace your existing src/pages/SPM.jsx with this file.
 */

export default function SPMPage() {
  const [part, setPart] = useState(1)
  return (
    <div
      className="min-h-screen text-gray-800 p-6"
      style={{
        background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      }}
    >
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 space-y-5">
        <h1 className="text-3xl font-bold text-center text-indigo-700">
          🎯 SPM Speaking Practice
        </h1>

        <div className="flex items-center justify-center space-x-3">
          <TabButton label="Part 1" selected={part===1} onClick={()=>setPart(1)} />
          <TabButton label="Part 2" selected={part===2} onClick={()=>setPart(2)} />
          <TabButton label="Part 3" selected={part===3} onClick={()=>setPart(3)} />
        </div>

        {part === 1 && <Part1 onNext={()=>setPart(2)} />}
        {part === 2 && <Part2 onNext={()=>setPart(3)} />}
        {part === 3 && <Part3 onBack={()=>setPart(1)} />}
      </div>
    </div>
  )
}

/* -------------------- UI helpers -------------------- */
function TabButton({ label, selected, onClick }){
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md font-semibold ${selected ? 'bg-indigo-600 text-white' : 'bg-white border'}`}
    >
      {label}
    </button>
  )
}

/* -------------------- Part 1 (Warm-up / Interlocutor) -------------------- */
function Part1({ onNext }) {
  const nav = useNavigate()
  const questions = [
    "What's your name?",
    "Where do you live?",
    "How do you get to school?",
    "What do you usually do on the weekends?",
    "What's your favourite subject at school?",
    "Do you have any hobbies?"
  ]
  // We'll allow the AI to speak questions. Also allow "play all" mode.
  const speak = (text, opts = {}) => {
    if (!window.speechSynthesis) return
    const u = new SpeechSynthesisUtterance(text)
    u.lang = opts.lang || 'en-US'
    u.rate = opts.rate || 1
    u.pitch = opts.pitch || 1
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
  }

  const playSequence = async () => {
    for (let q of questions.slice(0,4)) {
      speak(q)
      // wait roughly 2.6s between questions so they don't overlap (speechSynthesis is async)
      await waitMs(2600)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-indigo-600 mb-2">Part 1 — Warm-up (Interlocutor)</h2>
      <p className="text-gray-600 mb-3">The examiner will ask you simple questions about yourself. Click the speaker to hear the question.</p>

      <div className="bg-indigo-50 p-4 rounded space-y-2">
        {questions.map((q,i)=>(
          <div key={i} className="flex items-center justify-between">
            <div>{q}</div>
            <div className="flex items-center gap-2">
              <button className="px-2 py-1 rounded bg-indigo-500 text-white" onClick={()=>speak(q)}>🔊</button>
              <RecorderInline onReport={(r)=>nav('/result', { state: { report: r } })} placeholder="Answer here — live transcript will appear" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-4">
        <div>
          <button className="px-3 py-2 bg-gray-200 rounded mr-2" onClick={()=>playSequence()}>Play 4 questions</button>
        </div>
        <div>
          <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={onNext}>Go to Part 2 ➡️</button>
        </div>
      </div>
    </div>
  )
}

/* -------------------- Part 2 (Individual Task) -------------------- */
function Part2({ onNext }) {
  const [question, setQuestion] = useState(null)
  const [mindmap, setMindmap] = useState(null)
  const [prepSeconds, setPrepSeconds] = useState(60)
  const [speakSeconds, setSpeakSeconds] = useState(120)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [seed, setSeed] = useState(0)
  const nav = useNavigate()

  // speak helper
  const speak = (text) => {
    if (!window.speechSynthesis) return
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-US'
    u.rate = 1
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
  }

  const ensureFourBullets = (item) => {
    if (!item) return item
    // ensure prompts exist and length==4
    item.prompts = item.prompts && item.prompts.length >= 1 ? item.prompts.slice(0,4) : []
    while (item.prompts.length < 4) {
      item.prompts.push(defaultBulletFor(i18nRnd()))
    }
    return item
  }

  // fallback random generator in frontend (in case backend returns same every time)
  const fallbackQuestion = () => {
    const topics = [
      "Talk about a person you admire.",
      "Describe a family celebration you had recently.",
      "Talk about your favourite hobby.",
      "Describe a school subject you enjoy.",
      "Talk about a memorable trip you took."
    ]
    const t = topics[Math.floor(Math.random()*topics.length)]
    const prompts = [
      "Who is this person?",
      "What do they look like / what happened?",
      "Why are they important to you?",
      "What did you learn from this?"
    ]
    return { title: t, prompts }
  }

  const getAIQuestion = async () => {
    try {
      const r = await fetchQuestion('SPM','ai',1)
      let item = r.items && r.items[0] ? r.items[0] : null
      // guard: if backend returns something obviously repeated/same, fallback
      if (!item || !item.title) item = fallbackQuestion()
      // ensure 4 bullet points
      item = ensureFourBullets(item)
      setQuestion(item)
      setSeed(prev=>prev+1)
      speak("Here is your task. You will have one minute to prepare, then two minutes to speak. Good luck.")
    } catch (e) {
      console.error(e)
      const item = fallbackQuestion()
      setQuestion(ensureFourBullets(item))
      speak("Failed to fetch from server. Using a generated task.")
    }
  }

  const createMindmap = async () => {
    if (!question) return
    const r = await generateMindmap(question.title, 'en')
    setMindmap(r.mindmap)
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-indigo-600 mb-2">Part 2 — Individual Task (1–2 minutes)</h2>
      <p className="text-gray-600 mb-3">You will be given a topic with 4 bullet points. Use the preparation time to plan; then speak for the allocated time.</p>

      <div className="space-y-3">
        <div className="flex gap-2">
          <button className="px-3 py-2 bg-indigo-600 text-white rounded" onClick={getAIQuestion}>🎲 AI 生成题目</button>
          <button className="px-3 py-2 bg-gray-200 rounded" onClick={()=>{ setQuestion(fallbackQuestion()); speak("Using a generated task."); }}>随机题 (本地)</button>
        </div>

        {question ? (
          <div className="bg-indigo-50 p-3 rounded space-y-2">
            <h3 className="font-semibold">{question.title}</h3>
            <ul className="list-disc ml-6">
              {question.prompts.map((p,i)=> <li key={i}>{p}</li>)}
            </ul>

            <div className="mt-3">
              <label className="text-sm">准备时间 (秒): </label>
              <input type="number" value={prepSeconds} onChange={e=>setPrepSeconds(Number(e.target.value))} className="border ml-2 p-1 w-24" />
              <label className="text-sm ml-4">作答时间 (秒): </label>
              <input type="number" value={speakSeconds} onChange={e=>setSpeakSeconds(Number(e.target.value))} className="border ml-2 p-1 w-24" />
            </div>

            <div className="mt-3">
              <p className="text-gray-600">准备倒计时：</p>
              <Timer seconds={prepSeconds} onFinish={() => { speak("Preparation over. Start speaking now."); setIsSpeaking(true) }} />
              {isSpeaking && (
                <>
                  <p className="text-gray-600 mt-3">作答倒计时：</p>
                  <Timer seconds={speakSeconds} onFinish={() => { speak("Time is up."); setIsSpeaking(false) }} />
                  <div className="mt-3">
                    <Recorder onReport={(r)=> navToResult(nav, r)} />
                  </div>
                </>
              )}
            </div>

            <div className="mt-3 flex gap-2">
              <button className="px-3 py-2 bg-gray-200 rounded" onClick={createMindmap}>🧠 生成 Mindmap</button>
              <button className="px-3 py-2 bg-green-600 text-white rounded" onClick={onNext}>下一部分：Part 3 ➡️</button>
            </div>

            {mindmap && <div className="mt-3"><Mindmap data={mindmap} /></div>}
          </div>
        ) : (
          <div className="text-gray-500">还没有题目 — 请点击「AI 生成题目」</div>
        )}
      </div>
    </div>
  )
}

/* -------------------- Part 3 (Discussion) -------------------- */
function Part3({ onBack }) {
  const [followUps, setFollowUps] = useState([])
  const [topic, setTopic] = useState('')
  const nav = useNavigate()

  const speak = (text) => {
    if (!window.speechSynthesis) return
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-US'
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
  }

  // generate follow-ups from backend mindmap endpoint or local fallback
  const createFollowUps = async (topicText) => {
    setTopic(topicText)
    try {
      const r = await generateMindmap(topicText || "people who shop online", 'en')
      // create 4 follow-up style questions from the mindmap central + branches
      const mm = r.mindmap
      const qs = [
        `Why is ${mm.central.toLowerCase()} important?`,
        `How does it affect your daily life?`,
        `What are the advantages and disadvantages?`,
        `How can people improve this in the future?`
      ]
      setFollowUps(qs)
      // speak first follow up
      speak(qs[0])
    } catch (e) {
      console.error(e)
      const qs = [
        "What do you think about this issue in general?",
        "How does it affect young people today?",
        "Do you agree or disagree with the common opinion?",
        "What can be done to improve the situation?"
      ]
      setFollowUps(qs)
      speak(qs[0])
    }
  }

  useEffect(()=> {
    // default generate on mount
    createFollowUps("Why do people shop online?")
  }, [])

  return (
    <div>
      <h2 className="text-xl font-bold text-indigo-600 mb-2">Part 3 — Discussion</h2>
      <p className="text-gray-600 mb-3">Answer follow-up questions and discuss the topic more deeply.</p>

      <div className="bg-indigo-50 p-3 rounded space-y-2">
        <div className="flex items-center gap-2">
          <input type="text" placeholder="Topic (optional)" className="border p-1 rounded flex-1" onBlur={e=>createFollowUps(e.target.value)} />
          <button className="px-3 py-1 bg-indigo-600 text-white rounded" onClick={()=>createFollowUps(topic)}>Generate</button>
        </div>

        {followUps.map((q,i)=>(
          <div key={i} className="flex items-center justify-between">
            <div>{q}</div>
            <div className="flex items-center gap-2">
              <button className="px-2 py-1 rounded bg-indigo-500 text-white" onClick={()=>speak(q)}>🔊</button>
              <RecorderInline onReport={(r)=>nav('/result', { state: { report: r } })} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-between">
        <button className="px-3 py-2 bg-gray-200 rounded" onClick={onBack}>⬅️ Back to Part 1</button>
        <button className="px-3 py-2 bg-indigo-600 text-white rounded" onClick={()=>alert('End of practice. Good job!')}>Finish</button>
      </div>
    </div>
  )
}

/* -------------------- Small utilities & inline Recorder wrapper -------------------- */
function waitMs(ms){ return new Promise(res=>setTimeout(res, ms)) }

function defaultBulletFor(n=0){
  const defaults = [
    "Who / What is it?",
    "When / Where did it happen?",
    "Why is it important?",
    "What did you do / How did you feel?"
  ]
  return defaults[n % defaults.length]
}

function i18nRnd(){ return Math.floor(Math.random()*10) }

function navToResult(nav, report){
  // if recorder returns an object with transcript or report
  if (!report) {
    alert('No report')
    return
  }
  // if report is nested: { report: {...} }, adapt
  const payload = report.report ? report.report : report
  nav('/result', { state: { report: payload } })
}

/**
 * RecorderInline:
 * A thin wrapper to place the existing Recorder component inline in lists.
 * It forwards onReport up; it expects Recorder component to accept onReport({transcript, ...})
 */
function RecorderInline({ onReport, placeholder }) {
  // We reuse the global Recorder component (imported at top).
  // But some pages previously used another recorder. This wrapper just renders Recorder and binds onReport.
  return (
    <div style={{ minWidth: 260 }}>
      <Recorder onReport={onReport} />
    </div>
  )
}
