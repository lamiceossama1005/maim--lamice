import React, { useState } from 'react'
import API, { setToken } from '../api'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      nav('/');
    } catch (err) {
      const msg = err?.response?.data?.msg || err?.response?.data?.error || err.message || 'Login failed';
      setError(msg);
    } finally { setLoading(false); }
  }
  const quickLogin = async (creds) => {
    try {
      setError(null);
      setLoading(true);
      const res = await API.post('/auth/login', creds);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      nav('/');
    } catch (err) {
      const msg = err?.response?.data?.msg || err?.response?.data?.error || err.message || 'Login failed';
      setError(msg);
    } finally { setLoading(false); }
  }
  return <div className="max-w-md mx-auto card p-8">
    <h2 className="heading-2">Login</h2>
    <div className="mt-4 grid grid-cols-2 gap-2">
      <button type="button" disabled={loading} onClick={() => quickLogin({ email: 'admin@example.com', password: 'password' })} className="btn-secondary">Demo Admin</button>
      <button type="button" disabled={loading} onClick={() => quickLogin({ email: 'alice@example.com', password: 'password' })} className="btn-secondary">Demo User</button>
    </div>
    <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="input" />
      <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" className="input" />
      <button disabled={loading} className="btn-primary">{loading ? 'Signing in...' : 'Login'}</button>
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </form>
  </div>
}
