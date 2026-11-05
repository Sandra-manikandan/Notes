import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPublicNotes } from '../api'

export default function Browse() {
  const [notes, setNotes] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPublicNotes().then(data => {
      setNotes(Array.isArray(data) ? data : [])
      setLoading(false)
    })
  }, [])

  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    (n.description || '').toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="spinner">Loading...</div>

  return (
    <div className="page top">
      <div className="notes-wrap">
        <h2>Browse Public Notes</h2>
        <input
          className="search-bar"
          placeholder="Search by title or description..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {filtered.length === 0 ? (
          <div className="empty">No notes found.</div>
        ) : (
          <div className="notes-grid">
            {filtered.map(note => (
              <div className="note-card" key={note.id}>
                <span className="badge public">🌐 Public</span>
                <h3>{note.title}</h3>
                <p>{note.description || 'No description'}</p>
                <div className="meta">By {note.uploaderName} · 📄 {note.fileName}</div>
                <div className="actions">
                  <Link to={`/notes/${note.id}`} className="btn btn-success">View &amp; Download</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
