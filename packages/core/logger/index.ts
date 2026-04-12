// ─── Structured Logger ────────────────────────────────────────────────────────
// Works in Node.js, Edge, and browser.
// Swap ConsoleTransport for Axiom / Logtail / DataDog in production.

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogContext {
  userId?: string
  requestId?: string
  sessionId?: string
  action?: string
  module?: string
  traceId?: string
  [key: string]: unknown
}

export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: LogContext
  error?: {
    message: string
    stack?: string
    code?: string
    name?: string
  }
}

export interface LogTransport {
  write(entry: LogEntry): void
}

// ─── Console Transport ────────────────────────────────────────────────────────

class ConsoleTransport implements LogTransport {
  write(entry: LogEntry): void {
    const line = JSON.stringify(entry)
    if (entry.level === 'error') {
      console.error(line)
    } else if (entry.level === 'warn') {
      console.warn(line)
    } else {
      console.log(line)
    }
  }
}

// ─── Logger ───────────────────────────────────────────────────────────────────

class Logger {
  constructor(
    private transport: LogTransport = new ConsoleTransport(),
    private ctx: LogContext = {},
  ) {}

  /** Create a child logger that inherits and extends context */
  child(context: LogContext): Logger {
    return new Logger(this.transport, { ...this.ctx, ...context })
  }

  private write(level: LogLevel, message: string, context?: LogContext, error?: unknown): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: context ? { ...this.ctx, ...context } : this.ctx,
    }
    if (error) {
      if (error instanceof Error) {
        entry.error = {
          name: error.name,
          message: error.message,
          stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
          code: (error as NodeJS.ErrnoException).code,
        }
      } else {
        entry.error = { name: 'Unknown', message: String(error) }
      }
    }
    this.transport.write(entry)
  }

  debug(message: string, context?: LogContext): void {
    if (process.env.NODE_ENV !== 'production') {
      this.write('debug', message, context)
    }
  }

  info(message: string, context?: LogContext): void {
    this.write('info', message, context)
  }

  warn(message: string, context?: LogContext, error?: unknown): void {
    this.write('warn', message, context, error)
  }

  error(message: string, error?: unknown, context?: LogContext): void {
    this.write('error', message, context, error)
  }
}

export const logger = new Logger()

export function createLogger(context: LogContext): Logger {
  return logger.child(context)
}

export { Logger }
