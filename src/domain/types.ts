export interface Study {
  id: string
  title: string
  summary: string
  status: "draft" | "in_progress" | "completed"
  createdAt: string
}

export interface Finding {
  id: string
  studyId: Study["id"]
  title: string
  summary: string
  sourceIds: Source["id"][]
}

export interface Source {
  id: string
  studyId: Study["id"]
  title: string
  kind: "article" | "interview" | "document"
  url: string | null
}

export interface Relation {
  id: string
  studyId: Study["id"]
  fromFindingId: Finding["id"]
  toFindingId: Finding["id"]
  kind: "supports" | "contradicts" | "related"
}
