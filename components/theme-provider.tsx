'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'
import { useTheme } from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      style={{
        padding: '0.5rem 1rem',
        borderRadius: '0.5rem',
        border: '1px solid #ccc',
        background: 'none',
        cursor: 'pointer',
        marginLeft: '1rem',
      }}
      aria-label="Cambiar tema"
    >
      {theme === 'dark' ? '☀️ Claro' : '🌙 Oscuro'}
    </button>
  );
}
