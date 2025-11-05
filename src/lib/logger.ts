/* Lightweight structured logger for server/runtime */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

function safeSerialize(value: unknown) {
  try {
    return JSON.parse(JSON.stringify(value, (_key, v) => {
      if (v instanceof Error) {
        return { name: v.name, message: v.message, stack: v.stack };
      }
      return v;
    }));
  } catch {
    return String(value);
  }
}

function baseFields() {
  return {
    env: process.env.NODE_ENV || 'development',
    service: 'tier-of-legends',
  } as const;
}

function log(level: LogLevel, message: string, meta?: Record<string, unknown>) {
  const p = {
    level,
    message,
    time: new Date().toISOString(),
    ...baseFields(),
    ...(meta ? safeSerialize(meta) : {}),
  };
  if (process.env.NODE_ENV === 'production') {
    // Single-line JSON for production log collectors
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(p));
  } else {
    // Pretty console in dev
    const fn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
    fn(`[${p.level}]`, p.message, p);
  }
}

export const logger = {
  debug: (message: string, meta?: Record<string, unknown>) => log('debug', message, meta),
  info: (message: string, meta?: Record<string, unknown>) => log('info', message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => log('warn', message, meta),
  error: (message: string, meta?: Record<string, unknown>) => log('error', message, meta),
};

export function errorMeta(err: unknown) {
  const e = err instanceof Error ? err : new Error(String(err));
  return { error: { name: e.name, message: e.message, stack: e.stack } } as const;
}
