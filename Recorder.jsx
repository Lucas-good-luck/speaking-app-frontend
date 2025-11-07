import React, { useState, useRef } from 'react'

export default function Recorder({ onReport }) {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [status, setStatus] = useState('Click "Start" to begin speaking.')
  const recognitionRef = useRef(null)
  const audioChunksRef = useRef([])

  // 启动录音 + 实时语音识别
  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Your browser does not support live speech recognition. Please use Chrome.')
      return
    }

    const recognition = new window.webkitSpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setStatus('🎙 Listening...')
      setIsRecording(true)
      setTranscript('')
    }

    recognition.onresult = (event) => {
      let text = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        text += event.results[i][0].transcript
      }
      setTranscript(text)
    }

    recognition.onerror = (e) => {
      console.error('Speech recognition error:', e)
      setStatus('❌ Error during recognition')
      setIsRecording(false)
    }

    recognition.onend = () => {
      setStatus('🟡 Recording stopped.')
      setIsRecording(false)
    }

    recognition.start()
    recognitionRef.current = recognition
  }

  // 停止录音 + 检查是否有语音
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsRecording(false)

    if (!transcript.trim()) {
      alert('No speech detected. Please try again.')
      setStatus('⚠️ No speech detected.')
      return
    }

    setStatus('✅ Recording complete!')
    onReport?.({
      transcript,
      summary: 'Speech successfully recorded and transcribed.'
    })
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow space-y-3">
      <div className="flex items-center space-x-2">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`px-4 py-2 rounded text-white font-medium ${
            isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isRecording ? '⏹ Stop' : '🎤 Start Recording'}
        </button>
        <span className="text-gray-600">{status}</span>
      </div>

      <div className="border rounded p-3 h-40 overflow-y-auto bg-gray-50">
        <p className="whitespace-pre-wrap">
          {transcript || 'Your speech will appear here in real-time...'}
        </p>
      </div>

      {!isRecording && transcript && (
        <div className="text-sm text-gray-500">
          <p>✅ Recording finished. You can continue or start again.</p>
        </div>
      )}
    </div>
  )
}
