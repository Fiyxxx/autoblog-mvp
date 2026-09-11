interface ErrorResponse {
  error?: unknown
}

export async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init)

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`

    try {
      const body = (await response.json()) as ErrorResponse
      if (typeof body.error === 'string') message = body.error
    } catch {
      // Keep the status-based fallback when the response has no JSON body.
    }

    throw new Error(message)
  }

  return response.json() as Promise<T>
}
