export class ApiError extends Error {
  constructor(message, status = 500, data = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

const API_BASE = import.meta.env.VITE_API_URL ?? ''

export async function apiRequest(path, options = {}) {
  const { body, headers, ...rest } = options

  let response

  try {
    response = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      ...rest,
    })
  } catch {
    throw new ApiError('API indisponible. Verifiez que le serveur tourne.', 0)
  }

  const contentType = response.headers.get('content-type') ?? ''
  const data = contentType.includes('application/json')
    ? await response.json()
    : null

  if (!response.ok) {
    throw new ApiError(
      data?.error ?? 'La requete a echoue',
      response.status,
      data,
    )
  }

  return data
}
