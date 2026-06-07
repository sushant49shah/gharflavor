import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchOrderById } from '../features/orders/orderSlice';
import { getOrderStatusClasses } from '../utils/orderStatusStyles';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedOrder: order, loading } = useAppSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderById(id!));
  }, [id, dispatch]);

  if (loading) return <p className="text-white p-8">Loading order...</p>;
  if (!order) return <p className="text-white p-8">Order not found.</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Order #{order.id}</h1>
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase ${getOrderStatusClasses(order.status)}`}>
          {order.status}
        </span>
      </div>

      {/* Order Items */}
      <div className="rounded-xl bg-bg-surface border border-border p-4 space-y-3">
        <h2 className="text-sm font-bold text-primary uppercase tracking-wider">Items</h2>
        {order.items.map((item: any) => (
          <div key={item.id} className="flex justify-between items-center text-sm">
            <span className="text-white">{item.product_name}</span>
            <span className="text-text-muted">
              {item.quantity} × ₹{item.unit_price}
            </span>
          </div>
        ))}
      </div>

      {/* Shipping Address */}
      <div className="rounded-xl bg-bg-surface border border-border p-4 space-y-1">
        <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">
          Shipping Address
        </h2>
        <p className="text-white text-sm">{order.shipping_address?.full_name}</p>
        <p className="text-text-muted text-xs">{order.shipping_address?.street}</p>
        <p className="text-text-muted text-xs">
          {order.shipping_address?.city}, {order.shipping_address?.state} - {order.shipping_address?.postal_code}
        </p>
        <p className="text-text-muted text-xs">{order.shipping_address?.country}</p>
      </div>

      {/* Order Summary */}
      <div className="rounded-xl bg-bg-surface border border-border p-4 space-y-2">
        <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">
          Summary
        </h2>
        <div className="flex justify-between text-sm text-text-muted">
          <span>Subtotal</span>
          <span>₹{order.subtotal}</span>
        </div>
        <div className="flex justify-between text-sm text-text-muted">
          <span>Shipping</span>
          <span>₹{order.shipping_cost}</span>
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between text-sm text-green-400">
            <span>Discount</span>
            <span>- ₹{order.discount}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-bold text-accent border-t border-border pt-2">
          <span>Total</span>
          <span>₹{order.total}</span>
        </div>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate('/profile')}
        className="text-sm text-accent hover:text-accent/80 transition-colors cursor-pointer"
      >
        ← Back to Profile
      </button>

    </div>
  );
};

export default OrderDetailPage;
