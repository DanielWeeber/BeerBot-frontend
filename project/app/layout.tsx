
import './globals.css'
import Image from 'next/image'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '700'] })

export const metadata: Metadata = {
  title: 'BeerBot Frontend',
  description: 'List givers and recipients and stats',
  icons: { icon: '/favicon.svg' },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-[#f8f9fb] text-[#1a3a32] flex flex-col`}>
        <header className="w-full bg-white border-b border-[#e6eaea] shadow-sm sticky top-0 z-30">
          <div className="max-w-5xl mx-auto flex items-center gap-4 px-8 py-4">
            <Image src="/logo.svg" alt="BeerBot Logo" width={140} height={32} priority className="h-10 w-auto" />
            <span className="ml-auto text-base font-medium text-[#00c896] tracking-tight">Stats &amp; Leaderboard</span>
          </div>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center px-2">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 mt-10 mb-10 border border-[#e6eaea]">
            {children}
          </div>
        </main>
        <footer className="w-full text-center text-xs text-[#a0b8b0] py-6 border-t border-[#e6eaea] bg-white">
          <span>Made with <span className="text-[#00c896] font-bold">♥</span> by BeerBot Team</span>
        </footer>
      </body>
    </html>
  )
}
