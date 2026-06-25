import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Recommendation from './Recommendation'

void React

const recommendation = {
  recommendation_id: 'look-1',
  item_ids: [1, 2],
  items: [
    {
      id: 1,
      category: 'top',
      subcategory: 'Silk Blouse',
      color_primary: 'cream',
      image_path: '',
    },
    {
      id: 2,
      category: 'bottom',
      subcategory: 'Tailored Trousers',
      color_primary: 'navy',
      image_path: '',
    },
  ],
  occasion: 'work',
  overall_score: 92,
  color_harmony_score: 90,
  body_shape_score: 88,
  undertone_score: 84,
}

const baseProps = {
  currentUser: { full_name: 'Aisha Khan', username: 'aisha' },
  items: recommendation.items,
  recommendations: [recommendation],
  savedLooks: [],
  loading: false,
  error: '',
  onBack: vi.fn(),
  onRefresh: vi.fn(),
  onFeedback: vi.fn().mockResolvedValue(undefined),
  onSaveLook: vi.fn(),
  onLogout: vi.fn(),
}

describe('Recommendation', () => {
  it('submits helpful feedback for an outfit', async () => {
    const user = userEvent.setup()
    const onFeedback = vi.fn().mockResolvedValue(undefined)

    render(<Recommendation {...baseProps} onFeedback={onFeedback} />)

    await user.click(screen.getByRole('button', { name: /helpful/i }))

    await waitFor(() => {
      expect(onFeedback).toHaveBeenCalledWith('look-1', {
        recommendation_type: 'outfit',
        helpful: true,
        rating: 5,
        comment: 'Looks like a good outfit.',
      })
    })
  })

  it('saves a recommended look to the planner', async () => {
    const user = userEvent.setup()
    const onSaveLook = vi.fn()

    render(<Recommendation {...baseProps} onSaveLook={onSaveLook} />)

    await user.type(screen.getByLabelText(/planner date/i), '2026-07-01')
    await user.type(screen.getByPlaceholderText(/optional planner note/i), 'Client meeting outfit')
    await user.click(screen.getByRole('button', { name: /^save$/i }))

    expect(onSaveLook).toHaveBeenCalledWith({
      itemIds: [1, 2],
      title: 'Silk Blouse + Tailored Trousers',
      date: '2026-07-01',
      notes: 'Client meeting outfit',
      source: 'recommendation',
      occasion: 'work',
      season: '',
    })
  })
})
