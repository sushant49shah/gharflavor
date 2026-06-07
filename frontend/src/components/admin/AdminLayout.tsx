import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.tsx'
import Navbar from './Navbar.tsx'

// Purpose: Admin dashboard shell that provides a sidebar, top navigation, and main admin content area.
// Props: None.
// Usage: Wrap admin page routes with <AdminLayout /> to display the dashboard structure.
const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-bg-dark text-text-base">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 px-4 py-5 lg:px-8 scroll-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
