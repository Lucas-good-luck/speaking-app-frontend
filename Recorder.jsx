import React, { useState, useRef } from 'react';

export default function Recorder({ onReport }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);

  // 开始录音
  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('你的浏览器不支持语音识别，请使用 Chrome。');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        finalTranscript += event.results[i][0].transcript;
      }
      setTranscript(finalTranscript.trim());
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  };

  // 停止录音
  const stopRecording = async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    if (transcript.trim().length < 3) {
      alert('未检测到有效语音，请重试。');
      return;
    }

    // 将用户的语音文本发给 AI 分析
    const res = await fetch('https://speaking-app-backend.onrender.com/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: transcript }),
    });

    const report = await res.json();
    onReport(report);
  };

  // 重置
  const resetRecording = () => {
    setTranscript('');
    setIsRecording(false);
  };

  return (
    <div className="border p-3 rounded shadow bg-white space-y-2">
      <h3 className="font-semibold">🎤 Speech Recorder</h3>
      <div className="flex space-x-2">
        {!isRecording && (
          <button
            onClick={startRecording}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            ▶️ Start
          </button>
        )}
        {isRecording && (
          <button
            onClick={stopRecording}
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            ⏹ Stop
          </button>
        )}
        <button
          onClick={resetRecording}
          className="bg-gray-400 text-white px-3 py-1 rounded"
        >
          🔁 Reset
        </button>
      </div>

      <div className="bg-gray-100 p-2 rounded h-24 overflow-auto">
        {transcript ? (
          <p className="text-gray-800">{transcript}</p>
        ) : (
          <p className="text-gray-400 italic">（语音转文字会显示在这里）</p>
        )}
      </div>
    </div>
  );
}

