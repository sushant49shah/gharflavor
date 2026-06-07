import type { ReactNode } from 'react'

export interface Column<T extends Record<string, unknown>> {
  header: string
  accessor?: keyof T
  render?: (item: T) => ReactNode
  className?: string
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[]
  data: T[]
  rowKey: keyof T
  noDataMessage?: string
}

// Purpose: Render a generic data table for admin lists.
// Props:
//   columns - array of header definitions and render methods.
//   data - array of row objects.
//   rowKey - unique key field for each row.
//   noDataMessage - fallback text when there are no rows.
// Usage: Use for orders, customers, reviews, coupons and other tables.
const DataTable = <T extends Record<string, unknown>>({ columns, data, rowKey, noDataMessage = 'No records available yet.' }: DataTableProps<T>) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-bg-surface/40 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
      <table className="min-w-full divide-y divide-border/60 text-sm">
        <thead className="bg-bg-surface/60 text-text-muted">
          <tr>
            {columns.map((column) => (
              <th key={column.header} className={`px-5 py-4 text-left font-semibold tracking-wide ${column.className || ''}`}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60 bg-bg-surface/40">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-5 py-8 text-center text-text-muted">
                {noDataMessage}
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={String(item[rowKey] as string)} className="transition duration-200 hover:bg-bg-surface/60">
                {columns.map((column) => (
                  <td key={column.header} className={`px-5 py-4 align-top ${column.className || 'text-text-base'}`}>
                    {column.render ? column.render(item) : String(item[column.accessor as keyof T] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
