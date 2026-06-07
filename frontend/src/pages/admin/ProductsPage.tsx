import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Edit2, Layers, Package, Plus, Trash2 } from 'lucide-react'
import ProductCard from '../../components/admin/ProductCard'
import DataTable from '../../components/admin/DataTable'
import Modal from '../../components/admin/Modal'
import InputField from '../../components/admin/forms/InputField'
import SelectField from '../../components/admin/forms/SelectField'
import axiosInstance from '../../app/axios'
import { useAppSelector } from '../../hooks'
import { inventorySummary as mockInventorySummary } from '../../data/adminMockData'

const tabs = ['List', 'Add Product', 'Categories', 'Inventory'] as const
const BADGE_OPTIONS = ['none', 'best_seller', 'new', 'sale', 'featured']

type ProductTab = (typeof tabs)[number]

interface Product {
  id: number
  name: string
  category: string | null
  description: string
  image: string
  price: number
  rating: number
  reviews: number
  stock: number
  badge: string
}

interface Category {
  name: string
  label: string
}

interface PaginatedResponse {
  count: number
  total_pages: number
  current_page: number
  next: number | null
  previous: number | null
  results: Product[]
}

type ProductForm = Omit<Product, 'id'>

const defaultProductForm: ProductForm = {
  name: '',
  category: '',
  description: '',
  image: '',
  price: 0,
  rating: 0,
  reviews: 0,
  stock: 0,
  badge: 'none',
}

const formatCategory = (category: string | null) => (
  category ? category.replace(/_/g, ' ') : 'Uncategorized'
)

const formatPrice = (price: number) => `$${Number(price || 0).toFixed(2)}`

const getStatus = (stock: number) => {
  if (stock <= 0) return 'Out of stock'
  if (stock <= 10) return 'Low stock'
  return 'Active'
}

