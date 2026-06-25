import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, redirect } from 'react-router-dom'
import App from './App'
import Home from './pages/Home'
import Events from './pages/Events'
import EventDetails from './pages/EventDetails'
import Login from './pages/Login'
import Register from './pages/Register'
import MyTickets from './pages/MyTickets'
import AdminDashboard from './pages/AdminDashboard'
import API, { setToken } from './api'
import './index.css'

async function guardAdmin() {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('no token');
    setToken(token);
    const { data } = await API.get('/auth/me');
    if (data?.role !== 'admin') throw new Error('forbidden');
    return null;
  } catch (e) {
    throw redirect('/login');
  }
}

const router = createBrowserRouter([
  {
    path: '/', element: <App />, children: [
      { index: true, element: <Home /> },
      { path: 'events', element: <Events /> },
      { path: 'events/:id', element: <EventDetails /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'mytickets', element: <MyTickets /> },
      { path: 'admin', element: <AdminDashboard />, loader: guardAdmin },
    ]
  }
], { future: { v7_startTransition: true, v7_relativeSplatPath: true } });

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} future={{ v7_startTransition: true, v7_relativeSplatPath: true }} />
  </React.StrictMode>
)
