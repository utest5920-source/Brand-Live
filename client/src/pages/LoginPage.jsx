import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../lib/api'

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [demoOtp, setDemoOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await authApi.login(phoneNumber, referralCode || undefined)
      setDemoOtp(data.demoCode || '')
      navigate('/verify', { state: { phoneNumber } })
    } catch (e) {
      alert('Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page colorful">
      <h1>Login with OTP</h1>
      <form onSubmit={onSubmit} className="card">
        <input placeholder="Phone number" value={phoneNumber} onChange={(e)=>setPhoneNumber(e.target.value)} />
        <input placeholder="Referral code (optional)" value={referralCode} onChange={(e)=>setReferralCode(e.target.value)} />
        <button disabled={loading || !phoneNumber}>{loading ? 'Sending...' : 'Send OTP'}</button>
      </form>
      {demoOtp && (
        <p className="hint">Demo OTP: <strong>{demoOtp}</strong></p>
      )}
    </div>
  )
}