import React, { useState } from 'react'
import { fetchQuestion, generateMindmap } from '../api'
import Timer from '../components/Timer'
import Recorder from '../components/Recorder'
import Mindmap from '../components/Mindmap'
import { useNavigate } from 'react-router-dom'

// 🌈 渐变背景 + 语音考官
export default function SPM() {
  const [part, setPart] = useState(1)
  const [question, setQuestion] = useState(null)
  const [mindmap, setMindmap] = useState(null)
  const [prepSeconds, setPrepSeconds] = useState(60)
  const [speakSeconds, setSpeakSeconds] = useState(120)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const navigate = useNavigate()

  // 🔹 考官语音
  const speak = (text) => {
    const synth = window.speechSynthesis
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'en-US'
    utter.pitch = 1.1
    utter.rate = 1
    synth.speak(utter)
  }

  // 🔹 获取随机 SPM 题目
  const getAIQuestion = async () => {
    const res = await fetchQuestion('SPM', 'ai', 1)
    const q = res.items[0]
    if (!q.prompts || q.prompts.length === 0) {
      // 如果AI没生成 bullet points，自动补全4个
      q.prompts = [
        "Who / What is it?",
        "Why is it important?",
        "How does it affect you?",
        "What can you learn from it?"
      ]
    }
    setQuestion(q)
    speak("Here is your task. Please look at the question carefully.")
  }

  // 🔹 Mindmap 生成
  const createMindmap = async () => {
    if (!question) return
    const r = await generateMindmap(question.title, 'en')
    setMindmap(r.mindmap)
  }

  // 🔹 切换到 Part 2 / Part 3
  const nextPart = () => {
    if (part < 3) setPart(part + 1)
    else alert("You’ve completed all parts! 🎉")
  }

  return (
    <div
      className="min-h-screen text-gray-800 p-6"
      style={{
        background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      }}
    >
      <div className="max-w-3xl mx-auto bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 space-y-5">
        <h1 className="text-3xl font-bold text-center text-indigo-700">
          🎯 SPM Speaking Practice
        </h1>

        {/* --- PART INDICATOR --- */}
        <div className="text-center font-semibold text-lg">
          Part {part} of 3
        </div>

        {/* --- PART 1: WARM UP --- */}
        {part === 1 && (
          <div>
            <h2 className="text-xl font-bold text-indigo-600 mb-2">
              Part 1: Introduction & Warm-up
            </h2>
            <p className="text-gray-600 mb-4">
              The interlocutor will ask you some simple questions about yourself.
            </p>
            <div className="space-y-3 bg-indigo-50 p-3 rounded">
              {[
                "What is your name?",
                "Where do you live?",
                "How do you go to school?",
                "What do you usually do on weekends?",
                "What’s your favourite subject at school?",
              ].map((q, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span>{q}</span>
                  <button
                    className="px-3 py-1 bg-indigo-500 text-white rounded"
                    onClick={() => speak(q)}
                  >
                    🔊
                  </button>
                </div>
              ))}
            </div>

            <div className="text-center mt-5">
              <button
                onClick={nextPart}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Next: Part 2 ➡️
              </button>
            </div>
          </div>
        )}

        {/* --- PART 2: INDIVIDUAL TASK --- */}
        {part === 2 && (
          <div>
            <h2 className="text-xl font-bold text-indigo-600 mb-2">
              Part 2: Individual Task
            </h2>
            <div className="space-y-3">
              <button
                className="px-3 py-2 bg-indigo-600 text-white rounded"
                onClick={getAIQuestion}
              >
                🎲 AI 生成题目
              </button>

              {question && (
                <div className="bg-indigo-50 p-3 rounded">
                  <h3 className="font-semibold">{question.title}</h3>
                  <ul className="list-disc ml-5 mt-2">
                    {question.prompts.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>

                  <div className="mt-3">
                    <p className="text-gray-600 mb-1">准备时间：</p>
                    <Timer
                      seconds={prepSeconds}
                      onFinish={() => {
                        speak("Your preparation time is over. Please start speaking now.")
                        setIsSpeaking(true)
                      }}
                    />

                    {isSpeaking && (
                      <>
                        <p className="text-gray-600 mt-3">作答时间：</p>
                        <Timer
                          seconds={speakSeconds}
                          onFinish={() => {
                            setIsSpeaking(false)
                            speak("Time’s up. Well done!")
                          }}
                        />
                        <div className="mt-3">
                          <Recorder
                            onReport={(r) => {
                              console.log("report", r)
                              navigate('/result', { state: { report: r } })
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="mt-4">
                    <button
                      className="px-3 py-2 bg-gray-200 rounded"
                      onClick={createMindmap}
                    >
                      🧠 生成 Mindmap
                    </button>
                    {mindmap && (
                      <div className="mt-3">
                        <Mindmap data={mindmap} />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="text-center mt-5">
              <button
                onClick={nextPart}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Next: Part 3 ➡️
              </button>
            </div>
          </div>
        )}

        {/* --- PART 3: DISCUSSION --- */}
        {part === 3 && (
          <div>
            <h2 className="text-xl font-bold text-indigo-600 mb-2">
              Part 3: Discussion
            </h2>
            <p className="text-gray-600 mb-3">
              Discuss further questions based on your topic.
            </p>
            <div className="bg-indigo-50 p-3 rounded space-y-3">
              {[
                "What do you think about this issue in general?",
                "How does it affect young people today?",
                "Do you agree or disagree with the common opinion?",
                "What can be done to improve the situation?",
              ].map((q, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span>{q}</span>
                  <button
                    className="px-3 py-1 bg-indigo-500 text-white rounded"
                    onClick={() => speak(q)}
                  >
                    🔊
                  </button>
                </div>
              ))}
            </div>

            <div className="text-center mt-5">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-indigo-600 text-white rounded"
              >
                ⬅️ 返回主页
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
