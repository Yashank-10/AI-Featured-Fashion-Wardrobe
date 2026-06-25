import React, { useMemo, useState } from 'react'
import {
  Bookmark,
  CalendarDays,
  ChevronLeft,
  Heart,
  Info,
  LoaderCircle,
  LogOut,
  RefreshCcw,
  Shirt,
  Sparkles,
  ThumbsUp,
} from 'lucide-react'
import { resolveImageUrl } from '../lib/api'

void React

const scoreTone = (score) => {
  if (score >= 85) {
    return {
      label: 'Excellent',
      detail: 'This combination is strongly aligned with your wardrobe signals.',
    }
  }
  if (score >= 70) {
    return {
      label: 'Strong',
      detail: 'A balanced outfit with only small trade-offs.',
    }
  }
  return {
    label: 'Experimental',
    detail: 'Worth trying if you want a fresh mix or a bold styling direction.',
  }
}

const explanationPoints = (recommendation) => {
  const notes = []

  if (recommendation.color_harmony_score >= 85) {
    notes.push('The palette is cohesive, so the colors support each other instead of competing.')
  } else if (recommendation.color_harmony_score >= 70) {
    notes.push('The palette is mostly balanced, with enough contrast to keep the outfit interesting.')
  } else {
    notes.push('The colors are more adventurous, which can create a statement look.')
  }

  if (recommendation.body_shape_score >= 80) {
    notes.push('The silhouette fits your saved body-shape preferences especially well.')
  } else {
    notes.push('The silhouette is wearable, but it may not be the most optimized option for fit.')
  }

  if (recommendation.undertone_score >= 80) {
    notes.push('The shades align well with your undertone settings, which should feel flattering on skin.')
  } else {
    notes.push('The shades are flexible enough to wear, even if undertone matching is not perfect.')
  }

  return notes
}

const ScoreCard = ({ label, value }) => (
  <div className="rounded-2xl bg-[#fdf2f5] px-4 py-3">
    <p className="text-[#a17a8a]/60 text-xs uppercase tracking-[0.2em]">{label}</p>
    <p className="text-[#a17a8a] text-xl font-bold">{value}%</p>
  </div>
)

