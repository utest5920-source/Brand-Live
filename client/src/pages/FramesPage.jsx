import { useEffect, useState } from 'react'
import { businessApi, politicalApi } from '../lib/api'

export default function FramesPage() {
  const [businessFrames, setBusinessFrames] = useState([])
  const [politicalFrames, setPoliticalFrames] = useState([])
  const [name, setName] = useState('')
  const [file, setFile] = useState(null)
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState([])

  useEffect(() => {
    (async () => {
      const [{ data: bf }, { data: pf }, { data: cats }] = await Promise.all([
        businessApi.getFrames(),
        politicalApi.getFrames(),
        businessApi.getCategories(),
      ])
      setBusinessFrames(bf)
      setPoliticalFrames(pf)
      setCategories(cats)
    })()
  }, [])

  const uploadBusiness = async () => {
    if (!file || !name) return
    const fd = new FormData()
    fd.append('name', name)
    if (categoryId) fd.append('categoryId', categoryId)
    fd.append('image', file)
    await businessApi.createFrame(fd)
    const { data } = await businessApi.getFrames()
    setBusinessFrames(data)
    setName(''); setFile(null); setCategoryId('')
  }

  const uploadPolitical = async () => {
    if (!file || !name) return
    const fd = new FormData()
    fd.append('name', name)
    fd.append('image', file)
    await politicalApi.createFrame(fd)
    const { data } = await politicalApi.getFrames()
    setPoliticalFrames(data)
    setName(''); setFile(null)
  }

  return (
    <div className="page colorful">
      <h1>Frames</h1>
      <div className="card">
        <h3>Upload Business Frame</h3>
        <input placeholder="Frame name" value={name} onChange={e=>setName(e.target.value)} />
        <select value={categoryId} onChange={e=>setCategoryId(e.target.value)}>
          <option value="">No Category</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input type="file" onChange={e=>setFile(e.target.files?.[0] || null)} />
        <button onClick={uploadBusiness}>Upload Business Frame</button>
      </div>

      <div className="card">
        <h3>Upload Political Frame</h3>
        <input placeholder="Frame name" value={name} onChange={e=>setName(e.target.value)} />
        <input type="file" onChange={e=>setFile(e.target.files?.[0] || null)} />
        <button onClick={uploadPolitical}>Upload Political Frame</button>
      </div>

      <div className="card">
        <h3>Business Frames</h3>
        <div className="grid">
          {businessFrames.map(f => (
            <div key={f.id} className="thumb">
              <img src={f.imageUrl} alt={f.name} />
              <div>{f.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Political Frames</h3>
        <div className="grid">
          {politicalFrames.map(f => (
            <div key={f.id} className="thumb">
              <img src={f.imageUrl} alt={f.name} />
              <div>{f.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}