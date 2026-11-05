import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../api'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.email || !form.password) { setMsg('All fields required'); return }
    setLoading(true)
    setMsg('')
    const res = await login(form)
    setLoading(false)
    if (res.error) { setMsg(res.error); return }
    localStorage.setItem('token', res.token)
    localStorage.setItem('username', res.username)
    localStorage.setItem('userId', res.userId)
    navigate('/')
    window.location.reload()
  }

  return (
    <div className="page">
      <div className="card">
        <h2>Login</h2>
        {msg && <div className="msg error">{msg}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="you@email.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="••••••" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="form-link">
          No account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  )
}
