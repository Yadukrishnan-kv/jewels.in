export function Field({ label, hint, required, children, className = "" }) {
  return (
    <div className={className}>
      {label && (
        <label className="admin-label">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {children}
      {hint && <p className="text-xs text-primary/40 mt-1.5">{hint}</p>}
    </div>
  );
}

export function Input(props) {
  return <input {...props} className={`admin-input ${props.className || ""}`} />;
}

export function Textarea(props) {
  return <textarea {...props} className={`admin-input resize-none ${props.className || ""}`} />;
}

export function Select({ children, ...props }) {
  return (
    <div className="relative">
      <select {...props} className={`admin-input appearance-none pr-9 cursor-pointer ${props.className || ""}`}>
        {children}
      </select>
      <i className="fa-solid fa-chevron-down text-[0.65rem] text-primary/35 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
}

export function Toggle({ checked, onChange, label, hint, disabled }) {
  return (
    <label className={`flex items-center justify-between gap-4 ${disabled ? "opacity-50" : "cursor-pointer"}`}>
      <span>
        {label && <span className="text-sm font-medium text-primary">{label}</span>}
        {hint && <span className="block text-xs text-primary/45 mt-0.5">{hint}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ${
          checked ? "bg-accent" : "bg-primary/15"
        }`}
      >
        <span
          className={`inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? "translate-x-[22px]" : "translate-x-[3px]"
          }`}
        />
      </button>
    </label>
  );
}

export function CheckboxPill({ checked, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
        checked ? "bg-primary text-white border-primary" : "border-border text-primary/55 hover:border-accent hover:text-accent"
      }`}
    >
      {children}
    </button>
  );
}
