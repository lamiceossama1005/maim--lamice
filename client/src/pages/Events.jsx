import React, { useEffect, useState } from 'react'
import API from '../api'
import { Link } from 'react-router-dom'

export default function Events() {
  const [events, setEvents] = useState([]);
  const [query, setQuery] = useState('');
  useEffect(() => { API.get('/events').then(r => setEvents(r.data)).catch(() => { }); }, []);
  const filtered = events.filter(e => e.title?.toLowerCase().includes(query.toLowerCase()));
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h2 className="text-xl font-bold">Events</h2>
        <div className="w-full md:w-auto">
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search events..." className="border p-2 w-full md:w-80 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(e => (
          <div key={e._id} className="card p-5 flex flex-col">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{e.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{new Date(e.date).toLocaleString()}</p>
              <p className="mt-3 font-medium">${e.price}</p>
            </div>
            <Link to={`/events/${e._id}`} className="mt-4 inline-block text-center btn-primary">Details</Link>
          </div>
        ))}
        {filtered.length === 0 && <div className="text-gray-600">No events found.</div>}
      </div>
    </div>
  )
}
