import { useEffect, useMemo, useState } from 'react'
import { ShieldCheck, Users } from 'lucide-react'
import axiosInstance from '../../app/axios'
import { useAppSelector } from '../../hooks'

interface User {
  id: number
  _id: number
  username: string
  email: string
  name: string
  isAdmin: boolean
}

// Purpose: Admin users page for viewing active administrator accounts.
// Props: None.
// Usage: Render at /admin/admin-users to review internal admin access.
const AdminUsersPage = () => {
  const token = useAppSelector((state) => state.user.userInfo?.token)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const adminUsers = useMemo(() => users.filter((user) => user.isAdmin), [users])

  const authConfig = () => ({
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  })

  const fetchUsers = async () => {
    if (!token) {
      setError('Admin login required to fetch admin users.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await axiosInstance.get<User[]>('/api/users/', authConfig())
      setUsers(response.data)
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Unable to fetch admin users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [token])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-bg-surface/40 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-text-muted">Admin users</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Team access</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-text-muted">Review active administrator accounts and access details.</p>
        </div>
        <div className="inline-flex items-center gap-3 rounded-full bg-bg-surface/60 px-5 py-3 text-sm font-semibold text-white">
          <Users className="h-4 w-4 text-primary" />
          {adminUsers.length} admins
        </div>
      </div>

      {error && <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}

      <div className="rounded-2xl border border-border/60 bg-bg-surface/40 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
        <div className="mb-6 flex items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Administrators</h2>
            <p className="mt-1 text-sm text-text-muted">Only users with admin privileges are shown.</p>
          </div>
          <button
            type="button"
            onClick={fetchUsers}
            disabled={loading}
            className="rounded-full bg-bg-surface/60 px-5 py-3 text-sm font-semibold text-white transition hover:bg-bg-surface/80 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-border/60 bg-bg-surface/40 p-8 text-center text-text-base">Loading admin users...</div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-bg-surface/40 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
            <table className="min-w-full divide-y divide-border/60 text-sm">
              <thead className="bg-bg-surface/60 text-text-muted">
                <tr>
                  <th className="px-5 py-4 text-left font-semibold tracking-wide">ID</th>
                  <th className="px-5 py-4 text-left font-semibold tracking-wide">Name</th>
                  <th className="px-5 py-4 text-left font-semibold tracking-wide">Email</th>
                  <th className="px-5 py-4 text-left font-semibold tracking-wide">Username</th>
                  <th className="px-5 py-4 text-left font-semibold tracking-wide">Role</th>
                  <th className="px-5 py-4 text-left font-semibold tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 bg-bg-surface/40">
                {adminUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-text-muted">
                      No admin users available yet.
                    </td>
                  </tr>
                ) : (
                  adminUsers.map((user) => (
                    <tr key={user.id} className="transition duration-200 hover:bg-bg-surface/60">
                      <td className="px-5 py-4 align-top text-text-muted">{user.id}</td>
                      <td className="px-5 py-4 align-top font-semibold text-white">{user.name}</td>
                      <td className="px-5 py-4 align-top text-text-base">{user.email}</td>
                      <td className="px-5 py-4 align-top text-text-base">{user.username}</td>
                      <td className="px-5 py-4 align-top">
                        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Admin
                        </span>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminUsersPage
