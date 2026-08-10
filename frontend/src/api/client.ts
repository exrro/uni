/** Lightweight fetch wrapper with JWT handling. */

/**
 * Same-origin API calls: the app talks to its own origin and a reverse proxy
 * (Vite in dev, Nginx in production) forwards the backend paths to FastAPI.
 * This means the browser only ever uses ONE origin, so no CORS issues and no
 * backend URL to configure — it works on localhost AND on a phone on the LAN.
 */
export const API_BASE: string = ''

export interface ApiError {
  status: number
  detail: string
}

async function handle<T>(res: Response): Promise<T> {
  let body: any = null
  try {
    body = await res.json()
  } catch {
    body = null
  }
  if (!res.ok) {
    const detail = body?.detail
    const msg =
      typeof detail === 'string'
        ? detail
        : Array.isArray(detail)
          ? detail.map((d: any) => d.msg).join('، ')
          : 'خطایی رخ داد'
    throw Object.assign(new Error(msg), { status: res.status })
  }
  return body as T
}

function headers(extra: Record<string, string> = {}): Record<string, string> {
  const h: Record<string, string> = { 'Content-Type': 'application/json', ...extra }
  const token = localStorage.getItem('token')
  if (token) h['Authorization'] = `Bearer ${token}`
  return h
}

export const api = {
  async get<T>(url: string): Promise<T> {
    const res = await fetch(`${API_BASE}${url}`, { headers: headers() })
    return handle<T>(res)
  },
  async post<T>(url: string, body?: unknown): Promise<T> {
    const res = await fetch(`${API_BASE}${url}`, {
      method: 'POST',
      headers: headers(),
      body: body === undefined ? undefined : JSON.stringify(body),
    })
    return handle<T>(res)
  },
  async put<T>(url: string, body?: unknown): Promise<T> {
    const res = await fetch(`${API_BASE}${url}`, {
      method: 'PUT',
      headers: headers(),
      body: body === undefined ? undefined : JSON.stringify(body),
    })
    return handle<T>(res)
  },
  async delete<T>(url: string): Promise<T> {
    const res = await fetch(`${API_BASE}${url}`, { method: 'DELETE', headers: headers() })
    return handle<T>(res)
  },
}

export const API_BASE_URL = API_BASE