// Purpose: Product management page with a tabbed SaaS-style UI backed by the products API.
// Props: None.
// Usage: Render at /admin/products to manage product catalog sections.
const ProductsPage = () => {
  const token = useAppSelector((state) => state.user.userInfo?.token)
  const [activeTab, setActiveTab] = useState<ProductTab>('List')
  const [isModalOpen, setModalOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [form, setForm] = useState<ProductForm>(defaultProductForm)
  const [isLoading, setIsLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const authConfig = () => ({
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  })

  const categoryOptions = useMemo(() => {
    if (categories.length === 0) {
      return [{ label: 'Uncategorized', value: '' }]
    }

    return [
      { label: 'Uncategorized', value: '' },
      ...categories.map((category) => ({ label: category.label, value: category.name })),
    ]
  }, [categories])

  const categoryCounts = useMemo(() => (
    categories.map((category) => ({
      ...category,
      products: products.filter((product) => product.category === category.name).length,
    }))
  ), [categories, products])

  const inventorySummary = useMemo(() => {
    const active = products.filter((product) => product.stock > 10).length
    const lowStock = products.filter((product) => product.stock > 0 && product.stock <= 10).length
    const outOfStock = products.filter((product) => product.stock <= 0).length

    return [
      { id: 'total-products', label: 'Total products', value: String(products.length) },
      { id: 'active-products', label: 'Active products', value: String(active) },
      { id: 'low-stock', label: 'Low stock', value: String(lowStock) },
      { id: 'out-of-stock', label: 'Out of stock', value: String(outOfStock) },
    ]
  }, [products])

  const fetchProducts = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await axiosInstance.get<PaginatedResponse>('/products/')
      setProducts(response.data.results)
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Unable to fetch products')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get<Category[]>('/products/categories/')
      setCategories(response.data)
      setForm((prev) => ({
        ...prev,
        category: prev.category || response.data[0]?.name || '',
      }))
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Unable to fetch categories')
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const resetForm = () => {
    setSelectedProduct(null)
    setForm({
      ...defaultProductForm,
      category: categories[0]?.name || '',
    })
    setError(null)
    setSuccess(null)
  }

  const openCreateModal = () => {
    resetForm()
    setModalOpen(true)
  }

  const handleEdit = (product: Product) => {
    const { id, ...productWithoutId } = product
    setSelectedProduct(product)
    setForm(productWithoutId)
    setError(null)
    setSuccess(null)
    setActiveTab('Add Product')
    setModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!token) {
      setError('Admin login required to delete product.')
      return
    }

    if (!window.confirm('Delete this product permanently?')) {
      return
    }

    try {
      setSaving(true)
      await axiosInstance.delete(`/products/${id}/`, authConfig())
      setProducts((prev) => prev.filter((product) => product.id !== id))
      setSuccess('Product deleted successfully.')

      if (selectedProduct?.id === id) {
        resetForm()
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to delete product')
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    if (!token) {
      setError('Admin login required to save products.')
      return
    }

    if (!form.name.trim()) {
      setError('Product name is required.')
      return
    }

    try {
      setSaving(true)

      if (selectedProduct) {
        const response = await axiosInstance.put<Product>(
          `/products/${selectedProduct.id}/`,
          form,
          authConfig(),
        )
        setProducts((prev) => prev.map((product) => (product.id === selectedProduct.id ? response.data : product)))
        setSuccess('Product updated successfully.')
      } else {
        const response = await axiosInstance.post<Product>('/products/', form, authConfig())
        setProducts((prev) => [response.data, ...prev])
        setSuccess('New product created successfully.')
      }

      resetForm()
      setModalOpen(false)
      setActiveTab('List')
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  const productForm = (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField label="Product name" value={form.name} onChange={(value) => setForm((prev) => ({ ...prev, name: value }))} placeholder="Aurora Linen Shirt" />
        <SelectField label="Category" value={form.category || ''} options={categoryOptions} onChange={(value) => setForm((prev) => ({ ...prev, category: value }))} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField label="Price" type="number" value={String(form.price)} onChange={(value) => setForm((prev) => ({ ...prev, price: Number(value) }))} placeholder="49" />
        <InputField label="Inventory count" type="number" value={String(form.stock)} onChange={(value) => setForm((prev) => ({ ...prev, stock: Number(value) }))} placeholder="20" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField label="Badge" value={form.badge} options={BADGE_OPTIONS.map((badge) => ({ label: badge.replace(/_/g, ' '), value: badge }))} onChange={(value) => setForm((prev) => ({ ...prev, badge: value }))} />
        <InputField label="Image URL" value={form.image} onChange={(value) => setForm((prev) => ({ ...prev, image: value }))} placeholder="https://..." />
      </div>
      <label className="space-y-2 text-sm text-text-base">
        <span className="font-semibold text-white">Description</span>
        <textarea
          value={form.description}
          onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          rows={4}
          placeholder="Product description"
          className="w-full resize-none rounded-xl border border-border/60 bg-bg-surface/60 px-4 py-3 text-sm text-white outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField label="Rating" type="number" value={String(form.rating)} onChange={(value) => setForm((prev) => ({ ...prev, rating: Number(value) }))} placeholder="4.5" />
        <InputField label="Reviews" type="number" value={String(form.reviews)} onChange={(value) => setForm((prev) => ({ ...prev, reviews: Number(value) }))} placeholder="12" />
      </div>
      {error && <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}
      {success && <p className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-100">{success}</p>}
      <button disabled={saving} className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60">
        {saving ? 'Saving...' : selectedProduct ? 'Save changes' : 'Create product'}
      </button>
    </form>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-bg-surface/40 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-text-muted">Products</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Catalog management</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-text-muted">Organize products, manage inventory and maintain categories from a unified admin workspace.</p>
        </div>
        <button onClick={openCreateModal} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700">
          <Plus className="h-4 w-4" /> Add product
        </button>
      </div>

      {(error || success) && activeTab !== 'Add Product' && (
        <div className={`rounded-2xl border px-4 py-3 text-sm ${error ? 'border-red-500/30 bg-red-500/10 text-red-200' : 'border-green-500/30 bg-green-500/10 text-green-100'}`}>
          {error || success}
        </div>
      )}

      <div className="grid gap-6">
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

          <div className="mt-6 space-y-6">
            {activeTab === 'List' && (
              isLoading ? (
                <div className="rounded-2xl border border-border/60 bg-bg-surface/40 p-8 text-center text-text-base">Loading products...</div>
              ) : (
                <DataTable
                  rowKey="id"
                  data={products as unknown as Record<string, unknown>[]}
                  columns={[
                    { header: 'Product', render: (item) => <span>{(item as unknown as Product).name}</span> },
                    { header: 'Category', render: (item) => <span>{formatCategory((item as unknown as Product).category)}</span> },
                    { header: 'Stock', accessor: 'stock' },
                    { header: 'Price', render: (item) => <span>{formatPrice((item as unknown as Product).price)}</span> },
                    { header: 'Status', render: (item) => <span className="text-text-base">{getStatus((item as unknown as Product).stock)}</span> },
                    {
                      header: 'Actions',
                      render: (item) => {
                        const product = item as unknown as Product
                        return (
                          <div className="flex gap-2">
                            <button onClick={() => handleEdit(product)} className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-white transition-colors hover:border-primary hover:text-primary">
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => handleDelete(product.id)} className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )
                      },
                    },
                  ]}
                />
              )
            )}

            {activeTab === 'Add Product' && productForm}

            {activeTab === 'Categories' && (
              <div className="grid gap-4 md:grid-cols-2">
                {categoryCounts.map((category) => (
                  <div key={category.name} className="rounded-2xl border border-border/60 bg-bg-surface/60 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-text-muted uppercase">{category.label}</p>
                        <h3 className="mt-1 text-xl font-semibold text-white">{category.products} products</h3>
                      </div>
                      <Layers className="h-5 w-5 text-text-base" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Inventory' && (
              <div className="grid gap-4 sm:grid-cols-2">
                {(products.length ? inventorySummary : mockInventorySummary).map((item) => (
                  <div key={item.id} className="rounded-2xl border border-border/60 bg-bg-surface/60 p-5">
                    <p className="text-sm text-text-muted">{item.label}</p>
                    <p className="mt-1 text-xl font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6 rounded-2xl border border-border/60 bg-bg-surface/40 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-text-muted">Inventory snapshot</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Featured products</h2>
            </div>
            <Package className="h-5 w-5 text-text-base" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {products.slice(0, 3).map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                category={formatCategory(product.category)}
                price={formatPrice(product.price)}
                stock={product.stock}
                rating={String(product.rating)}
                image={product.image}
                status={getStatus(product.stock)}
              />
            ))}
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} title={selectedProduct ? 'Edit product' : 'Add a new product'} onClose={() => setModalOpen(false)}>
        {productForm}
      </Modal>
    </div>
  )
}

export default ProductsPage
