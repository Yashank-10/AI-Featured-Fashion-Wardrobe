import React, { useMemo, useState } from 'react'
import {
  ArrowUpDown,
  BarChart3,
  Bookmark,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GripVertical,
  Heart,
  LoaderCircle,
  LogOut,
  Plus,
  RotateCcw,
  Search,
  Shirt,
  Sparkles,
  Trash2,
  WandSparkles,
} from 'lucide-react'
import { resolveImageUrl } from '../lib/api'

void React

const initialFormValues = {
  category: 'top',
  subcategory: '',
  color_primary: 'black',
  brand: '',
  pattern: 'solid',
  material: '',
  season: 'all-season',
  occasion: 'casual',
}

const initialBuilderSlots = {
  top: null,
  bottom: null,
  dress: null,
  outerwear: null,
  shoes: null,
  accessory: null,
}

const categorySlotMap = {
  top: 'top',
  bottom: 'bottom',
  dress: 'dress',
  outerwear: 'outerwear',
  shoes: 'shoes',
  accessory: 'accessory',
}

const formatRelativeDate = (value) => {
  if (!value) {
    return 'Not worn yet'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return 'Not worn yet'
  }

  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const formatCalendarDate = (value) => {
  if (!value) {
    return 'Unscheduled'
  }

  return new Date(value).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
  })
}

const StatCard = ({ label, value, detail }) => (
  <div className="bg-white rounded-[1.75rem] border border-[#f0d5db] p-5 shadow-sm">
    <p className="text-[#a17a8a]/60 text-xs uppercase tracking-[0.2em]">{label}</p>
    <p className="text-3xl font-serif italic text-[#a17a8a] mt-2">{value}</p>
    {detail ? <p className="text-sm text-[#a17a8a]/65 mt-2">{detail}</p> : null}
  </div>
)

