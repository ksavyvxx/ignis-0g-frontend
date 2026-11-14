import { useState } from "react"
import {
  Bot,
  ChevronDown,
  ChevronRight,
  FlaskConical,
  Folder,
  GitCompare,
  Layers3,
  Reset,
  Rocket,
  Search,
  Settings,
  SlidersHorizontal,
} from "@/components/ui/icons"
import { getQuickMeta } from "@/domain/knowledge"
import type { StudySummary } from "@/domain/types"

export const sections = [
  { name: "Дашборд и рейтинг", icon: Layers3 },
  { name: "Исследования", icon: FlaskConical },
  { name: "Сравнение и установки", icon: GitCompare },
  { name: "Среды обитания", icon: Rocket },
  { name: "ИИ-ассистент", icon: Bot },
] as const

export type Section = (typeof sections)[number]["name"] | "Настройки"

interface SidebarProps {
  studies: StudySummary[]
  activeId?: string
  section: Section
  compareCount: number
  onSection: (section: Section) => void
  onStudy: (id: string) => void
  pending: boolean
  error: boolean
  retry: () => void
}

export function Sidebar({
  studies,
  activeId,
  section,
  compareCount,
  onSection,
  onStudy,
  pending,
  error,
  retry,
}: SidebarProps) {
  const [search, setSearch] = useState("")
  const [selectedTag, setSelectedTag] = useState<string>("")
  const [showFilters, setShowFilters] = useState(false)
  const [experimentsOpen, setExperimentsOpen] = useState(true)

  const allTags = Array.from(new Set(studies.flatMap((s) => s.tags))).sort()
  const term = search.trim().toLowerCase()

  const filtered = studies.filter((study) => {
    const meta = getQuickMeta(study.id)
    const hay = `${study.id} ${study.title} ${study.description} ${study.category} ${study.tags.join(" ")} ${meta?.facility ?? ""}`.toLowerCase()
    const matchesQuery = !term || hay.includes(term)
    const matchesTag = !selectedTag || study.tags.includes(selectedTag)
    return matchesQuery && matchesTag
  })

  const isFiltered = Boolean(term) || Boolean(selectedTag)

  function reset() {
    setSearch("")
    setSelectedTag("")
    setExperimentsOpen(true)
  }

  return (
    <aside className="sidebar" aria-label="Навигация и каталог">
      <nav aria-label="Разделы" className="side-nav">
        {sections.map(({ name, icon: Icon }) => (
          <button
            key={name}
            aria-current={section === name ? "page" : undefined}
            onClick={() => onSection(name)}
          >
            <Icon size={17} />
            <span>{name}</span>
            {name === "Сравнение и установки" && compareCount > 0 && (
              <span className="nav-count">{compareCount}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="library">
        <div className="search-row">
          <label className="search-field">
            <Search size={15} />
            <input
              type="search"
              placeholder="Поиск по каталогу"
              aria-label="Поиск исследований"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setExperimentsOpen(true)
              }}
            />
          </label>
          <button
            type="button"
            className="icon-button"
            aria-label="Фильтр по направлению"
            aria-expanded={showFilters}
            data-filter-active={Boolean(selectedTag)}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={16} />
          </button>
        </div>

        {showFilters && (
          <select
            aria-label="Направление безопасности"
            value={selectedTag}
            onChange={(event) => {
              setSelectedTag(event.target.value)
              setExperimentsOpen(true)
            }}
          >
            <option value="">Все направления</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        )}

        {isFiltered && (
          <button type="button" className="reset-filter" onClick={reset}>
            <Reset size={13} /> Сбросить фильтры
          </button>
        )}

        <button
          type="button"
          className="tree-parent"
          aria-expanded={experimentsOpen}
          aria-controls="experiments"
          onClick={() => setExperimentsOpen(!experimentsOpen)}
        >
          {experimentsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          <Folder size={16} /> NASA PSI ({filtered.length})
        </button>

        {experimentsOpen && (
          <div id="experiments" className="tree-children">
            {pending && <p role="status">Загрузка…</p>}
            {error && (
              <p role="alert">
                Ошибка загрузки.{" "}
                <button type="button" className="reset-filter" onClick={retry}>
                  Повторить
                </button>
              </p>
            )}
            {!pending && !error && filtered.length === 0 && <p role="status">Исследования не найдены</p>}
            {filtered.map((study) => {
              const meta = getQuickMeta(study.id)
              const shortTitle = study.title.split(" (")[0]
              return (
                <button
                  type="button"
                  className="tree-item"
                  key={study.id}
                  title={study.title}
                  aria-current={activeId === study.id && section === "Исследования" ? "true" : undefined}
                  onClick={() => onStudy(study.id)}
                >
                  <div className="tree-item-body">
                    <strong>{shortTitle}</strong>
                    <small>
                      {study.tags[0] ?? study.category}
                      {meta?.facility ? ` · ${meta.facility}` : ""}
                    </small>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <details className="navigation-group">
        <summary>Инструменты</summary>
        <nav className="side-nav" aria-label="Инструменты">
          <button
            type="button"
            aria-current={section === "Настройки" ? "page" : undefined}
            onClick={() => onSection("Настройки")}
          >
            <Settings size={17} /> Настройки
          </button>
        </nav>
      </details>
    </aside>
  )
}
