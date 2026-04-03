export default function Input({ label, error, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-gray-600">{label}</label>}
      <input
        {...props}
        className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition
          focus:ring-2 focus:ring-[#50CD95]/40
          ${error
            ? 'border-red-400 bg-red-50 focus:border-red-400'
            : 'border-gray-200 bg-white focus:border-[#50CD95]'
          } disabled:opacity-50`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}