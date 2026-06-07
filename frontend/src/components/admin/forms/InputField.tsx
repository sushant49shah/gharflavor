interface InputFieldProps {
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

// Purpose: Reusable input field for admin forms.
// Props:
//   label - field label text.
//   type - input type.
//   value - current field value.
//   onChange - change handler.
//   placeholder - optional placeholder text.
// Usage: Use in product and settings forms.
const InputField = ({ label, type = 'text', value, onChange, placeholder = '' }: InputFieldProps) => {
  return (
    <label className="space-y-2 text-sm text-text-base">
      <span className="font-semibold text-white">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border/60 bg-bg-surface/60 px-4 py-3 text-sm text-white outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
      />
    </label>
  )
}

export default InputField
