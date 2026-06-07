import { useState } from 'react'
import DataTable from '../../components/admin/DataTable'
import Modal from '../../components/admin/Modal'
import Badge from '../../components/admin/Badge'
import { chefs } from '../../data/adminMockData'

// Purpose: Customer management page with list and detail preview.
// Props: None.
// Usage: Render at /admin/chefs for chef management and segmentation.
const ChefPage = () => {
  const [selectedChef, setSelectedChef] = useState<typeof chefs[number] | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-bg-surface/40 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-text-muted">Chefs</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Chef relationships</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-text-muted">Review chef segments, lifetime value and engagement signals in one place.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700">
          Add chef
        </button>
      </div>

      <div className="rounded-2xl border border-border/60 bg-bg-surface/40 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
        <DataTable
          rowKey="id"
          data={chefs as unknown as Record<string, unknown>[]}
          columns={[
            { header: 'Chef', render: (item) => <span>{(item as any).name}</span> },
            { header: 'Email', accessor: 'email' },
            { header: 'Company', accessor: 'company' },
            { header: 'Earn', accessor: 'earn' },
            { header: 'Status', render: (item) => <Badge label={(item as any).status} variant={(item as any).status === 'VIP' ? 'success' : (item as any).status === 'Churn' ? 'danger' : 'secondary'} /> },
            { header: 'Actions', render: (item) => (
              <button onClick={() => setSelectedChef(item as any)} className="rounded-full bg-bg-surface/60 px-3 py-2 text-xs font-semibold text-white transition hover:bg-bg-surface/80">View</button>
            ) },
          ]}
        />
      </div>

      <Modal isOpen={Boolean(selectedChef)} title={selectedChef ? selectedChef.name : ''} onClose={() => setSelectedChef(null)}>
        {selectedChef && (
          <div className="space-y-6">
            <div className="rounded-full bg-bg-surface/60 p-5">
              <p className="text-sm uppercase tracking-[0.3em] text-text-muted">Profile</p>
              <p className="mt-4 text-lg font-semibold text-white">{selectedChef.name}</p>
              <p className="mt-2 text-sm text-text-muted">{selectedChef.email}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-full bg-bg-surface/60 p-5">
                <p className="text-sm uppercase tracking-[0.3em] text-text-muted">Company</p>
                <p className="mt-3 text-white">{selectedChef.company}</p>
              </div>
              <div className="rounded-full bg-bg-surface/60 p-5">
                <p className="text-sm uppercase tracking-[0.3em] text-text-muted">Lifetime value</p>
                <p className="mt-3 text-white">{selectedChef.earn}</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-full bg-bg-surface/60 p-5">
                <p className="text-sm uppercase tracking-[0.3em] text-text-muted">Orders placed</p>
                <p className="mt-3 text-white">16</p>
              </div>
              <div className="rounded-full bg-bg-surface/60 p-5">
                <p className="text-sm uppercase tracking-[0.3em] text-text-muted">Chef status</p>
                <Badge label={selectedChef.status} variant={selectedChef.status === 'VIP' ? 'success' : selectedChef.status === 'Churn' ? 'danger' : 'secondary'} />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default ChefPage
