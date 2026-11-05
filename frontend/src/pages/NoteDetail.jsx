import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getNoteById, getDownloadUrl } from '../api'

export default function NoteDetail() {
  const { id } = useParams()
  const [note, setNote] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    getNoteById(id).then(data => {
      if (data.error) setError(data.error)
      else setNote(data)
      setLoading(false)
    })
  }, [id])

  function copyLink() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return <div className="spinner">Loading...</div>

  if (error) return (
    <div className="page">
      <div className="detail-card" style={{ textAlign: 'center' }}>
        <p style={{ color: '#e53e3e', marginBottom: 16 }}>🔒 {error}</p>
        <Link to="/login" className="btn btn-primary" style={{ display: 'inline-block', width: 'auto', padding: '10px 24px' }}>Login</Link>
      </div>
    </div>
  )

  const downloadUrl = getDownloadUrl(id)

  return (
    <div className="page">
      <div className="detail-card">
        <span style={{
          display: 'inline-block', padding: '3px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600,
          background: note.public ? '#c6f6d5' : '#e2e8f0',
          color: note.public ? '#276749' : '#4a5568', marginBottom: 14
        }}>
          {note.public ? '🌐 Public' : '🔒 Private'}
        </span>
        <h2>{note.title}</h2>
        <div className="info-row">
          <span>👤 {note.uploaderName}</span>
          <span>📄 {note.fileName}</span>
          <span>🕒 {new Date(note.createdAt).toLocaleDateString()}</span>
        </div>
        {note.description && <p>{note.description}</p>}

        <a
          href={downloadUrl}
          className="btn btn-primary"
          style={{ display: 'block', marginBottom: 16 }}
          download
        >
          ⬇️ Download File
        </a>

        <div className="share-box">
          <input readOnly value={window.location.href} />
          <button className="btn btn-outline" onClick={copyLink} style={{ whiteSpace: 'nowrap' }}>
            {copied ? '✅ Copied!' : '📋 Copy Link'}
          </button>
        </div>

        <div style={{ marginTop: 20 }}>
          <Link to="/browse" style={{ color: '#667eea', textDecoration: 'none', fontSize: 14 }}>
            ← Back to Browse
          </Link>
        </div>
      </div>
    </div>
  )
}
