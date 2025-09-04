import React from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import API, { setToken } from './api'

export default function App() {
  const nav = useNavigate();
  const [user, setUser] = React.useState(null);
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setToken(token);
    API.get('/auth/me').then(r => setUser(r.data)).catch(() => setUser(null));
  }, []);
  const onLogout = () => {
    try { localStorage.removeItem('token'); setToken(null); } catch (e) { }
    nav('/login');
  }
  const isAuthed = typeof window !== 'undefined' && !!localStorage.getItem('token');
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white border-b">
        <div className="container mx-auto p-4 flex gap-4 items-center">
          <Link to="/" className="font-bold">EventX</Link>
          <Link to="/events" className="hover:text-blue-600">Events</Link>
          <Link to="/mytickets" className="hover:text-blue-600">My Tickets</Link>
          {user?.role === 'admin' && <Link to="/admin" className="hover:text-blue-600">Admin</Link>}
          <div className="ml-auto flex items-center gap-3">
            {!isAuthed && <Link to="/login" className="text-blue-600">Login</Link>}
            {!isAuthed && <Link to="/register" className="btn-secondary">Register</Link>}
            {isAuthed && <button onClick={onLogout} className="btn-secondary">Logout</button>}
          </div>
        </div>
      </nav>
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  )
}
