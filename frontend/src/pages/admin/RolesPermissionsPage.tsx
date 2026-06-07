import { roles } from '../../data/adminMockData'

// Purpose: Roles & permissions page for configuring admin access groups.
// Props: None.
// Usage: Render at /admin/roles to review role definitions and permission summaries.
const RolesPermissionsPage = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border/60 bg-bg-surface/40 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-text-muted">Roles & permissions</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Access control</h1>
            <p className="mt-3 text-sm leading-6 text-text-muted">Define role groups for teams, restrict sensitive pages, and maintain enterprise-level governance.</p>
          </div>
          <button className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700">New role</button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {roles.map((role) => (
          <div key={role.id} className="rounded-2xl border border-border/60 bg-bg-surface/40 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
            <h2 className="text-xl font-semibold text-white">{role.name}</h2>
            <p className="mt-3 text-sm text-text-muted">Current permissions</p>
            <ul className="mt-4 space-y-3 text-text-base">
              {role.permissions.map((permission) => (
                <li key={permission} className="rounded-full bg-bg-surface/60 px-4 py-3">{permission}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RolesPermissionsPage
