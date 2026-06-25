import React, { useState } from 'react'
import API from '../api'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const nav = useNavigate();
  const submit = async (e) => { e.preventDefault(); await API.post('/auth/register', { name, email, password }); nav('/login'); }
  return <div className="max-w-md mx-auto card p-8">
    <h2 className="heading-2">Register</h2>
    <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="input" />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="input" />
      <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" className="input" />
      <button className="btn-primary">Register</button>
    </form>
  </div>
}
