import { useEffect, useState } from 'react'
import { politicalApi } from '../lib/api'

export default function PoliticalPage() {
  const [profile, setProfile] = useState({})
  const [frames, setFrames] = useState([])

  useEffect(() => {
    (async () => {
      const [{ data: pf }, { data: fr }] = await Promise.all([
        politicalApi.getProfile(),
        politicalApi.getFrames(),
      ])
      setProfile(pf || {})
      setFrames(fr)
    })()
  }, [])

  const save = async () => {
    const { data } = await politicalApi.saveProfile(profile)
    setProfile(data)
    alert('Political profile saved')
  }

  return (
    <div className="page colorful">
      <h1>Political</h1>
      <div className="card form-grid">
        <input placeholder="Designation" value={profile.designation || ''} onChange={e=>setProfile({...profile, designation:e.target.value})} />
        <input placeholder="Party" value={profile.party || ''} onChange={e=>setProfile({...profile, party:e.target.value})} />
        <input placeholder="Number" value={profile.number || ''} onChange={e=>setProfile({...profile, number:e.target.value})} />
        <input placeholder="Email" value={profile.email || ''} onChange={e=>setProfile({...profile, email:e.target.value})} />
        <input placeholder="Website" value={profile.website || ''} onChange={e=>setProfile({...profile, website:e.target.value})} />
        <input placeholder="Address" value={profile.address || ''} onChange={e=>setProfile({...profile, address:e.target.value})} />
        <select value={profile.frameId || ''} onChange={e=>setProfile({...profile, frameId:e.target.value})}>
          <option value="">Select Frame</option>
          {frames.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
      </div>
      <button onClick={save}>Save</button>
    </div>
  )
}