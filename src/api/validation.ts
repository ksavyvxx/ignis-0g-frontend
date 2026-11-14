import type { Finding, Relation, Source, Study } from "@/domain/types"

type Validator<T> = (value: unknown) => value is T

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isId(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0
}

export function isStudy(value: unknown): value is Study {
  return isRecord(value) && isId(value.id) && isId(value.title) &&
    typeof value.summary === "string" &&
    typeof value.createdAt === "string" && Number.isFinite(Date.parse(value.createdAt)) &&
    (value.status === "draft" || value.status === "in_progress" || value.status === "completed")
}

export function isFinding(value: unknown): value is Finding {
  return isRecord(value) && isId(value.id) && isId(value.studyId) && isId(value.title) &&
    typeof value.summary === "string" && Array.isArray(value.sourceIds) && value.sourceIds.every(isId)
}

function isWebUrl(value: unknown): value is string {
  if (typeof value !== "string") return false
  try {
    const url = new URL(value)
    return (url.protocol === "https:" || url.protocol === "http:") && !url.username && !url.password
  } catch {
    return false
  }
}

export function isSource(value: unknown): value is Source {
  return isRecord(value) && isId(value.id) && isId(value.studyId) && isId(value.title) &&
    (value.kind === "article" || value.kind === "interview" || value.kind === "document") &&
    (value.url === null || isWebUrl(value.url))
}

export function isRelation(value: unknown): value is Relation {
  return isRecord(value) && isId(value.id) && isId(value.studyId) &&
    isId(value.fromFindingId) && isId(value.toFindingId) &&
    (value.kind === "supports" || value.kind === "contradicts" || value.kind === "related")
}

export function isCollection<T extends { id: string; studyId?: string }>(
  validate: Validator<T>, studyId?: string,
): Validator<T[]> {
  return (value): value is T[] => {
    if (!Array.isArray(value) || !value.every(validate)) return false
    return new Set(value.map(({ id }) => id)).size === value.length &&
      (studyId === undefined || value.every((item) => item.studyId === studyId))
  }
}
