import React, { useState } from 'react'
import { ArrowRight, Lock, Mail, UserRound } from 'lucide-react'
import AuthField from './AuthField'
import AuthModeToggle from './AuthModeToggle'
import AuthShell from './AuthShell'
import PagePattern from '../shared/PagePattern'

void React

const initialLoginState = {
  email: '',
  password: '',
}

const initialRegisterState = {
  full_name: '',
  username: '',
  email: '',
  password: '',
}

const LoginScreen = ({ loading, error, onLogin, onRegister }) => {
  const [mode, setMode] = useState('register')
  const [loginValues, setLoginValues] = useState(initialLoginState)
  const [registerValues, setRegisterValues] = useState(initialRegisterState)

  const updateLoginField = (field, value) => {
    setLoginValues((current) => ({ ...current, [field]: value }))
  }

  const updateRegisterField = (field, value) => {
    setRegisterValues((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (mode === 'login') {
      await onLogin(loginValues)
      return
    }

    await onRegister(registerValues)
  }

  const isRegisterMode = mode === 'register'

  return (
    <div className="min-h-screen w-full bg-[#fdf2f5] flex items-center justify-center p-4 relative font-sans">
      <PagePattern />

      <AuthShell>
        <AuthModeToggle
          isRegisterMode={isRegisterMode}
          onSelectRegister={() => setMode('register')}
          onSelectLogin={() => setMode('login')}
        />

        <p className="text-center text-[#a17a8a] font-serif italic text-lg mb-8">
          {isRegisterMode ? "Let's build your style profile" : 'Welcome back to your wardrobe'}
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {isRegisterMode ? (
            <>
              <AuthField icon={UserRound} label="Full Name">
                <input
                  type="text"
                  value={registerValues.full_name}
                  onChange={(event) => updateRegisterField('full_name', event.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-5 py-4 rounded-2xl border border-[#e8b4c0] bg-[#fff5f7] focus:outline-none focus:ring-2 focus:ring-[#d9a5b3] placeholder:text-[#a17a8a]/40 text-[#a17a8a]"
                />
              </AuthField>

              <AuthField icon={UserRound} label="Username">
                <input
                  type="text"
                  value={registerValues.username}
                  onChange={(event) => updateRegisterField('username', event.target.value)}
                  placeholder="Choose a username"
                  className="w-full px-5 py-4 rounded-2xl border border-[#e8b4c0] bg-[#fff5f7] focus:outline-none focus:ring-2 focus:ring-[#d9a5b3] placeholder:text-[#a17a8a]/40 text-[#a17a8a]"
                  required
                />
              </AuthField>
            </>
          ) : null}

          <AuthField icon={Mail} label="Email">
            <input
              type="email"
              value={isRegisterMode ? registerValues.email : loginValues.email}
              onChange={(event) =>
                isRegisterMode
                  ? updateRegisterField('email', event.target.value)
                  : updateLoginField('email', event.target.value)
              }
              placeholder="you@example.com"
              className="w-full px-5 py-4 rounded-2xl border border-[#e8b4c0] bg-[#fff5f7] focus:outline-none focus:ring-2 focus:ring-[#d9a5b3] placeholder:text-[#a17a8a]/40 text-[#a17a8a]"
              required
            />
          </AuthField>

          <AuthField icon={Lock} label="Password">
            <input
              type="password"
              value={isRegisterMode ? registerValues.password : loginValues.password}
              onChange={(event) =>
                isRegisterMode
                  ? updateRegisterField('password', event.target.value)
                  : updateLoginField('password', event.target.value)
              }
              placeholder="At least 6 characters"
              className="w-full px-5 py-4 rounded-2xl border border-[#e8b4c0] bg-[#fff5f7] focus:outline-none focus:ring-2 focus:ring-[#d9a5b3] placeholder:text-[#a17a8a]/40 text-[#a17a8a] text-sm"
              required
            />
          </AuthField>

          {error ? (
            <div className="rounded-2xl border border-[#f0d5db] bg-white px-4 py-3 text-sm text-[#b85e74]">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-4 rounded-full bg-gradient-to-r from-[#e8b4c0] to-[#d9a5b3] text-white font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Please wait...' : isRegisterMode ? 'Create account' : 'Sign in'}
            <ArrowRight size={18} />
          </button>
        </form>
      </AuthShell>
    </div>
  )
}

export default LoginScreen
