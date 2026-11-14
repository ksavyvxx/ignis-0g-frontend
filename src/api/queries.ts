import { queryOptions } from "@tanstack/react-query"
import { api } from "./client"

const studiesKey = ["studies"] as const
const studyKey = (id: string) => [...studiesKey, "detail", id] as const

export const studyQueries = {
  all: studiesKey,
  list: () => queryOptions({
    queryKey: [...studiesKey, "list"],
    queryFn: ({ signal }) => api.listStudies(signal),
  }),
  detail: (id: string) => queryOptions({
    queryKey: studyKey(id),
    queryFn: ({ signal }) => api.getStudy(id, signal),
  }),
  findings: (id: string) => queryOptions({
    queryKey: [...studyKey(id), "findings"],
    queryFn: ({ signal }) => api.listFindings(id, signal),
  }),
  sources: (id: string) => queryOptions({
    queryKey: [...studyKey(id), "sources"],
    queryFn: ({ signal }) => api.listSources(id, signal),
  }),
  relations: (id: string) => queryOptions({
    queryKey: [...studyKey(id), "relations"],
    queryFn: ({ signal }) => api.listRelations(id, signal),
  }),
}
