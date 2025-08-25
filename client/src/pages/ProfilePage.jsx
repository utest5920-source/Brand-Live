import { useEffect, useState } from 'react'
import { userApi } from '../lib/api'

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const { data } = await userApi.getProfile()
        setProfile(data)
      } catch (e) {
        alert('Failed to load profile')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const save = async () => {
    try {
      const { data } = await userApi.updateProfile(profile)
      setProfile(data)
      alert('Saved')
    } catch (e) {
      alert('Failed to save')
    }
  }

  if (loading) return <div className="page"><p>Loading...</p></div>
  if (!profile) return <div className="page"><p>No profile</p></div>

  return (
    <div className="page colorful">
      <h1>My Profile</h1>
      <div className="card form-grid">
        <input placeholder="Name" value={profile.name || ''} onChange={e=>setProfile({...profile, name:e.target.value})} />
        <input placeholder="Email" value={profile.email || ''} onChange={e=>setProfile({...profile, email:e.target.value})} />
        <input placeholder="City" value={profile.city || ''} onChange={e=>setProfile({...profile, city:e.target.value})} />
        <input placeholder="Designation" value={profile.designation || ''} onChange={e=>setProfile({...profile, designation:e.target.value})} />
        <input placeholder="Gender" value={profile.gender || ''} onChange={e=>setProfile({...profile, gender:e.target.value})} />
        <input placeholder="Subscription" value={profile.subscription || ''} onChange={e=>setProfile({...profile, subscription:e.target.value})} />
        <input placeholder="Plan details" value={profile.subscriptionPlanDetails || ''} onChange={e=>setProfile({...profile, subscriptionPlanDetails:e.target.value})} />
      </div>
      <button onClick={save}>Save</button>
    </div>
  )
}