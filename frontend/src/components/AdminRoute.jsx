import { Navigate, Outlet } from 'react-router-dom'
import { getStoredUser } from '../api'

export default function AdminRoute() {
  return getStoredUser()?.role === 'ADMIN' ? <Outlet /> : <Navigate to="/dashboard" replace />
}
