import React from 'react'

export default function Mindmap({data}) {
  if(!data) return null
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-2">{data.central}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {data.branches.map((b,idx)=>(
          <div key={idx} className="p-2 border rounded">
            <h4 className="font-semibold">{b.title}</h4>
            <ul className="list-disc ml-5">
              {b.subpoints.map((s,i)=><li key={i}>{s}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
