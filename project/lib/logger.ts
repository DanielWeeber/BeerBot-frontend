type Level = 'debug' | 'info' | 'warn' | 'error'

const LEVELS: Record<Level, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
}

// Default level: info in production, debug otherwise
const env = (typeof process !== 'undefined' && process.env && process.env.NODE_ENV) || 'development'
const defaultLevel: Level = env === 'production' ? 'info' : 'debug'
let currentLevel: Level = defaultLevel

function format(level: Level, msg: string, meta?: Record<string, unknown>) {
  const ts = new Date().toISOString()
  const base = `[${ts}] [${level.toUpperCase()}] ${msg}`
  return meta ? `${base} ${JSON.stringify(meta)}` : base
}

function shouldLog(level: Level) {
  return LEVELS[level] >= LEVELS[currentLevel]
}

export const logger = {
  setLevel(level: Level) { currentLevel = level },
  debug(msg: string, meta?: Record<string, unknown>) { if (shouldLog('debug')) console.debug(format('debug', msg, meta)) },
  info(msg: string, meta?: Record<string, unknown>) { if (shouldLog('info')) console.info(format('info', msg, meta)) },
  warn(msg: string, meta?: Record<string, unknown>) { if (shouldLog('warn')) console.warn(format('warn', msg, meta)) },
  error(msg: string, meta?: Record<string, unknown>) { if (shouldLog('error')) console.error(format('error', msg, meta)) },
}

export async function withTiming<T>(label: string, fn: () => Promise<T>, meta?: Record<string, unknown>): Promise<T> {
  const start = performance && performance.now ? performance.now() : Date.now()
  logger.debug(`${label}: start`, meta)
  try {
    const result = await fn()
    const end = performance && performance.now ? performance.now() : Date.now()
    logger.info(`${label}: ok`, { ...(meta || {}), duration_ms: Math.round(end - start) })
    return result
  } catch (err) {
    const end = performance && performance.now ? performance.now() : Date.now()
    logger.error(`${label}: failed`, { ...(meta || {}), duration_ms: Math.round(end - start), error: (err as Error)?.message })
    throw err
  }
}
