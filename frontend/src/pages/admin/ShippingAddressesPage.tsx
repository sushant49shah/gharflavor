import DataTable from '../../components/admin/DataTable'
import { addresses } from '../../data/adminMockData'

// Purpose: Shipping addresses page for managing delivery points.
// Props: None.
// Usage: Render at /admin/shipping to review warehouse and customer address locations.
const ShippingAddressesPage = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border/60 bg-bg-surface/40 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-text-muted">Shipping addresses</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Delivery network</h1>
            <p className="mt-3 text-sm leading-6 text-text-muted">Track primary distribution points and the number of deliveries routed through each location.</p>
          </div>
          <button className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700">Add location</button>
        </div>
      </div>

      <DataTable
        rowKey="id"
        data={addresses as unknown as Record<string, unknown>[]}
        columns={[
          { header: 'Location', render: (item) => <span>{(item as any).label}</span> },
          { header: 'Customer', accessor: 'customer' },
          { header: 'Address', accessor: 'location' },
          { header: 'Deliveries', accessor: 'deliveries' },
        ]}
      />
    </div>
  )
}

export default ShippingAddressesPage
