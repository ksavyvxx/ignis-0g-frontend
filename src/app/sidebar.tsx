import { useState } from "react"
import { ChevronDown, ChevronRight, FlaskConical, Folder, Network, FileText, Settings, Reset, Search, ShieldCheck, SlidersHorizontal, Bot } from "@/components/ui/icons"
import type { Study } from "@/domain/types"
import { catalogEntry, topics } from "@/mocks/catalog"

export const sections = [
  { name: "Исследования", icon: FlaskConical },
  { name: "Граф знаний", icon: Network },
  { name: "Миссии и безопасность", icon: ShieldCheck },
  { name: "Ассистент", icon: Bot },
] as const

export type Section = typeof sections[number]["name"] | "Коллекции" | "Источники" | "Настройки"

interface SidebarProps {
  studies: Study[]
  activeId?: string
  section: Section
  onSection: (section: Section) => void
  onStudy: (id: string) => void
  pending: boolean
  error: boolean
  retry: () => void
}

export function Sidebar({ studies, activeId, section, onSection, onStudy, pending, error, retry }: SidebarProps) {
  const [search, setSearch] = useState("")
  const [topic, setTopic] = useState<number | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [experimentsOpen, setExperimentsOpen] = useState(true)
  const term = search.trim().toLocaleLowerCase("ru")
  const filtered = studies.filter((study) => {
    const entry = catalogEntry(study.id)
    const studyTopics = entry?.topics ?? []
    const searchable = [study.id, study.title, study.summary, entry?.code, ...studyTopics.map((index) => topics[index])].join(" ")
    return searchable.toLocaleLowerCase("ru").includes(term) &&
      (topic === null || studyTopics.includes(topic))
  })
  const isFiltered = Boolean(term) || topic !== null

  function reset() {
    setSearch("")
    setTopic(null)
    setExperimentsOpen(true)
  }

  return (
    <aside className="sidebar" aria-label="Каталог исследований">

      <nav aria-label="Разделы" className="side-nav">
        {sections.filter(({ name }) => name !== "Ассистент").map(({ name, icon: Icon }) => (
          <button key={name} aria-current={section === name ? "page" : undefined} onClick={() => onSection(name)}>
            <Icon size={17} />{name}
          </button>
        ))}
      </nav>
      <div className="library">
        <div className="search-row">
          <label className="search-field"><Search size={15} /><input type="search" placeholder="Поиск" aria-label="Поиск исследований" value={search} onChange={(event) => { setSearch(event.target.value); setExperimentsOpen(true) }} /></label>
          <button className="icon-button" aria-label="Фильтр по теме" aria-expanded={showFilters} data-filter-active={topic !== null} aria-controls={showFilters ? "topic-filter" : undefined} onClick={() => setShowFilters(!showFilters)}><SlidersHorizontal size={16} /></button>
        </div>
        {showFilters && (
          <select id="topic-filter" aria-label="Тема исследования" value={topic ?? ""}
            onChange={(event) => {
              const value = event.target.value
              setTopic(value === "" ? null : Number(value))
              setExperimentsOpen(true)
            }}>
            <option value="">Все темы</option>
            {topics.map((name, index) => <option key={name} value={index}>{name}</option>)}
          </select>
        )}
        {isFiltered && <button className="reset-filter" onClick={reset}><Reset size={13} /> Сбросить фильтры</button>}
        <button className="tree-parent" aria-expanded={experimentsOpen} aria-controls="experiments" onClick={() => setExperimentsOpen(!experimentsOpen)}>
          {experimentsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}<Folder size={16} /> NASA Experiments
        </button>
        {experimentsOpen && (
          <div id="experiments" className="tree-children">
            {pending && <p role="status">Загрузка…</p>}
            {error && <p role="alert">Ошибка загрузки. <button className="reset-filter" onClick={retry}>Повторить</button></p>}
            {!pending && !error && filtered.length === 0 && <p role="status">Исследования не найдены</p>}
            {filtered.map((study) => (
              <button className="tree-item" key={study.id} title={study.title} aria-current={activeId === study.id && section === "Исследования" ? "true" : undefined} onClick={() => onStudy(study.id)}>
                {catalogEntry(study.id)?.code ?? study.title}
              </button>
            ))}
          </div>
        )}
        <nav className="side-nav" aria-label="Библиотека">
          <button aria-current={section === "Коллекции" ? "page" : undefined} onClick={() => onSection("Коллекции")}><Folder size={17} /> Коллекции</button>
          <button aria-current={section === "Источники" ? "page" : undefined} onClick={() => onSection("Источники")}><FileText size={17} /> Источники</button>
        </nav>
      </div>
      <details className="navigation-group">
        <summary>Инструменты</summary>
        <nav className="side-nav" aria-label="Инструменты">
          <button aria-current={section === "Настройки" ? "page" : undefined} onClick={() => onSection("Настройки")}><Settings size={17} /> Настройки</button>
          <button aria-current={section === "Ассистент" ? "page" : undefined} onClick={() => onSection("Ассистент")}><Bot size={17} /> Ассистент</button>
        </nav>
      </details>
    </aside>
  )
}
