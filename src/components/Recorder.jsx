import React, { useRef, useState } from 'react'
import { uploadAudio } from '../api'

export default function Recorder({onReport}) {
  const [recording, setRecording] = useState(false)
  const mediaRef = useRef(null)
  const chunksRef = useRef([])

  const start = async ()=>{
    const stream = await navigator.mediaDevices.getUserMedia({audio:true})
    const mr = new MediaRecorder(stream)
    chunksRef.current = []
    mr.ondataavailable = e => chunksRef.current.push(e.data)
    mr.onstop = async ()=>{
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
      // upload
      const res = await uploadAudio(blob)
      onReport && onReport(res.report)
      // create URL for playback
      const url = URL.createObjectURL(blob)
      setTimeout(()=> setPlayback(url), 300)
    }
    mr.start()
    mediaRef.current = mr
    setRecording(true)
  }

  const stop = ()=> {
    if (mediaRef.current) mediaRef.current.stop()
    setRecording(false)
  }

  const [playback, setPlayback] = useState(null)

  return <div className="space-y-2">
    {!recording && <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={start}>开始录音 / Start</button>}
    {recording && <button className="px-3 py-2 bg-red-600 text-white rounded" onClick={stop}>停止 / Stop</button>}
    {playback && <audio src={playback} controls className="mt-2"/>}
  </div>
}