const FilterChip = ({ active, children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
      active ? 'bg-[#a17a8a] text-white' : 'bg-white text-[#a17a8a] border border-[#f0d5db]'
    }`}
  >
    {children}
  </button>
)

const BuilderDropZone = ({ label, slotKey, item, onDropItem, onClearSlot }) => {
  const handleDrop = (event) => {
    event.preventDefault()
    const itemId = Number(event.dataTransfer.getData('text/plain'))
    if (itemId) {
      onDropItem(slotKey, itemId)
    }
  }

  return (
    <div
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
      className="rounded-[1.5rem] border-2 border-dashed border-[#e8b4c0] bg-[#fff8fa] p-4 min-h-[140px] flex flex-col justify-between"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.2em] text-[#a17a8a]/70">{label}</p>
        {item ? (
          <button
            type="button"
            onClick={() => onClearSlot(slotKey)}
            className="text-[#b85e74] text-xs font-semibold"
          >
            Clear
          </button>
        ) : null}
      </div>

      {item ? (
        <div className="space-y-3">
          <div className="h-24 rounded-2xl bg-white flex items-center justify-center p-3">
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
          <div>
            <p className="text-sm font-semibold text-[#a17a8a]">
              {item.subcategory || item.brand || item.category}
            </p>
            <p className="text-xs text-[#a17a8a]/60 capitalize">
              {item.color_primary} • {item.category}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-center text-sm text-[#a17a8a]/60">
          Drag an item here
        </div>
      )}
    </div>
  )
}

const WardrobeItemCard = ({ item, onDelete, onToggleFavorite, onMarkItemWorn, onDragStart }) => (
  <div
    draggable
    onDragStart={(event) => onDragStart(event, item.id)}
    className="bg-white rounded-[2rem] border border-[#f0d5db] overflow-hidden shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="aspect-[4/5] p-6 flex items-center justify-center bg-white relative">
      <div className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-[#fff5f7] px-3 py-1 text-[11px] font-semibold text-[#a17a8a] border border-[#f0d5db]">
        <GripVertical size={12} />
        Drag to builder
      </div>
      {item.image_path ? (
        <img
          src={resolveImageUrl(item.image_path)}
          alt={`${item.category} ${item.subcategory || ''}`.trim()}
          className="max-w-full max-h-full object-contain"
        />
      ) : (
        <div className="w-full h-full rounded-2xl bg-[#fff5f7] border border-dashed border-[#e8b4c0] flex items-center justify-center text-[#a17a8a]/60 text-sm">
          No image
        </div>
      )}
    </div>

    <div className="p-4 pt-0 space-y-3">
      <div className="flex flex-wrap gap-2">
        <span className="px-3 py-1 rounded-full bg-[#fdf1e8] text-[#d68c67] text-xs font-bold uppercase tracking-wider">
          {item.category}
        </span>
        {item.occasion ? (
          <span className="px-3 py-1 rounded-full bg-[#f0f4f8] text-[#8ba3b8] text-xs font-bold uppercase tracking-wider">
            {item.occasion}
          </span>
        ) : null}
        {item.favorite ? (
          <span className="px-3 py-1 rounded-full bg-[#fde8ee] text-[#b85e74] text-xs font-bold uppercase tracking-wider">
            Favorite
          </span>
        ) : null}
      </div>

      <div>
        <h3 className="text-[#a17a8a] font-bold text-lg">{item.subcategory || item.brand || 'Wardrobe item'}</h3>
        <p className="text-[#a17a8a]/60 text-sm">
          {item.color_primary}
          {item.season ? ` - ${item.season}` : ''}
        </p>
        <p className="text-xs text-[#a17a8a]/55 mt-1">
          Worn {item.times_worn} time(s) • {formatRelativeDate(item.last_worn)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onToggleFavorite(item.id)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            item.favorite
              ? 'bg-[#fde8ee] text-[#b85e74]'
              : 'bg-[#f9f4f6] text-[#a17a8a]'
          }`}
        >
          <span className="inline-flex items-center gap-2">
            <Heart size={16} fill={item.favorite ? 'currentColor' : 'none'} />
            {item.favorite ? 'Saved' : 'Favorite'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onMarkItemWorn(item.id)}
          className="rounded-full px-4 py-2 text-sm font-semibold bg-[#eef7f3] text-[#5c8f76]"
        >
          Mark worn
        </button>
      </div>

      <button
        type="button"
        onClick={() => onDelete(item.id)}
        className="w-full rounded-full p-3 bg-[#fff5f7] text-[#b85e74] border border-[#f0d5db] hover:bg-[#fde8ee] transition-colors"
      >
        <span className="inline-flex items-center gap-2">
          <Trash2 size={16} />
          Remove item
        </span>
      </button>
    </div>
  </div>
)

