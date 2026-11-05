import { Link } from 'react-router-dom'

export default function Home() {
  const token = localStorage.getItem('token')
  return (
    <div className="page">
      <div className="hero">
        <h1>📝 NoteShare</h1>
        <p>Upload your notes, share them with anyone, and discover notes from others.</p>
        <div className="hero-btns">
          <Link to="/browse" className="btn-white">Browse Notes</Link>
          {token ? (
            <Link to="/upload" className="btn-ghost">Upload Notes</Link>
          ) : (
            <Link to="/signup" className="btn-ghost">Get Started</Link>
          )}
        </div>
      </div>
    </div>
  )
}
