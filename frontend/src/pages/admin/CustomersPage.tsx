import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Check, Edit2, Layers, Plus, Trash2, X } from 'lucide-react'
import axiosInstance from '../../app/axios'
import { useAppSelector } from '../../hooks'

interface User {
  id: number
  username: string
  email: string
  name: string
  isAdmin: boolean
}

interface Category {
  name: string
  label: string
}

const defaultForm = {
  name: '',
  email: '',
  password: '',
  isAdmin: false,
}

// Purpose: Customer management page backed by the users API.
// Props: None.
// Usage: Render at /admin/customers for user/customer account management.
const CustomersPage = () => {
  const token = useAppSelector((state) => state.user.userInfo?.token)
  const [users, setUsers] = useState<User[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [form, setForm] = useState(defaultForm)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const authConfig = () => ({
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  })

  const fetchUsers = async () => {
    if (!token) return

    setLoading(true)
    setError(null)

    try {
      const response = await axiosInstance.get<User[]>('/api/users/', authConfig())
      setUsers(response.data)
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Unable to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get<Category[]>('/products/categories/')
      setCategories(response.data)
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Unable to fetch categories')
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [token])

  useEffect(() => {
    fetchCategories()
  }, [])

  const resetForm = () => {
    setSelectedUser(null)
    setForm(defaultForm)
    setError(null)
    setSuccess(null)
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setForm({
      name: user.name,
      email: user.email,
      password: '',
      isAdmin: user.isAdmin,
    })
    setError(null)
    setSuccess(null)
  }

  const handleDelete = async (id: number) => {
    if (!token) {
      setError('Admin login required to delete users.')
      return
    }

    if (!window.confirm('Delete this user permanently?')) {
      return
    }

    try {
      setSaving(true)
      await axiosInstance.delete(`/api/users/${id}/`, authConfig())
      setUsers((prev) => prev.filter((user) => user.id !== id))
      setSuccess('User deleted successfully.')

      if (selectedUser?.id === id) {
        resetForm()
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to delete user')
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    if (!token) {
      setError('Admin login required to save users.')
      return
    }

    if (!form.name.trim() || !form.email.trim()) {
      setError('Name and email are required.')
      return
    }

    try {
      setSaving(true)

      if (selectedUser) {
        const response = await axiosInstance.put<User>(
          `/api/users/${selectedUser.id}/`,
          form,
          authConfig(),
        )
        setUsers((prev) => prev.map((user) => (user.id === selectedUser.id ? response.data : user)))
        setSuccess('User updated successfully.')
      } else {
        const response = await axiosInstance.post<User>('/api/users/', form, authConfig())
        setUsers((prev) => [response.data, ...prev])
        setSuccess('User created successfully.')
      }

      resetForm()
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to save user')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-bg-surface/40 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-text-muted">Customers</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Users</h1>
          <p className="mt-2 max-w-2xl text-sm text-text-muted">Manage registered customers and admin access from one page.</p>
        </div>
        <button
          type="button"
          onClick={resetForm}
          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-accent hover:text-accent"
        >
          <Plus className="h-4 w-4" />
          New user
        </button>
      </div>

      <div className="grid gap-8">
        <section className="rounded-3xl border border-border bg-bg-dark/90 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">User directory</h2>
              <p className="mt-1 text-sm text-text-muted">User list with edit and delete controls.</p>
            </div>
            <span className="rounded-full bg-bg-surface/60 px-3 py-1 text-xs text-text-muted">{users.length} users</span>
          </div>

          {loading ? (
            <div className="rounded-2xl bg-[#111111] p-6 text-center text-white">Loading users...</div>
          ) : (
            <div className="overflow-x-auto rounded-3xl border border-border bg-bg-surface/60">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-bg-surface/70 text-[10px] uppercase tracking-[0.3em] text-text-muted">
                  <tr>
                    <th className="px-4 py-4">ID</th>
                    <th className="px-4 py-4">Name</th>
                    <th className="px-4 py-4">Email</th>
                    <th className="px-4 py-4">Admin</th>
                    <th className="px-4 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr
                      key={user.id}
                      className={`${index % 2 === 0 ? 'bg-bg-surface/20' : 'bg-bg-surface/10'} border-b border-border/30`}
                    >
                      <td className="px-4 py-4 text-text-muted">{user.id}</td>
                      <td className="px-4 py-4 font-medium text-white">{user.name}</td>
                      <td className="px-4 py-4 text-text-muted">{user.email}</td>
                      <td className="px-4 py-4">
                        {user.isAdmin ? (
                          <Check className="h-5 w-5 text-accent" />
                        ) : (
                          <X className="h-5 w-5 text-text-muted" />
                        )}
                      </td>
                      <td className="flex gap-2 px-4 py-4">
                        <button
                          type="button"
                          onClick={() => handleEdit(user)}
                          className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-white transition-colors hover:border-accent hover:text-accent"
                        >
                          <Edit2 className="inline-block h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(user.id)}
                          className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700"
                        >
                          <Trash2 className="inline-block h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-border bg-bg-dark/90 p-6">
            <div>
              <h2 className="text-xl font-semibold text-white">{selectedUser ? 'Edit user' : 'Create user'}</h2>
              <p className="mt-2 text-sm text-text-muted">
                {selectedUser ? 'Update the selected user details.' : 'Add a new user account for the admin panel.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block text-sm text-[#C6C2B1]">
                Full name
                <input
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-2xl border border-[#333333] bg-[#111111] px-4 py-3 text-white outline-none focus:border-accent"
                  placeholder="Jane Doe"
                />
              </label>

              <label className="block text-sm text-[#C6C2B1]">
                Email address
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-2xl border border-[#333333] bg-[#111111] px-4 py-3 text-white outline-none focus:border-accent"
                  placeholder="jane@example.com"
                />
              </label>

              <label className="block text-sm text-[#C6C2B1]">
                Password
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-2xl border border-[#333333] bg-[#111111] px-4 py-3 text-white outline-none focus:border-accent"
                  placeholder={selectedUser ? 'Leave empty to keep current password' : 'Enter temporary password'}
                />
              </label>

              <label className="flex items-center gap-3 text-sm text-[#C6C2B1]">
                <input
                  type="checkbox"
                  name="isAdmin"
                  checked={form.isAdmin}
                  onChange={handleInputChange}
                  className="h-4 w-4 accent-accent"
                />
                Admin privileges
              </label>

              {error && <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}
              {success && <p className="rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-100">{success}</p>}

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? 'Saving...' : selectedUser ? 'Save user' : 'Create user'}
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-border bg-bg-dark/90 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Product categories</h2>
                <p className="mt-2 text-sm text-text-muted">Categories loaded from the backend.</p>
              </div>
              <Layers className="h-5 w-5 text-text-base" />
            </div>
            <div className="mt-5 grid gap-3">
              {categories.map((category) => (
                <div key={category.name} className="rounded-2xl border border-border/60 bg-bg-surface/40 px-4 py-3">
                  <p className="text-sm font-semibold text-white">{category.label}</p>
                  <p className="mt-1 text-xs text-text-muted">{category.name}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default CustomersPage
