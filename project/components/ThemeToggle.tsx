"use client"

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from './ThemeProvider'

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const isDark = mounted ? resolvedTheme === 'dark' : false

  function onClick() {
    const next = isDark ? 'light' : 'dark'
    setTheme(next)
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="ml-4 inline-flex items-center gap-2 rounded-md px-3 py-1 text-sm font-medium bordered cursor-pointer"
      style={{ backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--card-foreground))' }}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
