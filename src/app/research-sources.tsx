import { ArrowUpRight } from "@/components/ui/icons"
import type { Source } from "@/domain/types"

const kinds = { article: "Статья", document: "Документ", interview: "Интервью" }

export function SourceList({ sources }: { sources: Source[] }) {
  if (!sources.length) return <p className="muted">Для этого эксперимента пока нет источников.</p>
  return <ul className="source-list">
    {sources.map((source) => <li key={source.id}>
      <span className="muted">{kinds[source.kind]}</span>
      {source.url
        ? <a href={source.url} target="_blank" rel="noreferrer">{source.title}<ArrowUpRight size={14} /></a>
        : <span>{source.title}</span>}
    </li>)}
  </ul>
}
