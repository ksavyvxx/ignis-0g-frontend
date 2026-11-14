import { useSyncExternalStore, useState } from "react"
import { Tabs } from "radix-ui"
import { useQuery } from "@tanstack/react-query"
import { ArrowUpRight, FlaskConical, Bot, ShieldCheck } from "@/components/ui/icons"
import { studyQueries } from "@/api/queries"
import { Button } from "@/components/ui/button"
import type { Study } from "@/domain/types"
import { Sidebar, type Section } from "./sidebar"
import { isStudyView, StudyPanel, StudyTabs, type View } from "./study-panel"
import { QueryFailure, QueryLoading } from "./query-feedback"
import { AssistantChat, useStudyChat } from "./assistant-chat"
import { SourceList } from "./research-sources"
import { WorkspacePane } from "./workspace-pane"
import "./workspace.css"

const mobileCatalog = window.matchMedia("(max-width: 650px)")
const inspectorDrawer = window.matchMedia("(max-width: 1100px)")

function subscribeToLayout(callback: () => void) {
  mobileCatalog.addEventListener("change", callback)
  inspectorDrawer.addEventListener("change", callback)
  return () => {
    mobileCatalog.removeEventListener("change", callback)
    inspectorDrawer.removeEventListener("change", callback)
  }
}

function ResearchSources({ study }: { study: Study }) {
  const sources = useQuery(studyQueries.sources(study.id))
  if (sources.isPending) return <QueryLoading label="Загрузка источников…" />
  if (sources.isError) return <QueryFailure label="Не удалось загрузить источники." fetching={sources.isFetching} retry={() => void sources.refetch()} />
  return <SourceList sources={sources.data} />
}

export function App() {
  const catalogIsDrawer = useSyncExternalStore(subscribeToLayout, () => mobileCatalog.matches)
  const inspectorIsDrawer = useSyncExternalStore(subscribeToLayout, () => inspectorDrawer.matches)
  const query = useQuery(studyQueries.list())
  const studies = query.data ?? []
  const [selectedId, setSelectedId] = useState(() => new URLSearchParams(window.location.search).get("study") ?? undefined)
  const [section, setSection] = useState<Section>(() => ["assistant", "nexus"].includes(new URLSearchParams(window.location.search).get("view") ?? "") ? "ИИ-ассистент" : "Исследования")
  const [view, setView] = useState<View>("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [inspectorOpen, setInspectorOpen] = useState(false)
  const [inspectorExpanded, setInspectorExpanded] = useState(true)
  const assistantPage = section === "ИИ-ассистент"
  const study = studies.find(({ id }) => id === selectedId) ?? studies[0]
  const chat = useStudyChat(study, view)

  function selectStudy(id: string) {
    setSelectedId(id)
    setSection("Исследования")
    setView("overview")
    setSidebarOpen(false)
    setInspectorOpen(false)
  }

  return (
    <Tabs.Root asChild value={view} onValueChange={(value) => { if (isStudyView(value)) setView(value) }}>
      <div className="workspace">
        <a className="workspace-skip" href="#research-main">К содержимому</a>
        <header className="workspace-header">
          <a className="workspace-title" href="/">IGNIS <span>0G</span></a>
          {catalogIsDrawer && <button type="button" className="workspace-header-action" aria-controls="catalog-dialog"
            aria-expanded={sidebarOpen} onClick={() => setSidebarOpen(!sidebarOpen)}>Каталог</button>}
          {section === "Исследования" && study && <StudyTabs />}
          {!assistantPage && <button type="button" className="workspace-header-action assistant-toggle" aria-controls="inspector-dialog"
            aria-expanded={inspectorIsDrawer ? inspectorOpen : inspectorExpanded}
            onClick={() => inspectorIsDrawer ? setInspectorOpen(!inspectorOpen) : setInspectorExpanded(!inspectorExpanded)}>
            <Bot size={18} /> ИИ-ассистент
          </button>}
        </header>
        <div className="workspace-grid" data-inspector={!assistantPage && inspectorExpanded}>
          <WorkspacePane id="catalog-dialog" label="Каталог исследований" className="sidebar-wrap"
            breakpoint={650} expanded drawer={sidebarOpen} onClose={() => setSidebarOpen(false)}>
            <Sidebar studies={studies} activeId={study?.id} section={section} onSection={(next) => { setSection(next); setSidebarOpen(false); setInspectorOpen(false) }} onStudy={selectStudy} pending={query.isPending} error={query.isError} retry={() => void query.refetch()} />
          </WorkspacePane>
          <main id="research-main" className="main-panel" tabIndex={-1}>
            {section === "Исследования" && study && <StudyPanel study={study} onView={setView} />}
            {section === "Исследования" && !study && <div className="empty-main">
              {query.isPending ? <QueryLoading label="Загрузка каталога…" />
                : query.isError ? <QueryFailure label="Не удалось загрузить каталог." fetching={query.isFetching} retry={() => void query.refetch()} />
                : <p>В каталоге пока нет исследований.</p>}
            </div>}
            {section !== "Исследования" && <div className="section-view"><h1>{section}</h1>
              {section === "Коллекции" && <section className="panel panel-padding">
                <h2>NASA Experiments</h2>
                <div className="related-list">{studies.map(({ id, title }) => <button key={id} onClick={() => selectStudy(id)}><FlaskConical size={16} /><span>{title}</span><ArrowUpRight size={15} /></button>)}</div>
                {!studies.length && <p className="muted">Эксперименты недоступны.</p>}
              </section>}
              {section === "Источники" && <section className="panel panel-padding">
                <h2>{study?.title ?? "Исследование не выбрано"}</h2>
                {study && <ResearchSources study={study} />}
              </section>}
              {section === "Настройки" && <section className="panel panel-padding workspace-settings">
                <h2>Панели рабочего пространства</h2>
                <label><input type="checkbox" checked={inspectorExpanded} onChange={(event) => setInspectorExpanded(event.target.checked)} /> Показывать ИИ-ассистент на широком экране</label>
              </section>}
              {assistantPage && <AssistantChat key={study?.id} chat={chat} />}
              {section === "Миссии и безопасность" && <section className="panel panel-padding"><h2><ShieldCheck size={17} /> Пожарная безопасность на борту</h2><p className="muted">Эксперименты по распространению огня помогают изучать поведение пламени в замкнутом объёме.</p>{studies.some(({ id }) => id === "saffire") && <Button variant="outline" onClick={() => selectStudy("saffire")}>Открыть SAFFIRE <ArrowUpRight size={15} /></Button>}</section>}
            </div>}
          </main>
          {!assistantPage && <WorkspacePane id="inspector-dialog" label="ИИ-ассистент" className="context-panel"
            breakpoint={1100} expanded={inspectorExpanded} drawer={inspectorOpen} onClose={() => setInspectorOpen(false)}>
            <AssistantChat key={study?.id} chat={chat} onOpenPage={() => { setSection("ИИ-ассистент"); setInspectorOpen(false) }} />
          </WorkspacePane>}
        </div>
      </div>
    </Tabs.Root>
  )
}
