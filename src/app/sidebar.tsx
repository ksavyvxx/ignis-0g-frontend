import { useState } from "react"
import { BookOpen, ChevronDown, ChevronRight, FlaskConical, Folder, Layers3, Network, Reset, Search, ShieldCheck, SlidersHorizontal, Sparkles, X } from "@/components/ui/icons"
import type { Study } from "@/domain/types"
import { catalogEntry, topics } from "@/mocks/catalog"

export const sections = [
  { name: "Исследования", icon: FlaskConical },
  { name: "Граф знаний", icon: Network },
  { name: "Миссии и безопасность", icon: ShieldCheck },
  { name: "Ассистент", icon: Sparkles },
] as const

export type Section = typeof sections[number]["name"]

interface SidebarProps {
  studies: Study[]
  activeId?: string
  section: Section
  onSection: (section: Section) => void
  onStudy: (id: string) => void
  onClose: () => void
  pending: boolean
  error: boolean
  retry: () => void
}

export function Sidebar({ studies, activeId, section, onSection, onStudy, onClose, pending, error, retry }: SidebarProps) {
  const [search, setSearch] = useState("")
  const [topic, setTopic] = useState<number | null>(null)
  const [status, setStatus] = useState<Study["status"] | "all">("all")
  const [showFilters, setShowFilters] = useState(false)
  const [experimentsOpen, setExperimentsOpen] = useState(true)
  const [topicsOpen, setTopicsOpen] = useState(true)
  const term = search.trim().toLocaleLowerCase("ru")
  const filtered = studies.filter((study) => {
    const entry = catalogEntry(study.id)
    const studyTopics = entry?.topics ?? []
    const searchable = [study.id, study.title, study.summary, entry?.code, ...studyTopics.map((index) => topics[index])].join(" ")
    return searchable.toLocaleLowerCase("ru").includes(term) &&
      (topic === null || studyTopics.includes(topic)) &&
      (status === "all" || study.status === status)
  })
  const isFiltered = Boolean(term) || topic !== null || status !== "all"

  function reset() {
    setSearch("")
    setTopic(null)
    setStatus("all")
    setExperimentsOpen(true)
  }

  return (
    <aside className="sidebar" aria-label="Каталог исследований">
      <div className="mobile-side-head"><strong>Каталог</strong><button className="icon-button" aria-label="Закрыть каталог" onClick={onClose}><X size={18} /></button></div>
      <nav aria-label="Разделы" className="side-nav">
        {sections.map(({ name, icon: Icon }) => (
          <button key={name} aria-current={section === name ? "page" : undefined} onClick={() => onSection(name)}>
            <Icon size={17} />{name}
          </button>
        ))}
      </nav>
      <div className="library">
        <div className="side-heading"><BookOpen size={15} /> Библиотека</div>
        <div className="search-row">
          <label className="search-field"><Search size={15} /><input type="search" placeholder="Поиск исследований" aria-label="Поиск исследований" value={search} onChange={(event) => { setSearch(event.target.value); setExperimentsOpen(true) }} /></label>
          <button className="icon-button" aria-label="Фильтр по статусу" aria-expanded={showFilters} aria-controls="status-filter" onClick={() => setShowFilters(!showFilters)}><SlidersHorizontal size={16} /></button>
        </div>
        {showFilters && <select id="status-filter" aria-label="Статус исследования" value={status} onChange={(event) => { setStatus(event.target.value as typeof status); setExperimentsOpen(true) }}><option value="all">Все статусы</option><option value="completed">Завершённые</option><option value="in_progress">В работе</option><option value="draft">Черновики</option></select>}
        {isFiltered && <button className="reset-filter" onClick={reset}><Reset size={13} /> Сбросить фильтры</button>}
        <button className="tree-parent" aria-expanded={experimentsOpen} aria-controls="experiments" onClick={() => setExperimentsOpen(!experimentsOpen)}>
          {experimentsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}<Folder size={16} /> NASA Experiments <span className="tree-count">{filtered.length}</span>
        </button>
        {experimentsOpen && (
          <div id="experiments" className="tree-children">
            {pending && <p role="status">Загрузка…</p>}
            {error && <p role="alert">Ошибка загрузки. <button className="reset-filter" onClick={retry}>Повторить</button></p>}
            {!pending && !error && filtered.length === 0 && <p role="status">Исследования не найдены</p>}
            {filtered.map((study) => (
              <button className="tree-item" key={study.id} title={study.title} aria-current={activeId === study.id && section === "Исследования" ? "true" : undefined} onClick={() => onStudy(study.id)}>
                <FlaskConical size={14} /> {catalogEntry(study.id)?.code ?? study.title}
              </button>
            ))}
          </div>
        )}
        <button className="tree-parent" aria-expanded={topicsOpen} aria-controls="topics" onClick={() => setTopicsOpen(!topicsOpen)}>
          {topicsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}<Layers3 size={16} /> Темы
        </button>
        {topicsOpen && (
          <div id="topics" className="tree-children">
            {topics.map((name, index) => (
              <button className="tree-item" key={name} aria-pressed={topic === index} onClick={() => { setTopic(topic === index ? null : index); setExperimentsOpen(true) }}><span className="topic-mark">#</span>{name}</button>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}
