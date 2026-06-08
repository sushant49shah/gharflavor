import axios from 'axios';
import { useEffect, useState, type FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { submitReview, resetReviewState } from '../features/reviewSlice';
import type { ReviewSubmission } from '../features/reviewSlice';
import axiosInstance from '../app/axios';

interface ProductOption {
  id: number;
  name: string;
}

interface PaginatedProducts {
  count: number;
  next: string | null;
  previous: string | null;
  results: ProductOption[];
}

const Review = () => {
  const dispatch = useAppDispatch();
  const { loading, success, error } = useAppSelector((state) => state.review);
  const userToken = useAppSelector((state) => state.user.userInfo?.token);

  const [products, setProducts] = useState<ProductOption[]>([]);
  const [fetchingProducts, setFetchingProducts] = useState(false);
  const [productId, setProductId] = useState<number | ''>('');
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Reset review state on mount only
  useEffect(() => {
    dispatch(resetReviewState());
  }, []);

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setFetchingProducts(true);
      try {
        const { data } = await axiosInstance.get<PaginatedProducts | ProductOption[]>('/api/products/');
        // data.results is the array — data itself is the paginated object
        const results = Array.isArray(data) ? data : data.results ?? [];
        setProducts(results);
      } catch (err) {
        const detail = axios.isAxiosError(err)
          ? err.response?.data?.detail
          : null;
        const message = err instanceof Error ? err.message : 'Unable to load products';
        setFetchError(detail || message);
      } finally {
        setFetchingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // Reset form fields after successful submission
  useEffect(() => {
    if (success) {
      setProductId('');
      setRating(0);
      setComment('');
    }
  }, [success]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFetchError(null);
    dispatch(resetReviewState()); // reset before every new submission

    if (!userToken) {
      setFetchError('Please log in before submitting a review.');
      return;
    }

    if (!productId || rating === 0) {
      setFetchError('Please select a product and rating.');
      return;
    }

    const reviewPayload: ReviewSubmission = {
      productId: Number(productId),
      rating,
      comment: comment.trim(),
    };

    await dispatch(submitReview(reviewPayload));
  };

  return (
    <div className="min-h-screen bg-bg-dark text-white py-10">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border bg-bg-surface/30 p-8">
          <h1 className="text-3xl font-semibold text-white">Submit a product review</h1>
          <p className="mt-3 text-sm text-text-muted">
            Select a product, choose a rating, and leave your comment below.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {fetchError && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {fetchError}
              </div>
            )}
            {error && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-100">
                Review submitted successfully.
              </div>
            )}

            <label className="block text-sm text-text-muted">
              Product
              <select
                value={productId}
                disabled={fetchingProducts}
                onChange={(e) => setProductId(e.target.value ? Number(e.target.value) : '')}
                className="mt-2 w-full rounded-2xl border border-border bg-bg-dark px-4 py-3 text-white outline-none focus:border-accent disabled:opacity-50"
              >
                <option value="">
                  {fetchingProducts ? 'Loading products...' : 'Select a product'}
                </option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm text-text-muted">
              Rating
              <div className="mt-2 grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    type="button"
                    key={value}
                    onClick={() => setRating(value)}
                    className={`rounded-2xl border px-3 py-3 text-sm font-semibold transition-colors ${
                      rating === value
                        ? 'border-accent bg-accent text-black'
                        : 'border-border bg-bg-dark text-white hover:border-accent'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </label>

            <label className="block text-sm text-text-muted">
              Comment
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                placeholder="Share your honest experience..."
                className="mt-2 w-full rounded-3xl border border-border bg-bg-dark px-4 py-3 text-white outline-none focus:border-accent resize-none"
              />
            </label>

            <button
              type="submit"
              disabled={loading || fetchingProducts}
              className="inline-flex items-center justify-center rounded-2xl bg-accent px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Submitting review...' : 'Submit review'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Review;
