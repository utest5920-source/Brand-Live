import { useEffect, useState } from 'react'
import { businessApi } from '../lib/api'

export default function BusinessPage() {
  const [categories, setCategories] = useState([])
  const [profile, setProfile] = useState({})
  const [frames, setFrames] = useState([])

  useEffect(() => {
    (async () => {
      const [{ data: cat }, { data: pf }, { data: fr }] = await Promise.all([
        businessApi.getCategories(),
        businessApi.getProfile(),
        businessApi.getFrames(),
      ])
      setCategories(cat)
      setProfile(pf || {})
      setFrames(fr)
    })()
  }, [])

  const save = async () => {
    const { data } = await businessApi.saveProfile(profile)
    setProfile(data)
    alert('Business profile saved')
  }

  return (
    <div className="page colorful">
      <h1>Business</h1>
      <div className="card form-grid">
        <select value={profile.categoryId || ''} onChange={e=>setProfile({...profile, categoryId:e.target.value})}>
          <option value="">Select Category</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input placeholder="Business name" value={profile.name || ''} onChange={e=>setProfile({...profile, name:e.target.value})} />
        <input placeholder="Logo URL" value={profile.logoUrl || ''} onChange={e=>setProfile({...profile, logoUrl:e.target.value})} />
        <input placeholder="Email" value={profile.email || ''} onChange={e=>setProfile({...profile, email:e.target.value})} />
        <input placeholder="Address" value={profile.address || ''} onChange={e=>setProfile({...profile, address:e.target.value})} />
        <input placeholder="Phone 1" value={profile.phone1 || ''} onChange={e=>setProfile({...profile, phone1:e.target.value})} />
        <input placeholder="Phone 2" value={profile.phone2 || ''} onChange={e=>setProfile({...profile, phone2:e.target.value})} />
        <input placeholder="Website" value={profile.website || ''} onChange={e=>setProfile({...profile, website:e.target.value})} />
        <select value={profile.frameId || ''} onChange={e=>setProfile({...profile, frameId:e.target.value})}>
          <option value="">Select Frame</option>
          {frames.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
      </div>
      <button onClick={save}>Save</button>
    </div>
  )
}