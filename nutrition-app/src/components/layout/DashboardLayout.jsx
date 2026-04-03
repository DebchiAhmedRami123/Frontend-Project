export default function DashboardLayout({ sidebar, children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-56 flex-shrink-0 bg-white border-r border-gray-100 fixed top-0 left-0 h-screen overflow-y-auto z-40">
        {sidebar}
      </aside>
      <main className="ml-56 flex-1 p-8 min-h-screen">
        {children}
      </main>
    </div>
  )
}