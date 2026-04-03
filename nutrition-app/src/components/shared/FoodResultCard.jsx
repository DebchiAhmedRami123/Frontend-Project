export default function FoodResultCard({ foodName, calories, confidence }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="font-semibold text-[#052B34]">{foodName}</p>
        {confidence && (
          <span className="text-xs bg-[#50CD95]/15 text-[#0F6E56] px-2 py-0.5 rounded-full">
            {confidence}% match
          </span>
        )}
      </div>
      <div className="flex items-end gap-1">
        <span className="text-3xl font-bold text-[#052B34]">{calories}</span>
        <span className="text-sm text-gray-400 mb-1">kcal</span>
      </div>
    </div>
  )
}