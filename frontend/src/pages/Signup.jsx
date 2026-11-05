import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signup } from '../api'

export default function Signup() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [msg, setMsg] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.username || !form.email || !form.password) { setMsg('All fields required'); return }
    if (form.password.length < 6) { setMsg('Password must be at least 6 characters'); return }
    setLoading(true)
    setMsg('')
    const res = await signup(form)
    setLoading(false)
    if (res.error) { setMsg(res.error); return }
    setSuccess(true)
    setTimeout(() => navigate('/login'), 1500)
  }

  return (
    <div className="page">
      <div className="card">
        <h2>Create Account</h2>
        {msg && <div className="msg error">{msg}</div>}
        {success && <div className="msg success">Account created! Redirecting...</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" placeholder="Your name" value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="you@email.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Min 6 characters" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        <div className="form-link">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  )
}
