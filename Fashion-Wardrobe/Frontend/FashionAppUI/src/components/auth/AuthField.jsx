import React from 'react'

void React

const AuthField = ({ icon: Icon, label, children }) => (
  <label className="block">
    <span className="flex items-center gap-2 text-[10px] font-black text-[#a17a8a] uppercase tracking-widest mb-2 px-1">
      <Icon size={12} strokeWidth={3} /> {label}
    </span>
    {children}
  </label>
)

export default AuthField
