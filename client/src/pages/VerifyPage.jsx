import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { authApi } from '../lib/api'

export default function VerifyPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const phoneNumber = location.state?.phoneNumber || ''
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await authApi.verify(phoneNumber, code)
      localStorage.setItem('token', data.token)
      navigate('/')
    } catch (e) {
      alert('Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  if (!phoneNumber) return <div className="page"><p>Missing phone number. <a href="/login">Back to login</a></p></div>

  return (
    <div className="page colorful">
      <h1>Verify OTP</h1>
      <form onSubmit={onSubmit} className="card">
        <input maxLength={6} placeholder="6-digit code" value={code} onChange={(e)=>setCode(e.target.value)} />
        <button disabled={loading || code.length !== 6}>{loading ? 'Verifying...' : 'Verify'}</button>
      </form>
    </div>
  )
}