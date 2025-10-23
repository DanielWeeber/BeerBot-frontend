"use client"

import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from 'next-themes'
import type { ReactNode } from 'react'

export function ThemeProvider({ children }: { children?: ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  )
}

export function useTheme() {
  const { theme, resolvedTheme, setTheme, systemTheme, themes } = useNextTheme()
  function toggleTheme() {
    const current = (resolvedTheme || theme) as 'light' | 'dark' | undefined
    setTheme(current === 'dark' ? 'light' : 'dark')
  }
  return { theme, resolvedTheme, systemTheme, themes, setTheme, toggleTheme }
}
