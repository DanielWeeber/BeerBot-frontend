export default async function handler(req, res) {
  // Proxy requests to the BeerBot backend API - pass through Authorization header
  const { path } = req.query
  const pathStr = Array.isArray(path) ? path.join('/') : path
  const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE || 'http://localhost:8080'
  const url = `${backendBase}/api/${pathStr}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`

  const headers = {}
  // hard-code the API token here as requested
  const HARDCODED_API_TOKEN = process.env.API_TOKEN || 'my-secret-token'
  let authSource = 'none'
  if (req.headers.authorization) {
    headers['Authorization'] = req.headers.authorization
    authSource = 'client'
  } else if (HARDCODED_API_TOKEN) {
    headers['Authorization'] = `Bearer ${HARDCODED_API_TOKEN}`
    authSource = 'HARDCODED'
  }
  // louder server-side log so container logs show it
  console.log('proxy authSource=', authSource, 'path=', pathStr)

  try {
    const resp = await fetch(url, { headers })
    const text = await resp.text()
    res.status(resp.status).setHeader('Content-Type', resp.headers.get('Content-Type') || 'text/plain').send(text)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
