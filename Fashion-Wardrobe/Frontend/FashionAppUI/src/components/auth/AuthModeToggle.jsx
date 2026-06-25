import React from 'react'

void React

const AuthModeToggle = ({ isRegisterMode, onSelectRegister, onSelectLogin }) => (
  <div className="flex bg-[#e8ccd5] p-1 rounded-full mb-8">
    <button
      type="button"
      onClick={onSelectRegister}
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
      onClick={onSelectLogin}
      className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-all ${
        !isRegisterMode
          ? 'bg-gradient-to-r from-[#d9a5b3] to-[#e8b4c0] text-white shadow-md'
          : 'text-[#a17a8a]'
      }`}
    >
      Sign In
    </button>
  </div>
)

export default AuthModeToggle
