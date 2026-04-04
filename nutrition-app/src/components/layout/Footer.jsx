export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-400">© 2025 CaloAI. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="text-sm text-gray-400 hover:text-[#052B34] transition">Privacy Policy</a>
          <a href="#" className="text-sm text-gray-400 hover:text-[#052B34] transition">Terms of Service</a>
          <a href="#" className="text-sm text-gray-400 hover:text-[#052B34] transition">support@nutritrack.com</a>
        </div>
      </div>
    </footer>
  )
}