interface TextAreaFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

// Purpose: Reusable textarea field for admin forms.
// Props:
//   label - field label.
//   value - current textarea value.
//   onChange - change handler.
//   placeholder - optional placeholder.
// Usage: Use for notes, instructions, or coupon descriptions.
const TextAreaField = ({ label, value, onChange, placeholder = '' }: TextAreaFieldProps) => {
  return (
    <label className="space-y-2 text-sm text-text-base">
      <span className="font-semibold text-white">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full rounded-xl border border-border/60 bg-bg-surface/60 px-4 py-3 text-sm text-white outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
      />
    </label>
  )
}

export default TextAreaField
