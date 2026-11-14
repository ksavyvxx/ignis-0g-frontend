import type { Finding, Relation, Source, Study } from "@/domain/types"

export class ApiError extends Error {
  constructor(readonly status: number, message: string) {
    super(message)
    this.name = "ApiError"
  }
}

interface ApiClient {
  listStudies(signal?: AbortSignal): Promise<Study[]>
  getStudy(id: string, signal?: AbortSignal): Promise<Study>
  listFindings(studyId: string, signal?: AbortSignal): Promise<Finding[]>
  listSources(studyId: string, signal?: AbortSignal): Promise<Source[]>
  listRelations(studyId: string, signal?: AbortSignal): Promise<Relation[]>
}

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/+$/, "")
const useMocks = import.meta.env.VITE_USE_MOCKS !== "false"

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  const url = `${apiBaseUrl}${path}`
  const init = { signal, headers: { Accept: "application/json" } }
  const response = useMocks
    ? await (await import("@/mocks/transport")).mockFetch(path, signal)
    : await fetch(url, init)

  if (!response.ok) {
    throw new ApiError(response.status, `GET ${path}: HTTP ${response.status}`)
  }

  return response.json() as Promise<T>
}

const studyPath = (id: string) => `/studies/${encodeURIComponent(id)}`

export const api: ApiClient = {
  listStudies: (signal) => request("/studies", signal),
  getStudy: (id, signal) => request(studyPath(id), signal),
  listFindings: (id, signal) => request(`${studyPath(id)}/findings`, signal),
  listSources: (id, signal) => request(`${studyPath(id)}/sources`, signal),
  listRelations: (id, signal) => request(`${studyPath(id)}/relations`, signal),
}
