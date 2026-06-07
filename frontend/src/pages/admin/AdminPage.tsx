import { Routes, Route } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import AdminUsersPage from './AdminUsersPage.tsx'
import CustomersPage from './CustomersPage.tsx'
import ChefPage from './ChefPage.tsx'
import DashboardPage from './DashboardPage'
import DeliveryTrackingPage from './DeliveryTrackingPage.tsx'
import OrdersPage from './OrdersPage.tsx'
import ProductsPage from './ProductsPage.tsx'
import RolesPermissionsPage from './RolesPermissionsPage.tsx'
import ReviewsPage from './ReviewsPage.tsx'
import ShippingAddressesPage from './ShippingAddressesPage.tsx'
import SettingsPage from './SettingsPage.tsx'

// Purpose: Admin route container using nested routing.
// Props: None.
// Usage: Mount at /admin/* inside the main app router to provide admin pages.
const AdminPage = () => {
  return (
    <Routes>
      <Route path="/*" element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="chefs" element={<ChefPage />} />
        <Route path="shipping" element={<ShippingAddressesPage />} />
        <Route path="tracking" element={<DeliveryTrackingPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="admin-users" element={<AdminUsersPage />} />
        <Route path="roles" element={<RolesPermissionsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  )
}

export default AdminPage
