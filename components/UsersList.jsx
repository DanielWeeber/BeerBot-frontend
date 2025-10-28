"use client"
import React, { useEffect, useState, useRef } from 'react'

export default function UsersList({ title, users, range }) {
  const [stats, setStats] = useState({})
  const [names, setNames] = useState({})
  const [avatars, setAvatars] = useState({})
  const lastArgsRef = useRef(null)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])

  // Fetch stats for each user
  useEffect(() => {
    const usersKey = JSON.stringify(users || [])
    const rangeKey = `${range?.start ?? ''}_${range?.end ?? ''}`
    const argsKey = `${title}|${usersKey}|${rangeKey}`
    if (lastArgsRef.current === argsKey) return
    lastArgsRef.current = argsKey

    let cancelled = false
    const timer = setTimeout(() => {
      async function loadStats() {
        const out = {}
        const path = title === 'Givers' ? '/api/proxy/given' : '/api/proxy/received'
        let params = new URLSearchParams()
        if (range?.start && range?.end) {
          if (range.start === range.end) {
            params.set('day', range.start)
          } else {
            params.set('start', range.start)
            params.set('end', range.end)
          }
        }
        const concurrency = 5
        let idx = 0
        async function worker() {
          while (idx < users.length && !cancelled) {
            const i = idx++
            const u = users[i]
            const q = new URLSearchParams()
            q.set('user', u)
            if (params.has('day')) q.set('day', params.get('day'))
            if (params.has('start')) q.set('start', params.get('start'))
            if (params.has('end')) q.set('end', params.get('end'))
            try {
              const resp = await fetch(`${path}?${q.toString()}`)
              if (!resp.ok) {
                out[u] = 0
                continue
              }
              const j = await resp.json()
              out[u] = title === 'Givers' ? j.given : j.received
            } catch (err) {
              out[u] = 0
            }
          }
        }
        const workers = []
        for (let i = 0; i < concurrency; i++) workers.push(worker())
        await Promise.all(workers)
        if (cancelled || !mounted.current) return
        const prev = JSON.stringify(stats)
        const next = JSON.stringify(out)
        if (prev !== next && mounted.current) setStats(out)
      }
      if (users && users.length) loadStats()
      else setStats({})
    }, 200)
    return () => { cancelled = true; clearTimeout(timer) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, range.start, range.end, title])

  // Fetch real names and avatars for each user
  useEffect(() => {
    let cancelled = false
    async function fetchNamesAvatars() {
      const namesOut = {}
      const avatarsOut = {}
      const concurrency = 5
      let idx = 0
      async function worker() {
        while (idx < users.length && !cancelled) {
          const i = idx++
          const u = users[i]
          try {
            const resp = await fetch(`/api/proxy/user?user=${encodeURIComponent(u)}`)
            if (!resp.ok) {
              namesOut[u] = u
              avatarsOut[u] = null
              continue
            }
            const j = await resp.json()
            namesOut[u] = j.real_name || u
            avatarsOut[u] = j.profile_image || null
          } catch (err) {
            namesOut[u] = u
            avatarsOut[u] = null
          }
        }
      }
      const workers = []
      for (let i = 0; i < concurrency; i++) workers.push(worker())
      await Promise.all(workers)
      if (!cancelled && mounted.current) {
        setNames(namesOut)
        setAvatars(avatarsOut)
      }
    }
    if (users && users.length) fetchNamesAvatars()
    else {
      setNames({})
      setAvatars({})
    }
    return () => { cancelled = true }
  }, [users])

  // Sort users by count (desc), filter out zero counts, show only top 100
  const sorted = (users ?? [])
    .map((u) => ({ user: u, count: stats[u] ?? 0 }))
    .filter((u) => u.count > 0) // Only show users with at least 1 beer
    .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
    .slice(0, 100)
  const total = sorted.reduce((sum, u) => sum + (typeof u.count === 'number' ? u.count : 0), 0)

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-indigo-50 p-5 rounded-2xl shadow-lg min-h-[400px] border border-indigo-100">
      <h2 className="text-xl font-bold mb-2 text-indigo-700 flex items-center gap-2">
        {title === 'Givers' ? '🙌' : '🎉'} {title}
      </h2>
      <div className="mb-3 text-sm text-gray-500">Total <span className="font-bold text-yellow-600">🍺 {total}</span></div>
      {sorted.length === 0 ? (
        <div className="text-gray-400 text-sm">No data</div>
      ) : (
        <ul className="divide-y divide-indigo-100">
          {sorted.map(({ user, count }, i) => (
            <li
              key={user}
              className="flex items-center justify-between py-2 group hover:bg-indigo-50 transition rounded-lg px-2"
              style={{ animation: `fadein 0.3s ${i * 0.01}s both` }}
            >
              <div className="flex items-center gap-3">
                {avatars[user] ? (
                  <img
                    src={avatars[user]}
                    alt={names[user] || user}
                    className="w-8 h-8 rounded-full object-cover shadow-sm border border-indigo-200"
                  />
                ) : (
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold text-lg shadow-sm">
                    {names[user]?.[0]?.toUpperCase() || user[0]}
                  </span>
                )}
                <span className="text-base text-gray-800 font-medium">{names[user] || user}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 text-lg">🍺</span>
                <span className="text-base font-bold text-indigo-700">{count}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
