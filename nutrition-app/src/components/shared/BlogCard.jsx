export default function BlogCard({ post }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition">
      <div className="h-28 bg-gray-50"/>
      <div className="p-4">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {post.tags?.map(tag => (
            <span key={tag} className="text-xs bg-[#052B34]/8 text-[#052B34] px-2 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>
        <p className="font-semibold text-[#052B34] text-sm leading-snug">{post.title}</p>
        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{post.excerpt}</p>
        <div className="flex items-center gap-2 mt-3">
          <div className="w-5 h-5 bg-[#50CD95]/20 rounded-full flex items-center justify-center text-xs text-[#0F6E56] font-medium">
            {post.author?.[0]}
          </div>
          <span className="text-xs text-gray-400">{post.author}</span>
        </div>
      </div>
    </div>
  )
}