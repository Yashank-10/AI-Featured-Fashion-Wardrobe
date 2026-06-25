import React from 'react'
import { Sparkles } from 'lucide-react'

void React

const AuthShell = ({ children }) => (
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

    <div className="bg-[#fdf2f5] px-8 pb-10">{children}</div>
  </div>
)

export default AuthShell
