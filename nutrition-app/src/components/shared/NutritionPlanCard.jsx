import Badge from '../ui/Badge'

export default function NutritionPlanCard({ plan, onBook }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition">
      <div className="h-40 bg-gray-50 flex items-center justify-center">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#052B34" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.15">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      </div>
      <div className="p-4">
        <p className="font-semibold text-[#052B34] text-sm">{plan.name}</p>
        <p className="text-xs text-gray-400 mt-0.5">Nutritionist: {plan.nutritionist}</p>
        <p className="text-xs text-gray-400">Duration: {plan.duration}</p>
        <p className="text-[#50CD95] font-bold text-sm mt-2">{plan.price}</p>
        <p className="text-xs text-gray-400 mt-1">{plan.description}</p>
        <button
          onClick={() => onBook?.(plan)}
          className="mt-4 w-full py-2 bg-[#052B34] text-white text-xs rounded-xl hover:bg-[#0a3d4a] transition font-medium"
        >
          Book This Plan
        </button>
      </div>
    </div>
  )
}