import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const token = localStorage.getItem('token')
  const username = localStorage.getItem('username')
  const navigate = useNavigate()

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('userId')
    navigate('/')
    window.location.reload()
  }

  return (
    <nav>
      <Link to="/" className="brand">📝 NoteShare</Link>
      <div className="links">
        <Link to="/browse">Browse</Link>
        {token ? (
          <>
            <Link to="/upload">Upload</Link>
            <Link to="/my-notes">My Notes</Link>
            <span style={{ color: '#888', fontSize: 14 }}>Hi, {username}</span>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  )
}
