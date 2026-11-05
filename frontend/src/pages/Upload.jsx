import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { uploadNote } from '../api'

export default function Upload() {
  const [form, setForm] = useState({ title: '', description: '', isPublic: false })
  const [file, setFile] = useState(null)
  const [msg, setMsg] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title || !file) { setMsg('Title and file are required'); return }
    setLoading(true)
    setMsg('')

    const fd = new FormData()
    fd.append('title', form.title)
    fd.append('description', form.description)
    fd.append('isPublic', form.isPublic)
    fd.append('file', file)

    const res = await uploadNote(fd)
    setLoading(false)
    if (res.error) { setMsg(res.error); return }
    setSuccess(true)
    setTimeout(() => navigate('/my-notes'), 1500)
  }

  return (
    <div className="page">
      <div className="card" style={{ maxWidth: 480 }}>
        <h2>Upload Notes</h2>
        {msg && <div className="msg error">{msg}</div>}
        {success && <div className="msg success">Uploaded! Redirecting...</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title / Subject</label>
            <input type="text" placeholder="e.g. Data Structures Chapter 3" value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Description (optional)</label>
            <textarea placeholder="Short description of the notes..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="form-group">
            <label>File (PDF, images, etc.)</label>
            <input type="file" onChange={e => setFile(e.target.files[0])} />
          </div>
          <div className="checkbox-group">
            <input type="checkbox" id="public" checked={form.isPublic}
              onChange={e => setForm({ ...form, isPublic: e.target.checked })} />
            <label htmlFor="public">Make this note public (anyone can access)</label>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Uploading...' : 'Upload Note'}
          </button>
        </form>
      </div>
    </div>
  )
}
