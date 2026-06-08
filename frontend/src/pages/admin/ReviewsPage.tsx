import { useEffect, useState } from 'react'
import DataTable from '../../components/admin/DataTable'
import Badge from '../../components/admin/Badge'
import axiosInstance from '../../app/axios'
import { useAppSelector } from '../../hooks'

interface Review {
  id: number
  product: number | null
  product_name: string
  user: number | null
  customer_name: string
  customer_email: string
  rating: number
  comment: string
  created_at: string
}

// Purpose: Reviews page for moderating product feedback.
// Props: None.
// Usage: Render at /admin/reviews to review customer ratings from the backend.
const ReviewsPage = () => {
  const token = useAppSelector((state) => state.user.userInfo?.token)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const authConfig = () => ({
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  })

  const fetchReviews = async () => {
    if (!token) {
      setError('Admin login required to fetch reviews.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await axiosInstance.get<Review[]>('/api/reviews/', authConfig())
      setReviews(response.data)
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Unable to fetch reviews')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [token])

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border/60 bg-bg-surface/40 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-text-muted">Reviews</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Product feedback</h1>
            <p className="mt-3 text-sm leading-6 text-text-muted">Approve, publish, and manage reviews that influence buyer trust and conversion rates.</p>
          </div>
          <button
            type="button"
            onClick={fetchReviews}
            disabled={loading}
            className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Refreshing...' : 'Refresh feed'}
          </button>
        </div>
      </div>

      {error && <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}

      {loading ? (
        <div className="rounded-2xl border border-border/60 bg-bg-surface/40 p-8 text-center text-text-base">Loading reviews...</div>
      ) : (
        <DataTable
          rowKey="id"
          data={reviews as unknown as Record<string, unknown>[]}
          columns={[
            { header: 'Review', render: (item) => <span>{(item as unknown as Review).comment || 'No comment'}</span> },
            { header: 'Product', render: (item) => <span>{(item as unknown as Review).product_name || 'Unknown product'}</span> },
            {
              header: 'Customer',
              render: (item) => {
                const review = item as unknown as Review
                return (
                  <span>
                    {review.customer_name || 'Unknown customer'}
                    {review.customer_email ? <span className="block text-xs text-text-muted">{review.customer_email}</span> : null}
                  </span>
                )
              },
            },
            { header: 'Rating', render: (item) => <span>{(item as unknown as Review).rating} / 5</span> },
            { header: 'Status', render: () => <Badge label="Published" variant="success" /> },
          ]}
        />
      )}
    </div>
  )
}

export default ReviewsPage
