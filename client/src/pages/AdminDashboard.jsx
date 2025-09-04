import React, { useEffect, useState } from 'react'
import API, { setToken } from '../api'
import dayjs from 'dayjs'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', date: '', venue: '', price: '', totalSeats: '' });
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token'); if (token) setToken(token);
        const r = await API.get('/analytics'); setStats(r.data);
        const ev = await API.get('/events'); setEvents(ev.data);
      } catch (err) { console.error('Failed to load analytics', err); setStats({ error: true }); }
    })();
  }, []);
  const createEvent = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, price: Number(form.price), totalSeats: Number(form.totalSeats), date: new Date(form.date) };
      const r = await API.post('/events', payload);
      setEvents(prev => [r.data, ...prev]);
      setForm({ title: '', description: '', date: '', venue: '', price: '', totalSeats: '' });
    } catch (err) { alert(err?.response?.data?.err || 'Failed to create event'); }
  }
  const deleteEvent = async (id) => {
    if (!confirm('Delete this event?')) return;
    try { await API.delete(`/events/${id}`); setEvents(prev => prev.filter(e => e._id !== id)); }
    catch (err) { alert('Failed to delete'); }
  }
  if (!stats) return <div>Loading...</div>
  if (stats.error) return <div className="bg-white p-6 rounded shadow">Failed to load analytics. Please login as admin.</div>
  return <div className="space-y-6">
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>
      <p className="mt-2">Revenue: ${stats.revenue}</p>
      <p>Tickets sold: {stats.sold}</p>
      <p>Events: {stats.events}</p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie dataKey="value" data={Object.entries(stats.byGender || {}).map(([k, v]) => ({ name: k, value: v }))} cx="50%" cy="50%" outerRadius={80} label>
                {Object.entries(stats.byGender || {}).map(([, v], idx) => (
                  <Cell key={`cell-${idx}`} fill={["#3b82f6", "#10b981", "#f59e0b", "#ef4444"][idx % 4]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-4">
        <a href="/api/analytics/export" target="_blank" rel="noreferrer" className="btn-secondary inline-block">Download CSV</a>
      </div>
    </div>
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <h3 className="text-xl font-bold mb-4">Create Event</h3>
      <form onSubmit={createEvent} className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input className="border p-2" placeholder="Title" value={form.title} onChange={e => setForm(v => ({ ...v, title: e.target.value }))} />
        <input className="border p-2" placeholder="Venue" value={form.venue} onChange={e => setForm(v => ({ ...v, venue: e.target.value }))} />
        <input className="border p-2" placeholder="Price" type="number" value={form.price} onChange={e => setForm(v => ({ ...v, price: e.target.value }))} />
        <input className="border p-2" placeholder="Total Seats" type="number" value={form.totalSeats} onChange={e => setForm(v => ({ ...v, totalSeats: e.target.value }))} />
        <input className="border p-2" placeholder="Date" type="datetime-local" value={form.date} onChange={e => setForm(v => ({ ...v, date: e.target.value }))} />
        <textarea className="border p-2 md:col-span-2" placeholder="Description" value={form.description} onChange={e => setForm(v => ({ ...v, description: e.target.value }))} />
        <div className="md:col-span-2"><button className="btn-primary">Create</button></div>
      </form>
    </div>
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <h3 className="text-xl font-bold mb-4">Events</h3>
      <div className="space-y-3">
        {events.map(e => (
          <div key={e._id} className="flex items-center justify-between border p-3 rounded">
            <div>
              <div className="font-bold">{e.title}</div>
              <div className="text-sm text-gray-600">{dayjs(e.date).format('YYYY-MM-DD HH:mm')} · {e.venue} · ${e.price}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => deleteEvent(e._id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
            </div>
          </div>
        ))}
        {events.length === 0 && <div className="text-gray-600">No events.</div>}
      </div>
    </div>
  </div>
}
