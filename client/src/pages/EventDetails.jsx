import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import API, { setToken } from '../api'

export default function EventDetails() {
  const { id } = useParams();
  const [ev, setEv] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [paying, setPaying] = useState(false);
  useEffect(() => { API.get(`/events/${id}`).then(r => setEv(r.data)).catch(() => { }); }, [id]);
  const book = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Login first');
    setToken(token);
    if (!selectedSeat) return alert('Please select a seat');
    // Simulated payment step
    setPaying(true);
    const confirmed = confirm(`Confirm payment of $${ev.price} for seat ${selectedSeat}?`);
    setPaying(false);
    if (!confirmed) return;
    const res = await API.post(`/tickets/book/${id}`, { seatNumber: selectedSeat });
    alert('Booked!');
    console.log(res.data);
  }
  if (!ev) return <div>Loading...</div>
  return <div className="card p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="md:col-span-2">
      <h2 className="text-2xl font-bold">{ev.title}</h2>
      <p className="mt-2 text-gray-700">{ev.description}</p>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div className="p-3 rounded border bg-gray-50">Date<br /><span className="font-medium">{new Date(ev.date).toLocaleString()}</span></div>
        <div className="p-3 rounded border bg-gray-50">Venue<br /><span className="font-medium">{ev.venue}</span></div>
      </div>
      <div className="mt-6">
        <div className="font-semibold mb-2">Select a seat</div>
        <div className="grid grid-cols-8 gap-2 max-w-xl">
          {ev.seats?.map(s => {
            const booked = s.booked;
            const isSelected = selectedSeat === s.seatNumber;
            return (
              <button
                key={s.seatNumber}
                disabled={booked}
                onClick={() => setSelectedSeat(s.seatNumber)}
                className={`px-2 py-1 rounded text-sm border ${booked ? 'bg-gray-300 cursor-not-allowed' : isSelected ? 'bg-blue-600 text-white' : 'bg-white hover:bg-blue-50'}`}
                title={booked ? 'Booked' : `Seat ${s.seatNumber}`}
              >
                {s.seatNumber}
              </button>
            )
          })}
        </div>
        {selectedSeat && <div className="mt-2 text-sm text-gray-700">Selected seat: <span className="font-medium">{selectedSeat}</span></div>}
      </div>
    </div>
    <div className="md:col-span-1">
      <div className="p-4 rounded border bg-gray-50">
        <div className="text-3xl font-bold">${ev.price}</div>
        <div className="text-gray-600 mt-1">Per ticket</div>
        <button onClick={book} disabled={paying} className="mt-4 w-full btn-primary">{paying ? 'Processing...' : 'Book Ticket'}</button>
      </div>
    </div>
  </div>
}
