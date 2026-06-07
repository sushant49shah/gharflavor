import { useState } from 'react'
import InputField from '../../components/admin/forms/InputField'
import SelectField from '../../components/admin/forms/SelectField'
import TextAreaField from '../../components/admin/forms/TextAreaField'

// Purpose: Settings page for global admin configuration.
// Props: None.
// Usage: Render at /admin/settings to change site, billing and notification options.
const SettingsPage = () => {
  const [businessName, setBusinessName] = useState('GharFlavour HQ')
  const [currency, setCurrency] = useState('USD')
  const [supportEmail, setSupportEmail] = useState('support@gharflavour.com')
  const [footerText, setFooterText] = useState('Designed for premium e-commerce operations.')

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border/60 bg-bg-surface/40 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-text-muted">Settings</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Platform configuration</h1>
            <p className="mt-3 text-sm leading-6 text-text-muted">Configure store identity, billing defaults and interface preferences for the admin experience.</p>
          </div>
          <button className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700">Save settings</button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-bg-surface/40 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
          <h2 className="text-xl font-semibold text-white">Store identity</h2>
          <div className="mt-6 space-y-4">
            <InputField label="Business name" value={businessName} onChange={setBusinessName} />
            <InputField label="Support email" value={supportEmail} onChange={setSupportEmail} type="email" />
            <SelectField label="Default currency" value={currency} onChange={setCurrency} options={[{ label: 'USD', value: 'USD' }, { label: 'EUR', value: 'EUR' }, { label: 'NPR', value: 'NPR' }]} />
          </div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-bg-surface/40 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
          <h2 className="text-xl font-semibold text-white">Brand messaging</h2>
          <div className="mt-6 space-y-4">
            <TextAreaField label="Footer note" value={footerText} onChange={setFooterText} />
            <div className="rounded-full bg-bg-surface/60 p-5 text-text-base">
              <p className="text-sm uppercase tracking-[0.3em] text-text-muted">Live preview</p>
              <p className="mt-3 text-white">{footerText}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
