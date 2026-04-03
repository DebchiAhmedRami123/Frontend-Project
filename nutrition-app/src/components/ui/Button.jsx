export default function Button({ variant = 'primary', children, className = '', ...props }) {
  const base = 'px-5 py-2.5 rounded-xl text-sm font-medium transition active:scale-[0.98] disabled:opacity-50'
  const variants = {
    primary: 'bg-[#052B34] text-white hover:bg-[#0a3d4a]',
    secondary: 'bg-gray-100 text-[#052B34] hover:bg-gray-200',
    outline: 'border border-gray-200 text-[#052B34] hover:bg-gray-50',
    danger: 'bg-red-50 text-red-500 hover:bg-red-100',
    success: 'bg-[#50CD95]/15 text-[#0F6E56] hover:bg-[#50CD95]/25',
  }
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}