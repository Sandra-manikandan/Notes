import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyNotes, deleteNote } from '../api'

export default function MyNotes() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const data = await getMyNotes()
    setNotes(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id) {
    if (!window.confirm('Delete this note?')) return
    await deleteNote(id)
    load()
  }

  function copyLink(id) {
    navigator.clipboard.writeText(`${window.location.origin}/notes/${id}`)
    alert('Link copied!')
  }

  if (loading) return <div className="spinner">Loading...</div>

  return (
    <div className="page top">
      <div className="notes-wrap">
        <h2>My Notes</h2>
        {notes.length === 0 ? (
          <div className="empty">No notes yet. <Link to="/upload" style={{ color: 'white' }}>Upload one!</Link></div>
        ) : (
          <div className="notes-grid">
            {notes.map(note => (
              <div className="note-card" key={note.id}>
                <div>
                  <span className={`badge ${note.public ? 'public' : 'private'}`}>
                    {note.public ? '🌐 Public' : '🔒 Private'}
                  </span>
                </div>
                <h3>{note.title}</h3>
                <p>{note.description || 'No description'}</p>
                <div className="meta">📄 {note.fileName}</div>
                <div className="actions">
                  <button className="btn btn-outline" onClick={() => copyLink(note.id)}>📋 Copy Link</button>
                  <Link to={`/notes/${note.id}`} className="btn btn-success">View</Link>
                  <button className="btn btn-danger" onClick={() => handleDelete(note.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