const Warbdobe = ({
  currentUser,
  items,
  stats,
  savedLooks,
  loading,
  error,
  onAddItem,
  onDeleteItem,
  onDeleteSavedLook,
  onToggleFavorite,
  onMarkItemWorn,
  onGenerateRecommendations,
  onSaveLook,
  onLogout,
}) => {
  const [formValues, setFormValues] = useState(initialFormValues)
  const [selectedFile, setSelectedFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [seasonFilter, setSeasonFilter] = useState('all')
  const [occasionFilter, setOccasionFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [builderSlots, setBuilderSlots] = useState(initialBuilderSlots)
  const [plannerTitle, setPlannerTitle] = useState('')
  const [plannerDate, setPlannerDate] = useState('')
  const [plannerNotes, setPlannerNotes] = useState('')

  const handleFieldChange = (field, value) => {
    setFormValues((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)

    try {
      await onAddItem({
        ...formValues,
        ...(selectedFile ? { file: selectedFile } : {}),
      })
      setFormValues(initialFormValues)
      setSelectedFile(null)
      event.target.reset()
    } finally {
      setSubmitting(false)
    }
  }

  const categories = useMemo(
    () => ['all', ...new Set(items.map((item) => item.category).filter(Boolean))],
    [items]
  )

  const seasons = useMemo(
    () => ['all', ...new Set(items.map((item) => item.season).filter(Boolean))],
    [items]
  )

  const occasions = useMemo(
    () => ['all', ...new Set(items.map((item) => item.occasion).filter(Boolean))],
    [items]
  )

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    const nextItems = items.filter((item) => {
      const matchesSearch =
        !normalizedSearch ||
        [
          item.category,
          item.subcategory,
          item.brand,
          item.color_primary,
          item.occasion,
          item.season,
        ]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalizedSearch))

      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
      const matchesSeason = seasonFilter === 'all' || item.season === seasonFilter
      const matchesOccasion = occasionFilter === 'all' || item.occasion === occasionFilter

      return matchesSearch && matchesCategory && matchesSeason && matchesOccasion
    })

    nextItems.sort((left, right) => {
      if (sortBy === 'most-worn') {
        return right.times_worn - left.times_worn
      }
      if (sortBy === 'favorites') {
        return Number(right.favorite) - Number(left.favorite) || right.id - left.id
      }
      if (sortBy === 'recently-worn') {
        return new Date(right.last_worn || 0) - new Date(left.last_worn || 0)
      }
      return new Date(right.created_at) - new Date(left.created_at)
    })

    return nextItems
  }, [categoryFilter, items, occasionFilter, search, seasonFilter, sortBy])

  const totalItems = stats?.total_items ?? items.length
  const favoriteCount = stats?.favorites ?? items.filter((item) => item.favorite).length
  const totalWears = stats?.total_wears ?? 0
  const unwornCount = items.filter((item) => item.times_worn === 0).length

  const topCategories = Object.entries(stats?.by_category ?? {})
    .sort((left, right) => right[1] - left[1])
    .slice(0, 4)

  const seasonBreakdown = Object.entries(stats?.by_season ?? {}).sort((left, right) => right[1] - left[1])

  const recentWearHistory = [...items]
    .filter((item) => item.last_worn)
    .sort((left, right) => new Date(right.last_worn) - new Date(left.last_worn))
    .slice(0, 5)

  const builderItems = Object.fromEntries(
    Object.entries(builderSlots).map(([slotKey, itemId]) => [
      slotKey,
      items.find((item) => item.id === itemId) || null,
    ])
  )

  const builderSelectedIds = Object.values(builderSlots).filter(Boolean)
  const builderOccasion =
    builderSelectedIds
      .map((itemId) => items.find((item) => item.id === itemId)?.occasion)
      .find(Boolean) || ''
  const builderSeason =
    builderSelectedIds
      .map((itemId) => items.find((item) => item.id === itemId)?.season)
      .find(Boolean) || ''

  const handleDragStart = (event, itemId) => {
    event.dataTransfer.setData('text/plain', String(itemId))
  }

  const handleDropItem = (slotKey, itemId) => {
    const item = items.find((currentItem) => currentItem.id === itemId)
    if (!item) {
      return
    }

    if (categorySlotMap[item.category] !== slotKey) {
      return
    }

    setBuilderSlots((currentSlots) => {
      const nextSlots = { ...currentSlots }
      const duplicateSlot = Object.entries(nextSlots).find(([, currentItemId]) => currentItemId === itemId)?.[0]
      if (duplicateSlot) {
        nextSlots[duplicateSlot] = null
      }
      nextSlots[slotKey] = itemId
      return nextSlots
    })
  }

  const handleClearSlot = (slotKey) => {
    setBuilderSlots((currentSlots) => ({
      ...currentSlots,
      [slotKey]: null,
    }))
  }

  const handleResetBuilder = () => {
    setBuilderSlots(initialBuilderSlots)
    setPlannerTitle('')
    setPlannerDate('')
    setPlannerNotes('')
  }

  const handleSaveBuilderLook = () => {
    if (builderSelectedIds.length < 2) {
      return
    }

    onSaveLook({
      itemIds: builderSelectedIds,
      title: plannerTitle,
      date: plannerDate,
      notes: plannerNotes,
      source: 'builder',
      occasion: builderOccasion,
      season: builderSeason,
    })
    handleResetBuilder()
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

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        <header className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="text-[#e8b4c0]" size={20} fill="#e8b4c0" />
              <h1 className="text-3xl font-serif italic text-[#a17a8a]">My Wardrobe Studio</h1>
            </div>
            <p className="text-[#a17a8a]/70">
              Welcome! <span className="font-semibold">{currentUser.full_name || currentUser.username}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onGenerateRecommendations({ limit: 5 })}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#e8b4c0] to-[#d9a5b3] text-white rounded-full text-sm font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              <WandSparkles size={18} />
              Get Recommendations
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-2 px-5 py-3 bg-white rounded-full shadow-sm border border-[#f0d5db] text-[#a17a8a] hover:bg-gray-50 transition-all font-medium text-sm"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard label="Total Items" value={totalItems} detail="Across your active wardrobe" />
          <StatCard label="Favorites" value={favoriteCount} detail="Pieces you reach for often" />
          <StatCard label="Times Worn" value={totalWears} detail="Tracked wear interactions" />
          <StatCard label="Unworn Pieces" value={unwornCount} detail="Great candidates for new looks" />
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-[360px_minmax(0,1fr)] gap-8">
          <div className="space-y-6">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-[2rem] border border-[#f0d5db] p-6 shadow-sm space-y-4"
            >
              <div className="flex items-center gap-2">
                <Plus size={18} className="text-[#d68c67]" />
                <h2 className="text-xl font-serif italic text-[#a17a8a]">Add an item</h2>
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
                className="w-full rounded-2xl border border-[#e8b4c0] bg-[#fff5f7] px-4 py-3 text-sm text-[#a17a8a]"
              />

              <p className="text-xs text-[#a17a8a]/60">
                Image is optional. You can upload a photo or add the clothing item manually.
              </p>

              <select
                value={formValues.category}
                onChange={(event) => handleFieldChange('category', event.target.value)}
                className="w-full rounded-2xl border border-[#e8b4c0] bg-[#fff5f7] px-4 py-3 text-sm text-[#a17a8a]"
              >
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="dress">Dress</option>
                <option value="outerwear">Outerwear</option>
                <option value="shoes">Shoes</option>
                <option value="accessory">Accessory</option>
              </select>

              <input
                type="text"
                value={formValues.subcategory}
                onChange={(event) => handleFieldChange('subcategory', event.target.value)}
                placeholder="Subcategory"
                className="w-full rounded-2xl border border-[#e8b4c0] bg-[#fff5f7] px-4 py-3 text-sm text-[#a17a8a]"
              />

              <input
                type="text"
                value={formValues.color_primary}
                onChange={(event) => handleFieldChange('color_primary', event.target.value)}
                placeholder="Primary color"
                className="w-full rounded-2xl border border-[#e8b4c0] bg-[#fff5f7] px-4 py-3 text-sm text-[#a17a8a]"
                required
              />

              <input
                type="text"
                value={formValues.brand}
                onChange={(event) => handleFieldChange('brand', event.target.value)}
                placeholder="Brand"
                className="w-full rounded-2xl border border-[#e8b4c0] bg-[#fff5f7] px-4 py-3 text-sm text-[#a17a8a]"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={formValues.pattern}
                  onChange={(event) => handleFieldChange('pattern', event.target.value)}
                  placeholder="Pattern"
                  className="w-full rounded-2xl border border-[#e8b4c0] bg-[#fff5f7] px-4 py-3 text-sm text-[#a17a8a]"
                />

                <input
                  type="text"
                  value={formValues.material}
                  onChange={(event) => handleFieldChange('material', event.target.value)}
                  placeholder="Material"
                  className="w-full rounded-2xl border border-[#e8b4c0] bg-[#fff5f7] px-4 py-3 text-sm text-[#a17a8a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <select
                  value={formValues.season}
                  onChange={(event) => handleFieldChange('season', event.target.value)}
                  className="w-full rounded-2xl border border-[#e8b4c0] bg-[#fff5f7] px-4 py-3 text-sm text-[#a17a8a]"
                >
                  <option value="all-season">All season</option>
                  <option value="summer">Summer</option>
                  <option value="winter">Winter</option>
                  <option value="spring">Spring</option>
                  <option value="autumn">Autumn</option>
                </select>

                <select
                  value={formValues.occasion}
                  onChange={(event) => handleFieldChange('occasion', event.target.value)}
                  className="w-full rounded-2xl border border-[#e8b4c0] bg-[#fff5f7] px-4 py-3 text-sm text-[#a17a8a]"
                >
                  <option value="casual">Casual</option>
                  <option value="formal">Formal</option>
                  <option value="party">Party</option>
                  <option value="work">Work</option>
                  <option value="sports">Sports</option>
                </select>
              </div>

              {error ? (
                <div className="rounded-2xl border border-[#f0d5db] bg-[#fff8fa] px-4 py-3 text-sm text-[#b85e74]">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={submitting || loading}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#e8b4c0] to-[#d9a5b3] px-5 py-3.5 text-white font-bold shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? <LoaderCircle size={18} className="animate-spin" /> : <Shirt size={18} />}
                {submitting ? 'Saving...' : 'Add Item'}
              </button>
            </form>

            <section className="bg-white rounded-[2rem] border border-[#f0d5db] p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-2">
                <BarChart3 size={18} className="text-[#d68c67]" />
                <h2 className="text-xl font-serif italic text-[#a17a8a]">Wardrobe insights</h2>
              </div>

              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.2em] text-[#a17a8a]/60">Top categories</p>
                {topCategories.length === 0 ? (
                  <p className="text-sm text-[#a17a8a]/70">Add items to unlock wardrobe analytics.</p>
                ) : (
                  topCategories.map(([category, count]) => (
                    <div key={category} className="space-y-1">
                      <div className="flex items-center justify-between text-sm text-[#a17a8a]">
                        <span className="capitalize">{category}</span>
                        <span>{count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-[#f6e2e8] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#d9a5b3] to-[#a17a8a]"
                          style={{ width: `${Math.max((count / Math.max(totalItems, 1)) * 100, 10)}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.2em] text-[#a17a8a]/60">Season spread</p>
                <div className="flex flex-wrap gap-2">
                  {seasonBreakdown.length === 0 ? (
                    <p className="text-sm text-[#a17a8a]/70">No seasonal tags yet.</p>
                  ) : (
                    seasonBreakdown.map(([season, count]) => (
                      <span
                        key={season}
                        className="px-3 py-2 rounded-full bg-[#fff5f7] border border-[#f0d5db] text-sm text-[#a17a8a]"
                      >
                        {season}: {count}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </section>
          </div>

          <section className="space-y-8">
            <div className="bg-white rounded-[2rem] border border-[#f0d5db] p-6 shadow-sm space-y-5">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-serif italic text-[#a17a8a]">Discover your wardrobe</h2>
                  <p className="text-sm text-[#a17a8a]/65 mt-1">
                    Search, filter, and sort pieces before building looks.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <FilterChip active={sortBy === 'newest'} onClick={() => setSortBy('newest')}>
                    Newest
                  </FilterChip>
                  <FilterChip active={sortBy === 'most-worn'} onClick={() => setSortBy('most-worn')}>
                    Most worn
                  </FilterChip>
                  <FilterChip active={sortBy === 'favorites'} onClick={() => setSortBy('favorites')}>
                    Favorites first
                  </FilterChip>
                  <FilterChip
                    active={sortBy === 'recently-worn'}
                    onClick={() => setSortBy('recently-worn')}
                  >
                    Recently worn
                  </FilterChip>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))] gap-3">
                <label className="relative">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a17a8a]/50" />
                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search color, category, brand, season..."
                    className="w-full rounded-2xl border border-[#e8b4c0] bg-[#fff5f7] pl-11 pr-4 py-3 text-sm text-[#a17a8a]"
                  />
                </label>

                <label className="block">
                  <span className="sr-only">Category filter</span>
                  <select
                    value={categoryFilter}
                    onChange={(event) => setCategoryFilter(event.target.value)}
                    className="w-full rounded-2xl border border-[#e8b4c0] bg-[#fff5f7] px-4 py-3 text-sm text-[#a17a8a]"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All categories' : category}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="sr-only">Season filter</span>
                  <select
                    value={seasonFilter}
                    onChange={(event) => setSeasonFilter(event.target.value)}
                    className="w-full rounded-2xl border border-[#e8b4c0] bg-[#fff5f7] px-4 py-3 text-sm text-[#a17a8a]"
                  >
                    {seasons.map((season) => (
                      <option key={season} value={season}>
                        {season === 'all' ? 'All seasons' : season}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="sr-only">Occasion filter</span>
                  <select
                    value={occasionFilter}
                    onChange={(event) => setOccasionFilter(event.target.value)}
                    className="w-full rounded-2xl border border-[#e8b4c0] bg-[#fff5f7] px-4 py-3 text-sm text-[#a17a8a]"
                  >
                    {occasions.map((occasion) => (
                      <option key={occasion} value={occasion}>
                        {occasion === 'all' ? 'All occasions' : occasion}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#a17a8a]/60">
                <ArrowUpDown size={14} />
                {filteredItems.length} pieces match your current view
              </div>
            </div>

            <div className="grid grid-cols-1 2xl:grid-cols-[minmax(0,1.25fr)_380px] gap-8">
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-serif italic text-[#a17a8a]">Your collection</h2>
                  <span className="text-sm text-[#a17a8a]/60">{filteredItems.length} active item(s)</span>
                </div>

                {filteredItems.length === 0 ? (
                  <div className="border-2 border-dashed border-[#e8b4c0]/40 rounded-[2rem] flex items-center justify-center min-h-[320px] text-center px-6">
                    <div className="space-y-3 text-[#a17a8a]">
                      <Plus size={28} className="mx-auto" />
                      <p className="font-semibold">No items match these filters.</p>
                      <p className="text-sm text-[#a17a8a]/70">
                        Adjust the search controls or add a new piece to continue.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {filteredItems.map((item) => (
                      <WardrobeItemCard
                        key={item.id}
                        item={item}
                        onDelete={onDeleteItem}
                        onToggleFavorite={onToggleFavorite}
                        onMarkItemWorn={onMarkItemWorn}
                        onDragStart={handleDragStart}
                      />
                    ))}
                  </div>
                )}
              </section>

              <aside className="space-y-6">
                <section className="bg-white rounded-[2rem] border border-[#f0d5db] p-6 shadow-sm space-y-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-serif italic text-[#a17a8a]">Interactive outfit builder</h2>
                      <p className="text-sm text-[#a17a8a]/65 mt-1">
                        Drag items from your wardrobe into slots, then save the look.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetBuilder}
                      className="inline-flex items-center gap-2 text-sm text-[#a17a8a] font-semibold"
                    >
                      <RotateCcw size={16} />
                      Reset
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <BuilderDropZone
                      label="Top"
                      slotKey="top"
                      item={builderItems.top}
                      onDropItem={handleDropItem}
                      onClearSlot={handleClearSlot}
                    />
                    <BuilderDropZone
                      label="Bottom"
                      slotKey="bottom"
                      item={builderItems.bottom}
                      onDropItem={handleDropItem}
                      onClearSlot={handleClearSlot}
                    />
                    <BuilderDropZone
                      label="Dress"
                      slotKey="dress"
                      item={builderItems.dress}
                      onDropItem={handleDropItem}
                      onClearSlot={handleClearSlot}
                    />
                    <BuilderDropZone
                      label="Outerwear"
                      slotKey="outerwear"
                      item={builderItems.outerwear}
                      onDropItem={handleDropItem}
                      onClearSlot={handleClearSlot}
                    />
                    <BuilderDropZone
                      label="Shoes"
                      slotKey="shoes"
                      item={builderItems.shoes}
                      onDropItem={handleDropItem}
                      onClearSlot={handleClearSlot}
                    />
                    <BuilderDropZone
                      label="Accessory"
                      slotKey="accessory"
                      item={builderItems.accessory}
                      onDropItem={handleDropItem}
                      onClearSlot={handleClearSlot}
                    />
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      value={plannerTitle}
                      onChange={(event) => setPlannerTitle(event.target.value)}
                      placeholder="Name this look"
                      className="w-full rounded-2xl border border-[#e8b4c0] bg-[#fff5f7] px-4 py-3 text-sm text-[#a17a8a]"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="date"
                        value={plannerDate}
                        onChange={(event) => setPlannerDate(event.target.value)}
                        className="w-full rounded-2xl border border-[#e8b4c0] bg-[#fff5f7] px-4 py-3 text-sm text-[#a17a8a]"
                      />
                      <input
                        type="text"
                        value={plannerNotes}
                        onChange={(event) => setPlannerNotes(event.target.value)}
                        placeholder="Short notes"
                        className="w-full rounded-2xl border border-[#e8b4c0] bg-[#fff5f7] px-4 py-3 text-sm text-[#a17a8a]"
                      />
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] bg-[#fff5f7] border border-[#f0d5db] p-4">
                    <p className="text-sm font-semibold text-[#a17a8a]">Builder summary</p>
                    <p className="text-sm text-[#a17a8a]/65 mt-1">
                      {builderSelectedIds.length >= 2
                        ? `Ready to save ${builderSelectedIds.length} selected item(s).`
                        : 'Select at least two pieces to create a saved look.'}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {builderOccasion ? (
                        <span className="px-3 py-1 rounded-full bg-white border border-[#f0d5db] text-xs text-[#a17a8a]">
                          Occasion: {builderOccasion}
                        </span>
                      ) : null}
                      {builderSeason ? (
                        <span className="px-3 py-1 rounded-full bg-white border border-[#f0d5db] text-xs text-[#a17a8a]">
                          Season: {builderSeason}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={builderSelectedIds.length < 2}
                    onClick={handleSaveBuilderLook}
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#a17a8a] to-[#d9a5b3] px-5 py-3.5 text-white font-bold shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Bookmark size={18} />
                    Save look to planner
                  </button>
                </section>

                <section className="bg-white rounded-[2rem] border border-[#f0d5db] p-6 shadow-sm space-y-5">
                  <div className="flex items-center gap-2">
                    <CalendarDays size={18} className="text-[#d68c67]" />
                    <h2 className="text-xl font-serif italic text-[#a17a8a]">Outfit calendar</h2>
                  </div>

                  {savedLooks.length === 0 ? (
                    <p className="text-sm text-[#a17a8a]/70">
                      Saved looks will appear here once you build or save a recommendation.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {savedLooks.slice(0, 6).map((look) => {
                        const lookItems = look.itemIds
                          .map((itemId) => items.find((item) => item.id === itemId))
                          .filter(Boolean)

                        return (
                          <div
                            key={look.id}
                            className="rounded-[1.5rem] border border-[#f0d5db] bg-[#fffafb] p-4 space-y-3"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold text-[#a17a8a]">{look.title}</p>
                                <p className="text-xs text-[#a17a8a]/60">
                                  {formatCalendarDate(look.date)} • {look.source}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => onDeleteSavedLook(look.id)}
                                className="text-[#b85e74]"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {lookItems.map((item) => (
                                <span
                                  key={item.id}
                                  className="px-3 py-1 rounded-full bg-white border border-[#f0d5db] text-xs text-[#a17a8a]"
                                >
                                  {item.subcategory || item.category}
                                </span>
                              ))}
                            </div>

                            {look.notes ? (
                              <p className="text-xs text-[#a17a8a]/70">{look.notes}</p>
                            ) : null}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </section>

                <section className="bg-white rounded-[2rem] border border-[#f0d5db] p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2">
                    <Clock3 size={18} className="text-[#d68c67]" />
                    <h2 className="text-xl font-serif italic text-[#a17a8a]">Wear history</h2>
                  </div>

                  {recentWearHistory.length === 0 ? (
                    <p className="text-sm text-[#a17a8a]/70">
                      Use “Mark worn” on an item to start building recent wear history.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {recentWearHistory.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-3 rounded-[1.25rem] bg-[#fff8fa] border border-[#f0d5db] px-4 py-3"
                        >
                          <div>
                            <p className="text-sm font-semibold text-[#a17a8a]">
                              {item.subcategory || item.category}
                            </p>
                            <p className="text-xs text-[#a17a8a]/60">
                              {formatRelativeDate(item.last_worn)} • worn {item.times_worn} time(s)
                            </p>
                          </div>
                          <CheckCircle2 size={16} className="text-[#5c8f76]" />
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </aside>
            </div>
          </section>
        </section>
      </div>
    </div>
  )
}

export default Warbdobe
