export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 p-6 ${className}`}>
      {children}
    </div>
  )
}