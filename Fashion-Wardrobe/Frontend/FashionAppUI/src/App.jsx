import { useEffect, useState } from 'react'
import Login from './components/Login'
import Warbdobe from './components/Warbdobe'
import Recommendation from './components/Recommendation'
import {
  createWardrobeItem,
  getMyProfile,
  getRecommendations,
  getWardrobeItems,
  getWardrobeStats,
  loginUser,
  markWardrobeItemWorn,
  registerUser,
  submitRecommendationFeedback,
  uploadWardrobeItem,
  deleteWardrobeItem,
  toggleFavoriteItem,
} from './lib/api'

const TOKEN_KEY = 'fashion-wardrobe-token'
const SAVED_LOOKS_KEY = 'fashion-wardrobe-saved-looks'

const readSavedLooks = () => {
  try {
    const rawValue = localStorage.getItem(SAVED_LOOKS_KEY)
    return rawValue ? JSON.parse(rawValue) : []
  } catch {
    return []
  }
}

const App = () => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '')
  const [user, setUser] = useState(null)
  const [wardrobeItems, setWardrobeItems] = useState([])
  const [wardrobeStats, setWardrobeStats] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [savedLooks, setSavedLooks] = useState(readSavedLooks)
  const [currentView, setCurrentView] = useState('wardrobe')
  const [authLoading, setAuthLoading] = useState(false)
  const [appLoading, setAppLoading] = useState(false)
  const [recommendationLoading, setRecommendationLoading] = useState(false)
  const [error, setError] = useState('')

  const hydrateApp = async (activeToken) => {
    setAppLoading(true)
    setError('')

    try {
      const [profile, items, stats] = await Promise.all([
        getMyProfile(activeToken),
        getWardrobeItems(activeToken),
        getWardrobeStats(activeToken),
      ])

      setUser(profile)
      setWardrobeItems(items)
      setWardrobeStats(stats)
    } catch (err) {
      localStorage.removeItem(TOKEN_KEY)
      setToken('')
      setUser(null)
      setWardrobeItems([])
      setWardrobeStats(null)
      setRecommendations([])
      setError(err.message)
    } finally {
      setAppLoading(false)
    }
  }

  useEffect(() => {
    if (!token) {
      return
    }

    const timeoutId = setTimeout(() => {
      hydrateApp(token)
    }, 0)

    return () => clearTimeout(timeoutId)
  }, [token])

  useEffect(() => {
    localStorage.setItem(SAVED_LOOKS_KEY, JSON.stringify(savedLooks))
  }, [savedLooks])

  const handleAuthSuccess = async (nextToken) => {
    localStorage.setItem(TOKEN_KEY, nextToken)
    setToken(nextToken)
  }

  const handleRegister = async (formValues) => {
    setAuthLoading(true)
    setError('')

    try {
      await registerUser(formValues)
      const authData = await loginUser({
        email: formValues.email,
        password: formValues.password,
      })
      await handleAuthSuccess(authData.access_token)
    } catch (err) {
      setError(err.message)
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogin = async (formValues) => {
    setAuthLoading(true)
    setError('')

    try {
      const authData = await loginUser(formValues)
      await handleAuthSuccess(authData.access_token)
    } catch (err) {
      setError(err.message)
    } finally {
      setAuthLoading(false)
    }
  }

  const refreshWardrobe = async () => {
    if (!token) {
      return
    }

    const [items, stats] = await Promise.all([
      getWardrobeItems(token),
      getWardrobeStats(token),
    ])

    setWardrobeItems(items)
    setWardrobeStats(stats)
  }

  const handleUploadItem = async (itemPayload) => {
    setError('')

    if (itemPayload.file) {
      await uploadWardrobeItem(token, itemPayload)
    } else {
      await createWardrobeItem(token, {
        ...itemPayload,
        image_path: '',
      })
    }

    await refreshWardrobe()
  }

  const handleDeleteItem = async (itemId) => {
    setError('')
    await deleteWardrobeItem(token, itemId)
    await refreshWardrobe()
  }

  const handleToggleFavorite = async (itemId) => {
    setError('')
    await toggleFavoriteItem(token, itemId)
    await refreshWardrobe()
  }

  const handleMarkItemWorn = async (itemId) => {
    setError('')
    await markWardrobeItemWorn(token, itemId)
    await refreshWardrobe()
  }

  const handleSaveLook = ({ itemIds, title, date, notes = '', source = 'planner', occasion = '', season = '' }) => {
    const selectedItems = wardrobeItems.filter((item) => itemIds.includes(item.id))

    if (selectedItems.length === 0) {
      return
    }

    const fallbackTitle = selectedItems
      .map((item) => item.subcategory || item.category)
      .slice(0, 3)
      .join(' + ')

    setSavedLooks((currentLooks) => [
      {
        id: Date.now(),
        title: title?.trim() || fallbackTitle || 'Saved look',
        date: date || '',
        notes: notes.trim(),
        source,
        occasion,
        season,
        itemIds,
      },
      ...currentLooks,
    ])
  }

  const handleDeleteSavedLook = (lookId) => {
    setSavedLooks((currentLooks) => currentLooks.filter((look) => look.id !== lookId))
  }

  const handleLoadRecommendations = async (filters) => {
    setRecommendationLoading(true)
    setError('')

    try {
      const response = await getRecommendations(token, filters)
      setRecommendations(response.recommendations || [])
      setCurrentView('recommendations')
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setRecommendationLoading(false)
    }
  }

  const handleFeedback = async (recommendationId, payload) => {
    setError('')
    await submitRecommendationFeedback(token, {
      recommendation_id: recommendationId,
      ...payload,
    })
  }

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setToken('')
    setUser(null)
    setWardrobeItems([])
    setWardrobeStats(null)
    setRecommendations([])
    setCurrentView('wardrobe')
    setError('')
  }

  if (!token || !user) {
    return (
      <Login
        loading={authLoading || appLoading}
        error={error}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    )
  }

  return currentView === 'wardrobe' ? (
    <Warbdobe
      currentUser={user}
      items={wardrobeItems}
      stats={wardrobeStats}
      savedLooks={savedLooks}
      loading={appLoading}
      error={error}
      onAddItem={handleUploadItem}
      onDeleteItem={handleDeleteItem}
      onDeleteSavedLook={handleDeleteSavedLook}
      onToggleFavorite={handleToggleFavorite}
      onMarkItemWorn={handleMarkItemWorn}
      onGenerateRecommendations={handleLoadRecommendations}
      onSaveLook={handleSaveLook}
      onLogout={handleLogout}
    />
  ) : (
    <Recommendation
      currentUser={user}
      items={wardrobeItems}
      recommendations={recommendations}
      savedLooks={savedLooks}
      loading={recommendationLoading}
      error={error}
      onBack={() => setCurrentView('wardrobe')}
      onRefresh={handleLoadRecommendations}
      onFeedback={handleFeedback}
      onSaveLook={handleSaveLook}
      onLogout={handleLogout}
    />
  )
}

export default App
