import { isCollection, isFinding, isRelation, isSource, isStudy } from "./validation"
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

async function request<T>(
  path: string, validate: (value: unknown) => value is T, signal?: AbortSignal,
): Promise<T> {
  const timeout = AbortSignal.timeout(12_000)
  const requestSignal = signal ? AbortSignal.any([signal, timeout]) : timeout

  try {
    requestSignal.throwIfAborted()
    const response = useMocks
      ? await (await import("@/mocks/transport")).mockFetch(path, requestSignal)
      : await fetch(`${apiBaseUrl}${path}`, {
        signal: requestSignal,
        headers: { Accept: "application/json" },
      })

    if (!response.ok) {
      throw new ApiError(response.status, `GET ${path}: HTTP ${response.status}`)
    }

    const data: unknown = await response.json()
    requestSignal.throwIfAborted()
    if (!validate(data)) throw new ApiError(422, `GET ${path}: unexpected response`)
    return data
  } catch (error) {
    signal?.throwIfAborted()
    if (timeout.aborted) throw new ApiError(408, `GET ${path}: timeout`)
    if (error instanceof SyntaxError) throw new ApiError(422, `GET ${path}: invalid JSON`)
    if (error instanceof TypeError) throw new ApiError(0, `GET ${path}: network failure`)
    throw error
  }
}

const studyPath = (id: string) => `/studies/${encodeURIComponent(id)}`

export const api: ApiClient = {
  listStudies: (signal) => request("/studies", isCollection(isStudy), signal),
  getStudy: (id, signal) => request(studyPath(id), (value): value is Study => isStudy(value) && value.id === id, signal),
  listFindings: (id, signal) => request(`${studyPath(id)}/findings`, isCollection(isFinding, id), signal),
  listSources: (id, signal) => request(`${studyPath(id)}/sources`, isCollection(isSource, id), signal),
  listRelations: (id, signal) => request(`${studyPath(id)}/relations`, isCollection(isRelation, id), signal),
}
