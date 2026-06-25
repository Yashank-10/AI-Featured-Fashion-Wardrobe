import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Warbdobe from './Warbdobe'

void React

const items = [
  {
    id: 1,
    category: 'top',
    subcategory: 'Silk Blouse',
    color_primary: 'cream',
    brand: 'Muse',
    pattern: 'solid',
    material: 'silk',
    season: 'summer',
    occasion: 'work',
    favorite: true,
    times_worn: 4,
    last_worn: '2026-06-10T00:00:00.000Z',
    created_at: '2026-06-01T00:00:00.000Z',
    image_path: '',
  },
  {
    id: 2,
    category: 'shoes',
    subcategory: 'City Loafers',
    color_primary: 'black',
    brand: 'Stride',
    pattern: 'solid',
    material: 'leather',
    season: 'all-season',
    occasion: 'casual',
    favorite: false,
    times_worn: 1,
    last_worn: '2026-06-15T00:00:00.000Z',
    created_at: '2026-06-12T00:00:00.000Z',
    image_path: '',
  },
]

const stats = {
  total_items: 2,
  favorites: 1,
  total_wears: 5,
  by_category: {
    top: 1,
    shoes: 1,
  },
  by_season: {
    summer: 1,
    'all-season': 1,
  },
}

const baseProps = {
  currentUser: { full_name: 'Aisha Khan', username: 'aisha' },
  items,
  stats,
  savedLooks: [],
  loading: false,
  error: '',
  onAddItem: vi.fn(),
  onDeleteItem: vi.fn(),
  onDeleteSavedLook: vi.fn(),
  onToggleFavorite: vi.fn(),
  onMarkItemWorn: vi.fn(),
  onGenerateRecommendations: vi.fn(),
  onSaveLook: vi.fn(),
  onLogout: vi.fn(),
}

describe('Warbdobe', () => {
  it('filters the collection from the search box', async () => {
    const user = userEvent.setup()

    render(<Warbdobe {...baseProps} />)

    expect(screen.getByText('2 active item(s)')).toBeInTheDocument()

    await user.type(screen.getByPlaceholderText(/search color, category, brand, season/i), 'loafer')

    expect(screen.getByText('1 active item(s)')).toBeInTheDocument()
  })

  it('requests recommendations from the wardrobe screen', async () => {
    const user = userEvent.setup()
    const onGenerateRecommendations = vi.fn()

    render(<Warbdobe {...baseProps} onGenerateRecommendations={onGenerateRecommendations} />)

    await user.click(screen.getByRole('button', { name: /get recommendations/i }))

    expect(onGenerateRecommendations).toHaveBeenCalledWith({ limit: 5 })
  })
})
