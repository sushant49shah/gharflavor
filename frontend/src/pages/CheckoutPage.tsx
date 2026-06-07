import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../app/axios';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  formatCurrency,
  selectCartItems,
  selectFormattedCartSummary,
  selectIsCartEmpty,
} from '../features/cart/cartSelectors';
import type { CartItem } from '../features/cart/cartTypes';
import { clearCart } from '../features/cart/cartSlice';
import DialogBox from '../components/common/DialogBox';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false)

  const items = useAppSelector(selectCartItems);
  const summary = useAppSelector(selectFormattedCartSummary);
  const isEmpty = useAppSelector(selectIsCartEmpty);
  const userToken = useAppSelector((state) => state.user.userInfo?.token);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    paymentMethod: 'card',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useAppDispatch();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  }
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (isEmpty) {
      setError('Your cart is empty. Add some products before checking out.');
      return;
    }

    if (
      !form.fullName.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.city.trim() ||
      !form.state.trim() ||
      !form.postalCode.trim() ||
      !form.country.trim()
    ) {
      setError('Please complete all required shipping fields.');
      return;
    }

    if (form.paymentMethod === 'card') {
      if (!form.cardNumber.trim() || !form.expiry.trim() || !form.cvv.trim()) {
        setError('Please complete all required payment fields.');
        return;
      }
    }

    if (!userToken) {
      setError('Please log in to complete checkout.');
      return;
    }

    setSubmitting(true);

    try {
      const orderPayload = {
        shipping_address: {
          full_name: form.fullName,
          phone: form.phone,
          street: form.address,
          city: form.city,
          state: form.state,
          postal_code: form.postalCode,
          country: form.country,
        },
        payment_method: form.paymentMethod,
        items: items.map((item) => ({
          product_id: item.id,
          product_name: item.name,
          variant_name: item.name,
          quantity: item.quantity,
          unit_price: item.price,
        })),
        discount: 0,
      };

      await axiosInstance.post('/api/orders/create/', orderPayload, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      });

      handleClearCart();
      navigate('/profile');
      // dialog box to show order success message
      setDialogOpen(true);
      alert('Order placed successfully! Thank you for shopping with us.');
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Order submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#131313] text-white py-10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-text-muted">Checkout</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Complete your order</h1>
            <p className="mt-2 text-sm text-[#B0A78E] max-w-2xl">
              Review your order, add shipping details, and finish checkout with a simple, secure form.
            </p>
          </div>

          <Link
            to="/cart"
            className="inline-flex items-center justify-center rounded-full border border-border bg-bg-dark px-5 py-3 text-sm font-semibold text-accent transition-colors hover:border-accent hover:bg-[#2A2A2A]"
          >
            Back to Cart
          </Link>
        </div>

        {isEmpty ? (
          <div className="rounded-3xl border border-border bg-[#1F1F1F]/90 p-10 text-center">
            <p className="text-lg font-semibold text-white">Your cart is empty</p>
            <p className="mt-3 text-sm text-text-muted">Add items to your cart before continuing to checkout.</p>
            <Link
              to="/products"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#D66F1A]"
            >
              Shop Products
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1.6fr_0.9fr]">
            <div className="space-y-8 rounded-3xl border border-border bg-bg-dark/90 p-8">
              <section className="space-y-2">
                <h2 className="text-xl font-semibold text-white">Shipping details</h2>
                <p className="text-sm text-text-muted">Enter the address where you want your order delivered.</p>
              </section>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-[#C6C2B1]">
                  Full name
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-2xl border border-[#333333] bg-[#111111] px-4 py-3 text-white outline-none focus:border-accent"
                    placeholder="Jane Doe"
                  />
                </label>
                <label className="space-y-2 text-sm text-[#C6C2B1]">
                  Email address
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-2xl border border-[#333333] bg-[#111111] px-4 py-3 text-white outline-none focus:border-accent"
                    placeholder="jane@example.com"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-[#C6C2B1]">
                  Phone number
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-2xl border border-[#333333] bg-[#111111] px-4 py-3 text-white outline-none focus:border-accent"
                    placeholder="(123) 456-7890"
                  />
                </label>
                <label className="space-y-2 text-sm text-[#C6C2B1]">
                  Country
                  <input
                    name="country"
                    value={form.country}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-2xl border border-[#333333] bg-[#111111] px-4 py-3 text-white outline-none focus:border-accent"
                    placeholder="United States"
                  />
                </label>
              </div>

              <div className="grid gap-4">
                <label className="space-y-2 text-sm text-[#C6C2B1]">
                Street address
                <input
                  name="address"
                  value={form.address}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-2xl border border-[#333333] bg-[#111111] px-4 py-3 text-white outline-none focus:border-accent"
                  placeholder="123 Main St"
                />
              </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-[#C6C2B1]">
                  City
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-2xl border border-[#333333] bg-[#111111] px-4 py-3 text-white outline-none focus:border-accent"
                    placeholder="Los Angeles"
                  />
                </label>
                <label className="space-y-2 text-sm text-[#C6C2B1]">
                  State / Province
                  <input
                    name="state"
                    value={form.state}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-2xl border border-[#333333] bg-[#111111] px-4 py-3 text-white outline-none focus:border-accent"
                    placeholder="California"
                  />
                </label>
              </div>

              <div className="grid gap-4">
                <label className="space-y-2 text-sm text-[#C6C2B1]">
                  Postal code
                  <input
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-2xl border border-[#333333] bg-[#111111] px-4 py-3 text-white outline-none focus:border-accent"
                    placeholder="90001"
                  />
                </label>
              </div>

              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white">Payment method</h2>
                    <p className="text-sm text-text-muted">Choose how you'd like to pay for your order.</p>
                  </div>
                </div>

                <div className="space-y-3 rounded-3xl border border-[#333333] bg-[#111111] p-4">
                  <label className="flex items-center gap-3 rounded-2xl border border-transparent bg-[#181818] px-4 py-3 transition-colors hover:border-border">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={form.paymentMethod === 'card'}
                      onChange={handleInputChange}
                      className="h-4 w-4 accent-accent"
                    />
                    <span className="text-sm text-white">Credit / Debit card</span>
                  </label>
                  <label className="flex items-center gap-3 rounded-2xl border border-transparent bg-[#181818] px-4 py-3 transition-colors hover:border-border">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={form.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                      className="h-4 w-4 accent-accent"
                    />
                    <span className="text-sm text-white">Cash on delivery</span>
                  </label>
                </div>

                {form.paymentMethod === 'card' && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-2 text-sm text-[#C6C2B1]">
                      Card number
                      <input
                        name="cardNumber"
                        value={form.cardNumber}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-2xl border border-[#333333] bg-[#111111] px-4 py-3 text-white outline-none focus:border-accent"
                        placeholder="1234 5678 9012 3456"
                      />
                    </label>
                    <label className="space-y-2 text-sm text-[#C6C2B1]">
                      Expiry date
                      <input
                        name="expiry"
                        value={form.expiry}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-2xl border border-[#333333] bg-[#111111] px-4 py-3 text-white outline-none focus:border-accent"
                        placeholder="MM/YY"
                      />
                    </label>
                    <label className="space-y-2 text-sm text-[#C6C2B1] sm:col-span-2">
                      CVV
                      <input
                        name="cvv"
                        value={form.cvv}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-2xl border border-[#333333] bg-[#111111] px-4 py-3 text-white outline-none focus:border-accent"
                        placeholder="123"
                      />
                    </label>
                  </div>
                )}
              </section>

              {error && <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl bg-accent px-5 py-4 text-sm font-semibold text-[#111111] transition-colors hover:bg-[#d77f10] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Placing order...' : 'Place order securely'}
              </button>
            </div>

            <aside className="space-y-6 rounded-3xl border border-border bg-bg-dark/90 p-8">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">Order summary</h2>
                <p className="text-sm text-text-muted">Review your selected items and total before placing the order.</p>
              </div>

              <div className="space-y-4">
                {items.map((item: CartItem) => (
                  <div key={item.id} className="flex items-center justify-between rounded-2xl bg-[#181818] p-4">
                    <div>
                      <p className="text-sm font-semibold text-white">{item.name}</p>
                      <p className="text-xs text-text-muted">Qty {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-accent">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-[#333333] bg-[#111111]/90 p-5 space-y-4">
                <div className="flex items-center justify-between text-sm text-text-muted">
                  <span>Subtotal</span>
                  <span>{summary.formattedSubtotal}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-text-muted">
                  <span>Delivery fee</span>
                  <span className="text-white">{summary.formattedDeliveryFee}</span>
                </div>
                <div className="border-t border-[#333333] pt-4 flex items-center justify-between text-lg font-bold text-white">
                  <span>Total</span>
                  <span className='text-accent'>{summary.formattedTotal}</span>
                </div>
              </div>

              <div className="rounded-2xl bg-[#111111]/80 p-4 text-sm text-text-muted">
                <p className="font-medium text-white">Need help?</p>
                <p className="mt-2">Contact support if you need to update shipping details after placing your order.</p>
              </div>
            </aside>
          </form>
        )}
      </div>
      <DialogBox
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Remove Product"
        message="Are you sure you want to remove this item from your cart?"
        type="warning"
        confirmText="Remove"
        cancelText="Keep"
        onConfirm={() => {
          setDialogOpen(false)
        }}
      />
    </div>
  );
};

export default CheckoutPage;
