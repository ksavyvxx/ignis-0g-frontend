import { useState } from "react"
import {
  Bot,
  ChevronDown,
  ChevronRight,
  FlaskConical,
  GitCompare,
  Layers3,
  Reset,
  Rocket,
  Search,
  Settings,
  SlidersHorizontal,
} from "@/components/ui/icons"
import { useMocks } from "@/api/client"
import { getQuickMeta } from "@/domain/knowledge"
import type { StudySummary } from "@/domain/types"

export const sections = [
  { name: "Дашборд и рейтинг", label: "Главная", icon: Layers3 },
  { name: "Исследования", label: "Исследования", icon: FlaskConical },
  { name: "Сравнение и установки", label: "Сравнение", icon: GitCompare },
  { name: "Среды обитания", label: "Среды О₂", icon: Rocket },
] as const

export type Section = (typeof sections)[number]["name"] | "ИИ-ассистент" | "Настройки"

interface SidebarProps {
  studies: StudySummary[]
  activeId?: string
  section: Section
  compareCount: number
  onSection: (section: Section) => void
  onStudy: (id: string) => void
  onOpenSearch: () => void
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
  onOpenSearch,
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
      <div className="sidebar-brand-row">
        <a className="workspace-title" href="/">
          <span className="brand-square">0G</span>
          <span>IGNIS</span>
        </a>
        <span className="brand-sub">NASA PSI</span>
      </div>

      <button type="button" className="sidebar-primary-cta" onClick={onOpenSearch}>
        <Search size={16} />
        <span>Быстрый поиск</span>
        <kbd>Ctrl K</kbd>
      </button>

      <div className="sidebar-quick-pair">
        <button type="button" onClick={() => onSection("Сравнение и установки")}>
          <GitCompare size={15} />
          <span>Сравнить{compareCount ? ` (${compareCount})` : ""}</span>
        </button>
        <button type="button" onClick={() => onSection("Среды обитания")}>
          <Rocket size={15} />
          <span>Среды О₂</span>
        </button>
      </div>

      <nav aria-label="Разделы" className="side-nav">
        {sections.map(({ name, label, icon: Icon }) => (
          <button
            key={name}
            type="button"
            aria-current={section === name ? "page" : undefined}
            onClick={() => onSection(name)}
          >
            <Icon size={17} />
            <span>{label}</span>
            {name === "Сравнение и установки" && compareCount > 0 && (
              <span className="nav-count">{compareCount}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-group-label">КАТАЛОГ PSI</div>
      <div className="library">
        <div className="search-row">
          <label className="search-field">
            <Search size={14} />
            <input
              type="search"
              placeholder="Фильтр списка…"
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
            <SlidersHorizontal size={15} />
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
          <span>Эксперименты ({filtered.length})</span>
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
            {!pending && !error && filtered.length === 0 && <p role="status">Не найдено</p>}
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

      <div className="sidebar-group-label">ИНСТРУМЕНТЫ</div>
      <nav className="side-nav side-nav-compact" aria-label="Инструменты">
        <button
          type="button"
          aria-current={section === "ИИ-ассистент" ? "page" : undefined}
          onClick={() => onSection("ИИ-ассистент")}
        >
          <Bot size={17} />
          <span>ИИ-помощник</span>
        </button>
        <button
          type="button"
          aria-current={section === "Настройки" ? "page" : undefined}
          onClick={() => onSection("Настройки")}
        >
          <Settings size={17} />
          <span>Настройки</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-avatar">PSI</div>
        <div className="sidebar-footer-info">
          <strong>{useMocks ? "Локальный каталог" : "FastAPI v1"}</strong>
          <small>{studies.length} исследований</small>
        </div>
      </div>
    </aside>
  )
}
