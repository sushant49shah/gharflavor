interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

// Purpose: Render pagination controls for admin lists.
// Props:
//   currentPage - currently active page.
//   totalPages - total number of pages.
//   onPageChange - callback when the selected page changes.
// Usage: Attach to tables or lists with paginated mock data.
const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-bg-surface/40 px-4 py-3 text-sm text-text-muted shadow-sm shadow-black/10">
      <p className="text-text-muted">Page {currentPage} of {totalPages}</p>
      <div className="flex flex-wrap items-center gap-2">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`h-9 min-w-9 rounded-full px-3 text-sm font-semibold transition ${page === currentPage ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-bg-surface/60 text-text-muted hover:bg-bg-surface/80'}`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Pagination
