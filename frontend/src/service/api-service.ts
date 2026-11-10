class APIService {
  private readonly baseURL: string

  constructor(baseURL = '/api') {
    this.baseURL = baseURL
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${path.startsWith('/') ? path : `/${path}`}`
    const headers = new Headers(options.headers)

    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        const error = new Error(`HTTP error! status: ${response.status}`)
        console.error(error)
        throw error
      }

      if (response.status === 204) {
        console.info(`received response status: ${response.status} , data: null`)
        return undefined as T
      }

      const text = await response.text()
      const data: T = text ? (JSON.parse(text) as T) : (undefined as T)
      console.info(`received response status: ${response.status} , data: ${text}`)
      return data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  public async get<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' })
  }

  public async post<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  }

  public async put<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  }

  public async delete<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' })
  }
}

export default new APIService()
