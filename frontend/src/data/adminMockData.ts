import type { LucideIcon } from 'lucide-react'

export interface StatItem {
  label: string
  value: string
  change: string
  icon: LucideIcon
  color: string
}

export interface ProductItem {
  id: string
  name: string
  sku: string
  category: string
  price: string
  stock: number
  status: string
  rating: string
  image: string
}

export interface OrderItem {
  id: string
  customer: string
  date: string
  total: string
  status: string
  payment: string
}

export interface CustomerItem {
  id: string
  name: string
  email: string
  company: string
  spend: string
  status: string
}

export interface ChefItem {
  id: string
  name: string
  email: string
  company: string
  earn: string
  status: string
}

export interface AddressItem {
  id: string
  label: string
  customer: string
  location: string
  deliveries: string
}

export interface TrackingItem {
  id: string
  shipment: string
  eta: string
  status: string
  progress: number
}

export interface ReviewItem {
  id: string
  product: string
  customer: string
  rating: string
  comment: string
  status: string
}

export interface CouponItem {
  id: string
  code: string
  discount: string
  expires: string
  usage: string
  status: string
}

export interface AdminUserItem {
  id: string
  name: string
  role: string
  email: string
  status: string
}

export interface RoleItem {
  id: string
  name: string
  permissions: string[]
}

export const adminStats: StatItem[] = [
  {
    label: 'Monthly revenue',
    value: '₹178.2k',
    change: '+12.9%',
    icon: null as unknown as LucideIcon,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    label: 'New orders',
    value: '1,024',
    change: '+8.1%',
    icon: null as unknown as LucideIcon,
    color: 'from-sky-500 to-indigo-500',
  },
  {
    label: 'Active customers',
    value: '12.4k',
    change: '+6.3%',
    icon: null as unknown as LucideIcon,
    color: 'from-violet-500 to-fuchsia-500',
  },
  {
    label: 'Return rate',
    value: '3.8%',
    change: '-1.2%',
    icon: null as unknown as LucideIcon,
    color: 'from-amber-500 to-orange-500',
  },
]

export const products: ProductItem[] = [
  {
    id: 'P-1001',
    name: 'Aurora Linen Shirt',
    sku: 'AL-510',
    category: 'Apparel',
    price: '₹49',
    stock: 46,
    status: 'Active',
    rating: '4.8',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'P-1002',
    name: 'Noir Backpack',
    sku: 'NB-300',
    category: 'Accessories',
    price: '₹89',
    stock: 12,
    status: 'Low stock',
    rating: '4.6',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'P-1003',
    name: 'Hydra Wireless Headphones',
    sku: 'HW-212',
    category: 'Electronics',
    price: '₹129',
    stock: 98,
    status: 'Active',
    rating: '4.9',
    image: 'https://images.unsplash.com/photo-1512499617640-c2f999058b1f?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'P-1004',
    name: 'Café Ceramic Set',
    sku: 'CC-720',
    category: 'Home',
    price: '₹34',
    stock: 29,
    status: 'Active',
    rating: '4.7',
    image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=600&q=80',
  },
]

export const orders: OrderItem[] = [
  { id: 'ORD-3218', customer: 'Nadia Myers', date: '2026-05-21', total: '₹564', status: 'Confirmed', payment: 'Visa' },
  { id: 'ORD-3217', customer: 'Skylar Reed', date: '2026-05-20', total: '₹1,280', status: 'Shipped', payment: 'PayPal' },
  { id: 'ORD-3216', customer: 'Eli Robbins', date: '2026-05-19', total: '₹96', status: 'Processing', payment: 'Apple Pay' },
  { id: 'ORD-3215', customer: 'Ariana Chen', date: '2026-05-18', total: '₹248', status: 'Returned', payment: 'Mastercard' },
]

export const customers: CustomerItem[] = [
  { id: 'C-100', name: 'Nadia Myers', email: 'nadia@example.com', company: 'Luma Studio', spend: '₹9,800', status: 'VIP' },
  { id: 'C-101', name: 'Skylar Reed', email: 'skylar@example.com', company: 'Boreal Labs', spend: '₹4,160', status: 'Active' },
  { id: 'C-102', name: 'Eli Robbins', email: 'eli@example.com', company: 'Maven Co.', spend: '₹1,240', status: 'New' },
  { id: 'C-103', name: 'Ariana Chen', email: 'ariana@example.com', company: 'Studio Eleven', spend: '₹2,720', status: 'Churn' },
]

