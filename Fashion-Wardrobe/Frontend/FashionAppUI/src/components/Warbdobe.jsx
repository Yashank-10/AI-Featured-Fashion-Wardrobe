import { useState } from 'react'
import {
  Shirt,
  Sparkles,
  Plus,
  Heart,
  Trash2,
  LogOut,
  WandSparkles,
  LoaderCircle,
} from 'lucide-react'
import { resolveImageUrl } from '../lib/api'

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

const StatCard = ({ label, value }) => (
  <div className="bg-white rounded-[1.75rem] border border-[#f0d5db] p-5 shadow-sm">
    <p className="text-[#a17a8a]/60 text-xs uppercase tracking-[0.2em]">{label}</p>
    <p className="text-3xl font-serif italic text-[#a17a8a] mt-2">{value}</p>
  </div>
)

const WardrobeItemCard = ({ item, onDelete, onToggleFavorite }) => (
  <div className="bg-white rounded-[2rem] border border-[#f0d5db] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
    <div className="aspect-[4/5] p-6 flex items-center justify-center bg-white">
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
      </div>

      <div>
        <h3 className="text-[#a17a8a] font-bold text-lg">{item.subcategory || item.brand || 'Wardrobe item'}</h3>
        <p className="text-[#a17a8a]/60 text-sm">
          {item.color_primary}
          {item.season ? ` - ${item.season}` : ''}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onToggleFavorite(item.id)}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
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
          onClick={() => onDelete(item.id)}
          className="rounded-full p-3 bg-[#fff5f7] text-[#b85e74] border border-[#f0d5db] hover:bg-[#fde8ee] transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  </div>
)

const Warbdobe = ({
  currentUser,
  items,
  stats,
  loading,
  error,
  onAddItem,
  onDeleteItem,
  onToggleFavorite,
  onGenerateRecommendations,
  onLogout,
}) => {
  const [formValues, setFormValues] = useState(initialFormValues)
  const [selectedFile, setSelectedFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)

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

  const totalItems = stats?.total_items ?? items.length
  const favoriteCount = stats?.favorites ?? items.filter((item) => item.favorite).length
  const totalWears = stats?.total_wears ?? 0

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
              <h1 className="text-3xl font-serif italic text-[#a17a8a]">My Wardrobe</h1>
            </div>
            <p className="text-[#a17a8a]/70">
              Signed in as <span className="font-semibold">{currentUser.full_name || currentUser.username}</span>
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

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatCard label="Total Items" value={totalItems} />
          <StatCard label="Favorites" value={favoriteCount} />
          <StatCard label="Times Worn" value={totalWears} />
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-[360px_minmax(0,1fr)] gap-8">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-[2rem] border border-[#f0d5db] p-6 shadow-sm space-y-4 self-start"
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

          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-serif italic text-[#a17a8a]">Your collection</h2>
              <span className="text-sm text-[#a17a8a]/60">{items.length} active item(s)</span>
            </div>

            {items.length === 0 ? (
              <div className="border-2 border-dashed border-[#e8b4c0]/40 rounded-[2rem] flex items-center justify-center min-h-[320px] text-center px-6">
                <div className="space-y-3 text-[#a17a8a]">
                  <Plus size={28} className="mx-auto" />
                  <p className="font-semibold">Your wardrobe is empty.</p>
                  <p className="text-sm text-[#a17a8a]/70">
                    Upload at least 2 items to start getting outfit recommendations.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-6">
                {items.map((item) => (
                  <WardrobeItemCard
                    key={item.id}
                    item={item}
                    onDelete={onDeleteItem}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))}
              </div>
            )}
          </section>
        </section>
      </div>
    </div>
  )
}

export default Warbdobe
