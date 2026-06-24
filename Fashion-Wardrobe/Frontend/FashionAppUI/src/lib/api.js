const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:8000'
).replace(/\/+$/, '')

const buildUrl = (path) => `${API_BASE_URL}${path}`

const parseError = async (response) => {
  try {
    const data = await response.json()
    return data.detail || data.message || 'Something went wrong.'
  } catch {
    return `Request failed with status ${response.status}.`
  }
}

const request = async (path, options = {}) => {
  const response = await fetch(buildUrl(path), options)

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export const resolveImageUrl = (imagePath) => {
  if (!imagePath) {
    return ''
  }

  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath
  }

  if (imagePath.startsWith('/uploads/')) {
    return buildUrl(imagePath)
  }

  const normalizedPath = imagePath.replace(/\\/g, '/')
  const uploadsIndex = normalizedPath.indexOf('uploads/')

  if (uploadsIndex >= 0) {
    return buildUrl(`/${normalizedPath.slice(uploadsIndex)}`)
  }

  return buildUrl(`/${normalizedPath.replace(/^\/+/, '')}`)
}

export const registerUser = (payload) =>
  request('/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

export const loginUser = (payload) =>
  request('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

export const getMyProfile = (token) =>
  request('/users/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

export const getWardrobeItems = (token) =>
  request('/wardrobe/items', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

export const getWardrobeStats = (token) =>
  request('/wardrobe/stats', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

export const createWardrobeItem = (token, payload) =>
  request('/wardrobe/items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

export const uploadWardrobeItem = (token, payload) => {
  const formData = new FormData()

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      formData.append(key, value)
    }
  })

  return request('/upload/wardrobe-item', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
}

export const deleteWardrobeItem = (token, itemId) =>
  request(`/wardrobe/items/${itemId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

export const toggleFavoriteItem = (token, itemId) =>
  request(`/wardrobe/items/${itemId}/favorite`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

export const markWardrobeItemWorn = (token, itemId) =>
  request(`/wardrobe/items/${itemId}/wear`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

export const getRecommendations = (token, params = {}) => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, value)
    }
  })

  const query = searchParams.toString()

  return request(`/recommendations/outfits${query ? `?${query}` : ''}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const submitRecommendationFeedback = (token, payload) =>
  request('/recommendations/feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