export const chefs: ChefItem[] = [
  { id: 'C-100', name: 'Gordon Ramsay', email: 'gordon@example.com', company: 'Hells Kitchen', earn: '₹9,800', status: 'VIP' },
  { id: 'C-101', name: 'Alain Ducasse', email: 'alain@example.com', company: 'Ducasse Empire', earn: '₹4,160', status: 'Active' },
  { id: 'C-102', name: 'Wolfgang Puck', email: 'wolfgang@example.com', company: 'Maven Co.', earn: '₹1,240', status: 'New' },
  { id: 'C-103', name: 'Thomas Keller', email: 'thomas@example.com', company: 'French Laundry', earn: '₹2,720', status: 'Churn' },
]

export const addresses: AddressItem[] = [
  { id: 'A-210', label: 'Warehouse B', customer: 'Nadia Myers', location: 'Brooklyn, NY', deliveries: '128' },
  { id: 'A-211', label: 'Office HQ', customer: 'Skylar Reed', location: 'San Francisco, CA', deliveries: '84' },
  { id: 'A-212', label: 'Pop-up Store', customer: 'Eli Robbins', location: 'Austin, TX', deliveries: '47' },
]

export const tracking: TrackingItem[] = [
  { id: 'T-815', shipment: 'Express A12', eta: '2h 34m', status: 'On route', progress: 68 },
  { id: 'T-816', shipment: 'Local D14', eta: '5h 20m', status: 'Delayed', progress: 42 },
  { id: 'T-817', shipment: 'Global S09', eta: '1d 2h', status: 'In transit', progress: 81 },
]

export const reviews: ReviewItem[] = [
  { id: 'R-450', product: 'Hydra Wireless Headphones', customer: 'Nadia Myers', rating: '5.0', comment: 'Exceptional sound and premium fit.', status: 'Published' },
  { id: 'R-451', product: 'Noir Backpack', customer: 'Skylar Reed', rating: '4.6', comment: 'Stylish and durable, perfect for travel.', status: 'Published' },
  { id: 'R-452', product: 'Aurora Linen Shirt', customer: 'Eli Robbins', rating: '4.2', comment: 'Soft feel, but sizing runs slightly large.', status: 'Moderation' },
]

export const coupons: CouponItem[] = [
  { id: 'CP-109', code: 'SPRING25', discount: '25%', expires: '2026-07-01', usage: '124', status: 'Active' },
  { id: 'CP-110', code: 'FREESHIP', discount: '₹0 Shipping', expires: '2026-06-15', usage: '420', status: 'Active' },
  { id: 'CP-111', code: 'NEW10', discount: '10%', expires: '2026-06-30', usage: '58', status: 'Expired' },
]

export const adminUsers: AdminUserItem[] = [
  { id: 'U-01', name: 'Leila Hart', role: 'Owner', email: 'leila@brand.com', status: 'Active' },
  { id: 'U-02', name: 'Jonas Price', role: 'Product Manager', email: 'jonas@brand.com', status: 'Active' },
  { id: 'U-03', name: 'Mira Patel', role: 'Support Specialist', email: 'mira@brand.com', status: 'Invited' },
]

export const roles: RoleItem[] = [
  { id: 'R-01', name: 'Owner', permissions: ['All pages', 'Manage users', 'Billing & settings'] },
  { id: 'R-02', name: 'Manager', permissions: ['Products', 'Orders', 'Customers', 'Analytics'] },
  { id: 'R-03', name: 'Support', permissions: ['Orders', 'Customers', 'Returns'] },
]

export const categories = [
  { id: 'CAT-1', label: 'Apparel', products: 24 },
  { id: 'CAT-2', label: 'Accessories', products: 12 },
  { id: 'CAT-3', label: 'Electronics', products: 18 },
  { id: 'CAT-4', label: 'Home & Living', products: 9 },
]

export const inventorySummary = [
  { id: 'INV-1', label: 'Fast-moving', value: '234' },
  { id: 'INV-2', label: 'Low stock', value: '16' },
  { id: 'INV-3', label: 'Out of stock', value: '4' },
  { id: 'INV-4', label: 'Backordered', value: '9' },
]

export const supportTasks = [
  { id: 'T-001', title: 'Review returns for Q2', badge: 'High priority' },
  { id: 'T-002', title: 'Approve new coupons', badge: 'Medium priority' },
  { id: 'T-003', title: 'Audit product inventory report', badge: 'Low priority' },
]
