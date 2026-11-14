import { findings, relations, sources, studies } from "./data"

const collections = { findings, sources, relations }

export async function mockFetch(path: string, signal?: AbortSignal): Promise<Response> {
  signal?.throwIfAborted()
  if (path === "/studies") return Response.json(studies)

  const match = /^\/studies\/([^/]+)(?:\/(findings|sources|relations))?$/.exec(path)
  if (!match) return Response.json({ message: "Route not found" }, { status: 404 })

  const [, encodedId, collection] = match
  const study = studies.find(({ id }) => id === decodeURIComponent(encodedId))
  if (!study) return Response.json({ message: "Study not found" }, { status: 404 })
  if (!collection) return Response.json(study)

  const records = collections[collection as keyof typeof collections]
  return Response.json(records.filter(({ studyId }) => studyId === study.id))
}
