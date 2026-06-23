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
  registerUser,
  submitRecommendationFeedback,
  uploadWardrobeItem,
  deleteWardrobeItem,
  toggleFavoriteItem,
} from './lib/api'

const TOKEN_KEY = 'fashion-wardrobe-token'

const App = () => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '')
  const [user, setUser] = useState(null)
  const [wardrobeItems, setWardrobeItems] = useState([])
  const [wardrobeStats, setWardrobeStats] = useState(null)
  const [recommendations, setRecommendations] = useState([])
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
      loading={appLoading}
      error={error}
      onAddItem={handleUploadItem}
      onDeleteItem={handleDeleteItem}
      onToggleFavorite={handleToggleFavorite}
      onGenerateRecommendations={handleLoadRecommendations}
      onLogout={handleLogout}
    />
  ) : (
    <Recommendation
      currentUser={user}
      items={wardrobeItems}
      recommendations={recommendations}
      loading={recommendationLoading}
      error={error}
      onBack={() => setCurrentView('wardrobe')}
      onRefresh={handleLoadRecommendations}
      onFeedback={handleFeedback}
      onLogout={handleLogout}
    />
  )
}

export default App
