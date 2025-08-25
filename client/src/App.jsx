import { Routes, Route, Navigate, Link } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/LoginPage'
import VerifyPage from './pages/VerifyPage'
import Dashboard from './pages/Dashboard'
import ProfilePage from './pages/ProfilePage'
import BusinessPage from './pages/BusinessPage'
import PoliticalPage from './pages/PoliticalPage'
import FramesPage from './pages/FramesPage'
import CategoriesPage from './pages/CategoriesPage'

function RequireAuth({ children }) {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/login" replace />
  return children
}

function App() {
  return (
    <div className="app-root">
      <nav className="top-nav">
        <Link to="/">Home</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/business">Business</Link>
        <Link to="/political">Political</Link>
        <Link to="/frames">Frames</Link>
        <Link to="/categories">Categories</Link>
      </nav>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
        <Route path="/business" element={<RequireAuth><BusinessPage /></RequireAuth>} />
        <Route path="/political" element={<RequireAuth><PoliticalPage /></RequireAuth>} />
        <Route path="/frames" element={<RequireAuth><FramesPage /></RequireAuth>} />
        <Route path="/categories" element={<RequireAuth><CategoriesPage /></RequireAuth>} />
      </Routes>
    </div>
  )
}

export default App
