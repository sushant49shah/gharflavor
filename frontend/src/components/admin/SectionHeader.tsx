import { useState } from 'react'
import { Plus } from 'lucide-react'

import Modal from '../../components/admin/Modal'
import InputField from '../../components/admin/forms/InputField'
import SelectField from '../../components/admin/forms/SelectField'
import { categories, } from '../../data/adminMockData'

const SectionHeader = () => {
const [isModalOpen, setModalOpen] = useState(false)
const [newProduct, setNewProduct] = useState({ name: '', category: 'Apparel', price: '', sku: '', stock: '0' })
  return (
    <div>
      <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-bg-surface/40 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-text-muted">Products</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Catalog management</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-text-muted">Organize products, manage inventory and maintain categories from a unified admin workspace.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700">
          <Plus className="h-4 w-4" /> Add product
        </button>
      </div>
      <Modal isOpen={isModalOpen} title="Add a new product" onClose={() => setModalOpen(false)}>
        <div className="space-y-5">
          <InputField label="Product name" value={newProduct.name} onChange={(value) => setNewProduct((prev) => ({ ...prev, name: value }))} />
          <InputField label="SKU" value={newProduct.sku} onChange={(value) => setNewProduct((prev) => ({ ...prev, sku: value }))} />
          <SelectField label="Category" value={newProduct.category} options={categories.map((category) => ({ label: category.label, value: category.label }))} onChange={(value) => setNewProduct((prev) => ({ ...prev, category: value }))} />
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="Price" value={newProduct.price} onChange={(value) => setNewProduct((prev) => ({ ...prev, price: value }))} />
            <InputField label="Stock" type="number" value={newProduct.stock} onChange={(value) => setNewProduct((prev) => ({ ...prev, stock: value }))} />
          </div>
          <button className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700">Save product</button>
        </div>
      </Modal>
    </div>
  )
}

export default SectionHeader
