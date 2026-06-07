import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Repeat, Truck } from 'lucide-react'
import DataTable from '../../components/admin/DataTable'
import Badge from '../../components/admin/Badge'
import axiosInstance from '../../app/axios'
import { useAppSelector } from '../../hooks'

const tabs = ['All orders', 'Cancelled/Refunded', 'Confirmed', 'Shipped', 'Processing'] as const
const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'] as const

type OrderTab = (typeof tabs)[number]
type OrderStatus = (typeof statusOptions)[number]

interface OrderItem {
  id: number
  product_name: string
  variant_name: string
  unit_price: string
  quantity: number
  line_total: string
}

interface ShippingAddress {
  id: number
  label: string
  full_name: string
  phone: string
  street: string
  city: string
  state: string
  postal_code: string
  country: string
}

interface Order {
  id: number
  order_number: string
  customer_name: string
  customer_email: string
  status: OrderStatus | string
  payment_method: string
  payment_status: string
  subtotal: string
  discount: string
  shipping_cost: string
  total: string
  created_at: string
  updated_at: string
  shipping_address: ShippingAddress
  items: OrderItem[]
}

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
  pending_cod: 'Pending COD',
}

const statusMap = {
  'All orders': null,
  'Cancelled/Refunded': ['cancelled', 'refunded'],
  Confirmed: ['confirmed'],
  Shipped: ['shipped'],
  Processing: ['processing'],
} as const

const formatCurrency = (value: string | number) => `₹${Number(value || 0).toFixed(2)}`

const formatDate = (date: string) => new Date(date).toLocaleDateString()

const getStatusVariant = (status: string) => {
  if (status === 'delivered' || status === 'confirmed') return 'success'
  if (status === 'cancelled' || status === 'refunded') return 'danger'
  return 'warning'
}