const RecommendationCard = ({ recommendation, onFeedback, onSaveLook }) => {
  const [rating, setRating] = useState(5)
  const [sending, setSending] = useState(false)
  const [plannerDate, setPlannerDate] = useState('')
  const [notes, setNotes] = useState('')
  const title =
    recommendation.items.map((item) => item.subcategory || item.category).join(' + ') ||
    'Suggested outfit'

  const scoreSummary = scoreTone(recommendation.overall_score)
  const reasons = useMemo(() => explanationPoints(recommendation), [recommendation])

  const sendFeedback = async (helpful) => {
    setSending(true)

    try {
      await onFeedback(recommendation.recommendation_id, {
        recommendation_type: 'outfit',
        helpful,
        rating,
        comment: helpful ? 'Looks like a good outfit.' : 'Needs better balance.',
      })
    } finally {
      setSending(false)
    }
  }

  const handleSaveLook = () => {
    onSaveLook({
      itemIds: recommendation.item_ids,
      title,
      date: plannerDate,
      notes,
      source: 'recommendation',
      occasion: recommendation.occasion || '',
      season: '',
    })
    setNotes('')
    setPlannerDate('')
  }

  return (
    <div className="bg-white rounded-[2rem] border border-[#f0d5db] p-6 space-y-6 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <h3 className="text-[#a17a8a] font-bold text-xl">{title}</h3>
          <p className="text-[#a17a8a]/60 text-sm">
            Occasion: {recommendation.occasion || 'Everyday'} • {scoreSummary.label} match
          </p>
        </div>

        <div className="px-4 py-2 bg-[#fdf2f5] border border-[#f0d5db] rounded-full text-[#a17a8a] text-sm font-bold">
          {recommendation.overall_score}% match
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendation.items.map((item) => (
          <div
            key={item.id}
            className="rounded-[1.5rem] border border-[#f0d5db] bg-[#fffafb] p-4 text-center"
          >
            <div className="aspect-square rounded-[1.25rem] bg-white flex items-center justify-center p-4 mb-3">
              {item.image_path ? (
                <img
                  src={resolveImageUrl(item.image_path)}
                  alt={item.subcategory || item.category}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <Shirt className="text-[#d9a5b3]" size={28} />
              )}
            </div>
            <h4 className="text-[#a17a8a] font-semibold capitalize">{item.subcategory || item.category}</h4>
            <p className="text-sm text-[#a17a8a]/60 capitalize">{item.color_primary}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
        <ScoreCard label="Overall" value={recommendation.overall_score} />
        <ScoreCard label="Color" value={recommendation.color_harmony_score} />
        <ScoreCard label="Shape" value={recommendation.body_shape_score} />
        <ScoreCard label="Undertone" value={recommendation.undertone_score} />
      </div>

      <div className="rounded-[1.75rem] bg-[#fff8fa] border border-[#f0d5db] p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Info size={16} className="text-[#d68c67]" />
          <h4 className="text-[#a17a8a] font-semibold">Why this outfit works</h4>
        </div>
        <p className="text-sm text-[#a17a8a]/70">{scoreSummary.detail}</p>
        <div className="space-y-2">
          {reasons.map((reason) => (
            <div
              key={reason}
              className="rounded-2xl bg-white border border-[#f0d5db] px-4 py-3 text-sm text-[#a17a8a]/80"
            >
              {reason}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[1.75rem] bg-[#fff8fa] border border-[#f0d5db] p-5 space-y-4">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-[#d68c67]" />
          <h4 className="text-[#a17a8a] font-semibold">Save this look</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[180px_minmax(0,1fr)_auto] gap-3">
          <input
            type="date"
            aria-label="Planner date"
            value={plannerDate}
            onChange={(event) => setPlannerDate(event.target.value)}
            className="w-full rounded-2xl border border-[#e8b4c0] bg-white px-4 py-3 text-sm text-[#a17a8a]"
          />
          <input
            type="text"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Optional planner note"
            className="w-full rounded-2xl border border-[#e8b4c0] bg-white px-4 py-3 text-sm text-[#a17a8a]"
          />
          <button
            type="button"
            onClick={handleSaveLook}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#a17a8a] to-[#d9a5b3] px-5 py-3 text-white font-semibold"
          >
            <Bookmark size={16} />
            Save
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <label className="flex items-center gap-3 text-sm text-[#a17a8a]">
          Rating
          <input
            type="range"
            min="1"
            max="5"
            value={rating}
            onChange={(event) => setRating(Number(event.target.value))}
            className="accent-[#d9a5b3]"
          />
          <span className="font-bold">{rating}/5</span>
        </label>

        <div className="flex gap-3 md:ml-auto">
          <button
            type="button"
            disabled={sending}
            onClick={() => sendFeedback(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-full border border-[#f0d5db] text-[#a17a8a] text-sm font-bold hover:bg-[#fdf2f5] transition-colors disabled:opacity-70"
          >
            {sending ? <LoaderCircle size={16} className="animate-spin" /> : <ThumbsUp size={16} />}
            Helpful
          </button>
          <button
            type="button"
            disabled={sending}
            onClick={() => sendFeedback(false)}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#fde8ee] text-[#b85e74] text-sm font-bold transition-colors disabled:opacity-70"
          >
            <Heart size={16} />
            Save Feedback
          </button>
        </div>
      </div>
    </div>
  )
}

const Recommendation = ({
  currentUser,
  items,
  recommendations,
  savedLooks,
  loading,
  error,
  onBack,
  onRefresh,
  onFeedback,
  onSaveLook,
  onLogout,
}) => {
  const [filters, setFilters] = useState({
    occasion: '',
    season: '',
    limit: 5,
  })

  const handleRefresh = async () => {
    await onRefresh(filters)
  }

  return (
    <div className="min-h-screen w-full bg-[#fdf2f5] p-6 md:p-10 font-sans relative">
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#a17a8a 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100 text-[#a17a8a] text-sm font-medium"
            >
              <ChevronLeft size={16} /> Wardrobe
            </button>
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-[#d68c67]" />
              <h1 className="text-2xl font-serif italic text-[#a17a8a]">Outfit Recommendations</h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-3 bg-white rounded-full shadow-sm border border-[#f0d5db] text-[#a17a8a] text-sm font-medium disabled:opacity-70"
            >
              {loading ? <LoaderCircle size={16} className="animate-spin" /> : <RefreshCcw size={16} />}
              Refresh
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-2 px-5 py-3 bg-[#fff5f7] rounded-full border border-[#f0d5db] text-[#a17a8a] text-sm font-medium"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        <section className="bg-white rounded-[2rem] border border-[#f0d5db] p-6 grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <p className="text-[#a17a8a]/60 text-xs uppercase tracking-[0.2em]">Stylist</p>
            <p className="text-[#a17a8a] font-semibold mt-2">
              {currentUser.full_name || currentUser.username}
            </p>
          </div>
          <div>
            <p className="text-[#a17a8a]/60 text-xs uppercase tracking-[0.2em]">Wardrobe Size</p>
            <p className="text-[#a17a8a] font-semibold mt-2">{items.length} item(s)</p>
          </div>
          <div>
            <p className="text-[#a17a8a]/60 text-xs uppercase tracking-[0.2em]">Saved Looks</p>
            <p className="text-[#a17a8a] font-semibold mt-2">{savedLooks.length}</p>
          </div>
          <label className="block">
            <span className="text-[#a17a8a]/60 text-xs uppercase tracking-[0.2em]">Occasion</span>
            <select
              value={filters.occasion}
              onChange={(event) => setFilters((current) => ({ ...current, occasion: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-[#e8b4c0] bg-[#fff5f7] px-4 py-3 text-sm text-[#a17a8a]"
            >
              <option value="">Any occasion</option>
              <option value="casual">Casual</option>
              <option value="formal">Formal</option>
              <option value="party">Party</option>
              <option value="work">Work</option>
              <option value="sports">Sports</option>
            </select>
          </label>
          <label className="block">
            <span className="text-[#a17a8a]/60 text-xs uppercase tracking-[0.2em]">Season</span>
            <select
              value={filters.season}
              onChange={(event) => setFilters((current) => ({ ...current, season: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-[#e8b4c0] bg-[#fff5f7] px-4 py-3 text-sm text-[#a17a8a]"
            >
              <option value="">Any season</option>
              <option value="all-season">All season</option>
              <option value="summer">Summer</option>
              <option value="winter">Winter</option>
              <option value="spring">Spring</option>
              <option value="autumn">Autumn</option>
            </select>
          </label>
        </section>

        {error ? (
          <div className="rounded-2xl border border-[#f0d5db] bg-white px-5 py-4 text-sm text-[#b85e74]">
            {error}
          </div>
        ) : null}

        {recommendations.length === 0 ? (
          <div className="bg-white rounded-[2rem] border border-dashed border-[#e8b4c0] min-h-[260px] flex items-center justify-center text-center px-6">
            <div className="space-y-3">
              <Sparkles size={24} className="mx-auto text-[#d68c67]" />
              <p className="font-semibold text-[#a17a8a]">No recommendations yet.</p>
              <p className="text-sm text-[#a17a8a]/70">
                Add at least 2 wardrobe items, then refresh to generate outfits.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {recommendations.map((recommendation, index) => (
              <RecommendationCard
                key={`${recommendation.item_ids.join('-')}-${index}`}
                recommendation={recommendation}
                onFeedback={onFeedback}
                onSaveLook={onSaveLook}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Recommendation
