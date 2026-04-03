export default function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-[#052B34]">{value}</p>
    </div>
  )
}