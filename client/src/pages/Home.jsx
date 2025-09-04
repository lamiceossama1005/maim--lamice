import React from 'react'
import API from '../api'
export default function Home() {
  const [upcoming, setUpcoming] = React.useState([]);
  React.useEffect(() => {
    API.get('/events').then(r => {
      const now = Date.now();
      const soon = r.data.filter(e => new Date(e.date).getTime() > now).slice(0, 3);
      setUpcoming(soon);
    }).catch(() => { });
  }, []);
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white rounded-lg card p-10 flex flex-col md:flex-row items-center gap-10">
      <div className="flex-1">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Discover. Book. Enjoy.</h1>
        <p className="mt-3 text-gray-600 max-w-xl">EventX makes it simple to explore upcoming events, reserve your seat, and get instant QR tickets. Built for speed and simplicity.</p>
        <div className="mt-6 flex gap-3">
          <a href="/events" className="btn-primary">Browse Events</a>
          <a href="/login" className="btn-secondary">Login</a>
        </div>
        {upcoming.length > 0 && (
          <div className="mt-6 bg-white p-4 rounded border">
            <div className="font-semibold mb-2">Upcoming events</div>
            <ul className="space-y-1 text-sm">
              {upcoming.map(e => (
                <li key={e._id} className="flex justify-between">
                  <span>{e.title}</span>
                  <span className="text-gray-600">{new Date(e.date).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="flex-1 w-full">
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">Fast</div>
              <div className="text-gray-500 text-sm mt-1">Quick booking</div>
            </div>
            <div>
              <div className="text-2xl font-bold">Secure</div>
              <div className="text-gray-500 text-sm mt-1">JWT protected</div>
            </div>
            <div>
              <div className="text-2xl font-bold">Modern</div>
              <div className="text-gray-500 text-sm mt-1">Clean UI</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
