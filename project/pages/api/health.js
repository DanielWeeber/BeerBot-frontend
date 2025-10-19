export default async function handler(req, res) {
  const backend = process.env.NEXT_PUBLIC_BACKEND_BASE || 'http://localhost:8080'
  try {
    const resp = await fetch(`${backend}/healthz`, { method: 'GET' })
    if (!resp.ok) return res.status(502).json({ status: 'unhealthy', backend: resp.status })
    return res.status(200).json({ status: 'ok', backend: backend })
  } catch (err) {
    return res.status(502).json({ status: 'unreachable', error: err.message })
  }
}