// Purpose: Orders page with backend-backed fulfillment management.
// Props: None.
// Usage: Render at /admin/orders to manage real customer orders.
const OrdersPage = () => {
  const token = useAppSelector((state) => state.user.userInfo?.token)
  const [activeTab, setActiveTab] = useState<OrderTab>('All orders')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [savingOrderId, setSavingOrderId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const authConfig = () => ({
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  })

  const fetchOrders = async () => {
    if (!token) {
      setError('Admin login required to fetch orders.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await axiosInstance.get<Order[]>('/api/orders/admin/', authConfig())
      setOrders(response.data)
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Unable to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [token])

  const filteredOrders = useMemo(() => {
    const statuses = statusMap[activeTab]

    if (!statuses) {
      return orders
    }

    return orders.filter((order) => statuses.includes(order.status as never))
  }, [activeTab, orders])

  const completedOrders = orders.filter((order) => order.status === 'delivered').length
  const returnRequests = orders.filter((order) => order.status === 'refunded' || order.status === 'cancelled').length

  const updateOrderStatus = async (order: Order, newStatus: string) => {
    if (!token) {
      setError('Admin login required to update orders.')
      return
    }

    setSavingOrderId(order.id)
    setError(null)
    setSuccess(null)

    try {
      const response = await axiosInstance.post<Order>(
        '/api/orders/admin/',
        { order_id: order.id, status: newStatus },
        authConfig(),
      )
      setOrders((prev) => prev.map((item) => (item.id === order.id ? response.data : item)))
      setSelectedOrder((prev) => (prev?.id === order.id ? response.data : prev))
      setSuccess(`Order ${response.data.order_number} updated to ${statusLabels[response.data.status] || response.data.status}.`)
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to update order')
    } finally {
      setSavingOrderId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-bg-surface/40 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-text-muted">Orders</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Fulfillment workflow</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-text-muted">Track every order from confirmation through delivery with built-in return handling.</p>
        </div>
        <button
          type="button"
          onClick={fetchOrders}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Truck className="h-4 w-4" /> {loading ? 'Refreshing...' : 'Refresh orders'}
        </button>
      </div>

      {error && <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}
      {success && <p className="rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-100">{success}</p>}

      <div className="rounded-2xl border border-border/60 bg-bg-surface/40 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
        <div className="flex flex-wrap items-center gap-3 border-b border-border/60 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-5 py-3 text-sm font-semibold transition ${activeTab === tab ? 'bg-bg-surface/60 text-white' : 'text-text-muted hover:bg-bg-surface/60 hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="rounded-2xl border border-border/60 bg-bg-surface/40 p-8 text-center text-text-base">Loading orders...</div>
          ) : (
            <DataTable
              rowKey="id"
              data={filteredOrders as unknown as Record<string, unknown>[]}
              columns={[
                { header: 'Order', render: (item) => <span>{(item as unknown as Order).order_number}</span> },
                {
                  header: 'Customer',
                  render: (item) => {
                    const order = item as unknown as Order
                    return (
                      <span>
                        {order.customer_name}
                        <span className="block text-xs text-text-muted">{order.customer_email}</span>
                      </span>
                    )
                  },
                },
                { header: 'Date', render: (item) => <span>{formatDate((item as unknown as Order).created_at)}</span> },
                { header: 'Total', render: (item) => <span>{formatCurrency((item as unknown as Order).total)}</span> },
                {
                  header: 'Status',
                  render: (item) => {
                    const status = (item as unknown as Order).status
                    return <Badge label={statusLabels[status] || status} variant={getStatusVariant(status)} />
                  },
                },
                { header: 'Payment', render: (item) => <span>{(item as unknown as Order).payment_method}</span> },
                {
                  header: 'Actions',
                  render: (item) => {
                    const order = item as unknown as Order
                    return (
                      <div className="flex flex-wrap items-center gap-2">
                        <select
                          value={order.status}
                          disabled={savingOrderId === order.id}
                          onChange={(event) => updateOrderStatus(order, event.target.value)}
                          className="rounded-lg border border-border/60 bg-bg-surface/60 px-3 py-2 text-xs font-semibold text-white outline-none transition focus:border-primary/50"
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>{statusLabels[status]}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="cursor-pointer rounded-full bg-bg-dark px-5 py-2 text-xs font-semibold text-white transition hover:bg-bg-dark/60"
                        >
                          View
                        </button>
                      </div>
                    )
                  },
                },
              ]}
            />
          )}
        </div>
      </div>

      {selectedOrder && (
        <div className="rounded-2xl border border-border/60 bg-bg-surface/40 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Order details - <span className="text-emerald-400">{selectedOrder.order_number}</span>
              </h2>
              <p className="mt-2 text-sm text-text-muted">{selectedOrder.items.length} items for {selectedOrder.customer_name}</p>
            </div>
            <button onClick={() => setSelectedOrder(null)} className="rounded-full bg-bg-surface/60 px-4 py-2 text-sm font-semibold text-white transition hover:bg-bg-surface/80">Close</button>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-bg-surface/60 p-5">
              <p className="text-sm uppercase tracking-[0.3em] text-text-muted">Shipping address</p>
              <p className="mt-3 text-white">
                {selectedOrder.shipping_address.full_name}<br />
                {selectedOrder.shipping_address.street}<br />
                {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.postal_code}<br />
                {selectedOrder.shipping_address.country}
              </p>
            </div>
            <div className="rounded-lg bg-bg-surface/60 p-5">
              <p className="text-sm uppercase tracking-[0.3em] text-text-muted">Order items</p>
              <div className="mt-3 space-y-2">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex justify-between gap-4 text-sm text-white">
                    <span>{item.quantity} x {item.product_name}</span>
                    <span>{formatCurrency(item.line_total)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-bg-surface/40 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-3 text-white">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-text-muted">Orders delivered</p>
              <p className="mt-2 text-2xl font-semibold">{completedOrders}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-bg-surface/40 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-3 text-white">
            <Repeat className="h-5 w-5 text-amber-400" />
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-text-muted">Returns / cancellations</p>
              <p className="mt-2 text-2xl font-semibold">{returnRequests}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrdersPage
