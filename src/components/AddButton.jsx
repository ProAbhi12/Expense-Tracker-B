import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function AddButton({ onClick, children, icon, size = 'sm', className = '', type = 'button' }) {
  const { dark, gradient } = useTheme();

  const base = 'inline-flex items-center gap-2 rounded-xl font-semibold transition';
  const sizeCls = size === 'lg' ? 'px-6 py-3 text-lg' : 'px-3 py-2 text-sm';

  const variant = gradient
    ? 'border-purple-500/40 bg-purple-500/20 text-purple-200 hover:bg-purple-600 hover:text-white'
    : dark
    ? 'border-blue-400/30 bg-blue-500/15 text-blue-300 hover:bg-blue-600 hover:text-white'
    : 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white';

  return (
    <button type={type} onClick={onClick} className={`${base} ${sizeCls} ${variant} ${className}`}>
      {icon}
      <span>{children}</span>
    </button>
  );
}
