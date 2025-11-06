import React, { useEffect, useState } from 'react'

export default function Timer({seconds, onFinish}) {
  const [time, setTime] = useState(seconds)
  useEffect(()=>{
    setTime(seconds)
  },[seconds])
  useEffect(()=>{
    if (time<=0) { onFinish && onFinish(); return; }
    const t = setInterval(()=> setTime(t=>t-1), 1000)
    return ()=> clearInterval(t)
  },[time])
  const mm = Math.floor(time/60).toString().padStart(2,'0')
  const ss = (time%60).toString().padStart(2,'0')
  return <div className="p-2 bg-white rounded shadow inline-block">
    <span className="font-mono text-xl">{mm}:{ss}</span>
  </div>
}
