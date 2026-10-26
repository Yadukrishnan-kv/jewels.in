export default function EmptyState({ icon = "fa-inbox", title = "Nothing here yet", message, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-14 h-14 rounded-2xl bg-accent/[0.08] text-accent flex items-center justify-center mb-4">
        <i className={`fa-solid ${icon} text-xl`} />
      </div>
      <p className="font-medium text-primary/80">{title}</p>
      {message && <p className="text-sm text-primary/45 mt-1.5 max-w-sm">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
