import React, { useEffect, useState } from 'react'
import API, { setToken } from '../api'

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setToken(token);
    (async () => {
      try { const r = await API.get('/tickets/me'); setTickets(r.data); }
      catch (err) { console.error('Failed to load tickets', err); }
    })();
  }, []);
  return <div>
    <h2 className="text-xl font-bold mb-4">My Tickets</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tickets.map(t => (
        <div key={t._id} className="card p-5">
          <h3 className="font-semibold">{t.event.title}</h3>
          <p className="text-gray-600 text-sm">Seat: {t.seatNumber}</p>
          {t.qrCodeDataUrl && <img src={t.qrCodeDataUrl} alt="qr" className="mt-3 w-40 h-40 object-contain" />}
        </div>
      ))}
      {tickets.length === 0 && <div className="text-gray-600">No tickets yet.</div>}
    </div>
  </div>
}
