interface SelectFieldProps {
  label: string
  value: string
  options: { label: string; value: string }[]
  onChange: (value: string) => void
}

// Purpose: Reusable select dropdown for admin forms.
// Props:
//   label - field label.
//   value - selected value.
//   options - list of option labels and values.
//   onChange - change handler.
// Usage: Use in product and permissions settings.
const SelectField = ({ label, value, options, onChange }: SelectFieldProps) => {
  return (
    <label className="space-y-2 text-sm text-text-base">
      <span className="font-semibold text-white">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-border/60 bg-bg-surface/60 px-4 py-3 text-sm text-white outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  )
}

export default SelectField
