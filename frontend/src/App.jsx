import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Upload from './pages/Upload'
import MyNotes from './pages/MyNotes'
import Browse from './pages/Browse'
import NoteDetail from './pages/NoteDetail'

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/notes/:id" element={<NoteDetail />} />
        <Route path="/upload" element={<PrivateRoute><Upload /></PrivateRoute>} />
        <Route path="/my-notes" element={<PrivateRoute><MyNotes /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
