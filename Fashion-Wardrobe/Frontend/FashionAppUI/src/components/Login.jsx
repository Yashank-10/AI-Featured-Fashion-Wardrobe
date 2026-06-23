import { useState } from 'react'
import { Mail, Lock, Sparkles, ArrowRight, UserRound } from 'lucide-react'

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

const Login = ({ loading, error, onLogin, onRegister }) => {
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
      <div
        className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden"
        style={{
          backgroundImage: 'radial-gradient(#a17a8a 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-[6px] border-[#a17a8a]/20 relative z-10">
        <div className="bg-[#a17a8a] pt-8 pb-12 px-6 text-center relative">
          <Sparkles className="absolute top-4 left-4 text-white/40" size={16} />
          <Sparkles className="absolute top-4 right-4 text-white/40" size={16} />
          <h1 className="text-white text-4xl font-serif italic tracking-wide">Clothy Buddy</h1>
          <p className="text-white/80 text-[10px] tracking-[0.2em] mt-2 font-medium">
            YOUR PERSONAL FASHION ASSISTANT
          </p>

          <div className="absolute -bottom-1 left-0 w-full overflow-hidden leading-[0]">
            <svg
              viewBox="0 0 500 50"
              preserveAspectRatio="none"
              className="relative block w-full h-10 fill-[#fdf2f5]"
            >
              <path d="M0,50 C150,0 350,0 500,50 L500,50 L0,50 Z" />
            </svg>
          </div>
        </div>

        <div className="bg-[#fdf2f5] px-8 pb-10">
          <div className="flex bg-[#e8ccd5] p-1 rounded-full mb-8">
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-all ${
                isRegisterMode
                  ? 'bg-gradient-to-r from-[#d9a5b3] to-[#e8b4c0] text-white shadow-md'
                  : 'text-[#a17a8a]'
              }`}
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-all ${
                !isRegisterMode
                  ? 'bg-gradient-to-r from-[#d9a5b3] to-[#e8b4c0] text-white shadow-md'
                  : 'text-[#a17a8a]'
              }`}
            >
              Sign In
            </button>
          </div>

          <p className="text-center text-[#a17a8a] font-serif italic text-lg mb-8">
            {isRegisterMode ? "Let's build your style profile" : 'Welcome back to your wardrobe'}
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {isRegisterMode ? (
              <>
                <label className="block">
                  <span className="flex items-center gap-2 text-[10px] font-black text-[#a17a8a] uppercase tracking-widest mb-2 px-1">
                    <UserRound size={12} strokeWidth={3} /> Full Name
                  </span>
                  <input
                    type="text"
                    value={registerValues.full_name}
                    onChange={(event) => updateRegisterField('full_name', event.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-5 py-4 rounded-2xl border border-[#e8b4c0] bg-[#fff5f7] focus:outline-none focus:ring-2 focus:ring-[#d9a5b3] placeholder:text-[#a17a8a]/40 text-[#a17a8a]"
                  />
                </label>

                <label className="block">
                  <span className="flex items-center gap-2 text-[10px] font-black text-[#a17a8a] uppercase tracking-widest mb-2 px-1">
                    <UserRound size={12} strokeWidth={3} /> Username
                  </span>
                  <input
                    type="text"
                    value={registerValues.username}
                    onChange={(event) => updateRegisterField('username', event.target.value)}
                    placeholder="Choose a username"
                    className="w-full px-5 py-4 rounded-2xl border border-[#e8b4c0] bg-[#fff5f7] focus:outline-none focus:ring-2 focus:ring-[#d9a5b3] placeholder:text-[#a17a8a]/40 text-[#a17a8a]"
                    required
                  />
                </label>
              </>
            ) : null}

            <label className="block">
              <span className="flex items-center gap-2 text-[10px] font-black text-[#a17a8a] uppercase tracking-widest mb-2 px-1">
                <Mail size={12} strokeWidth={3} /> Email
              </span>
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
            </label>

            <label className="block">
              <span className="flex items-center gap-2 text-[10px] font-black text-[#a17a8a] uppercase tracking-widest mb-2 px-1">
                <Lock size={12} strokeWidth={3} /> Password
              </span>
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
            </label>

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
        </div>
      </div>
    </div>
  )
}

export default Login
