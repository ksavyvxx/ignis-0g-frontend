import type { Finding, Relation, Source } from "@/domain/types"
import { research } from "./catalog"

export const studies = research

export const sources: Source[] = research.map(({ id, title }) => ({
  id: `${id}-overview`, studyId: id, title: `${title} · обзор эксперимента`, kind: "document", url: null,
}))

export const findings: Finding[] = [
  { id: "flex-shape", studyId: "flex", title: "Пламя приобретает сферическую форму", summary: "При слабой естественной конвекции тепло и продукты горения распространяются более симметрично.", sourceIds: ["flex-overview"] },
  { id: "flex-air", studyId: "flex", title: "Условия затухания зависят от состава среды", summary: "Концентрация кислорода и размер капли влияют на порог устойчивого горения.", sourceIds: ["flex-overview"] },
  { id: "bass-air", studyId: "bass", title: "Поток воздуха влияет на форму пламени", summary: "Направление потока меняет условия горения вдоль поверхности материала.", sourceIds: ["bass-overview"] },
]

export const relations: Relation[] = [
  { id: "flex-shape-air", studyId: "flex", fromFindingId: "flex-shape", toFindingId: "flex-air", kind: "related" },
]
