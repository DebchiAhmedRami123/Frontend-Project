const variants = {
  scheduled: 'bg-blue-50 text-blue-600',
  completed: 'bg-green-50 text-green-600',
  pending: 'bg-yellow-50 text-yellow-600',
  active: 'bg-[#50CD95]/15 text-[#0F6E56]',
  suspended: 'bg-red-50 text-red-500',
}

export default function Badge({ status }) {
  const label = status.charAt(0).toUpperCase() + status.slice(1)
  return (
    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${variants[status] || 'bg-gray-100 text-gray-500'}`}>
      {label}
    </span>
  )
}