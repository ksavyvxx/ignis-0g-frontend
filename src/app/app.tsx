import { useEffect, useState } from "react"
import { useQueries, useQuery } from "@tanstack/react-query"
import { ArrowUpRight, BookOpen, ChartNoAxesCombined, CheckCircle2, ChevronRight, FileText, FlaskConical, Layers3, Menu, Network, ShieldCheck } from "@/components/ui/icons"
import { Tabs } from "radix-ui"
import { studyQueries } from "@/api/queries"
import { Button } from "@/components/ui/button"
import type { Finding, Study } from "@/domain/types"
import { catalogEntry, topics } from "@/mocks/catalog"
import { Sidebar, type Section } from "./sidebar"
import { StudyMeasurements, StudySafety, StudyVideo } from "./study-evidence"
import { Nexus } from "./nexus"
import { AssistantChat, useStudyChat } from "./assistant-chat"
import "./workspace.css"

const views = [
  { id: "overview", name: "Обзор", icon: Layers3 },
  { id: "measurements", name: "Экспериментальные данные", icon: FlaskConical },
  { id: "visualization", name: "Визуализация", icon: ChartNoAxesCombined },
  { id: "findings", name: "Выводы и связи", icon: Network },
  { id: "safety", name: "Пожарная безопасность", icon: ShieldCheck },
] as const

type View = typeof views[number]["id"]

const relationLabels = {
  supports: "поддерживает",
  contradicts: "противоречит",
  related: "связано с",
} as const

function Findings({ findings }: { findings: Finding[] }) {
  if (!findings.length) return <p className="muted">Для этого эксперимента пока нет выводов.</p>
  return <ul className="findings">{findings.map((finding) => (
    <li key={finding.id}><CheckCircle2 size={16} /><div><strong>{finding.title}</strong><p>{finding.summary}</p></div></li>
  ))}</ul>
}

function StudyPanel({ study, view, setView }: { study: Study; view: View; setView: (view: View) => void }) {
  const [findings, sources, relations] = useQueries({
    queries: [studyQueries.findings(study.id), studyQueries.sources(study.id), studyQueries.relations(study.id)],
  })
  const entry = catalogEntry(study.id)
  const isFlex = study.id === "flex"
  const parameters = [
    ["Объект", entry?.subject ?? "—"],
    ["Установка", entry?.facility ?? "—"],
    ["Среда", "Микрогравитация"],
    ...(isFlex ? [["Топливо", "н-гептан"], ["Диаметр капли", "0,8–2,0 мм"]] : []),
  ]

  return (
    <>
      <header className="study-heading">
        <div className="breadcrumb"><BookOpen size={15} /> NASA Experiments <ChevronRight size={13} /> <span>{entry?.code ?? study.id}</span></div>
        <h1>{entry && <><span>{entry.code}</span><span className="title-dash"> — </span></>}{study.title}</h1>
        <p>{study.summary}</p>
        <div className="chips">{entry?.topics.map((index) => <span key={index}>{topics[index]}</span>)}</div>
      </header>
      <Tabs.Root value={view} onValueChange={(value) => setView(value as View)}>
        <Tabs.List aria-label="Разделы исследования" className="study-tabs">
          {views.map(({ id, name, icon: Icon }) => (
            <Tabs.Trigger key={id} value={id}><Icon size={16} />{name}</Tabs.Trigger>
          ))}
        </Tabs.List>
        <Tabs.Content value="overview" className="study-content">
          <div className="overview-grid">
            <figure className={`panel experiment-image ${isFlex ? "flex-image" : ""}`}>
              {!isFlex && <FlaskConical size={52} />}
              <figcaption><span>{entry?.code ?? study.id}</span>{isFlex ? "Иллюстрация горения капли" : entry?.subject}</figcaption>
            </figure>
            <section className="panel panel-padding">
              <h2><FlaskConical size={17} /> Параметры эксперимента</h2>
              <dl className="parameters">{parameters.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
            </section>
          </div>

          <section className="panel panel-padding">
            <h2><FileText size={17} /> Источники</h2>
            {sources.isPending && <p role="status">Загрузка…</p>}
            {sources.isError && <p role="alert">Не удалось загрузить источники.</p>}
            {sources.data?.length === 0 && <p className="muted">Для этого эксперимента пока нет источников.</p>}
            {sources.data && <ul className="records">{sources.data.map((source) => <li key={source.id}>{source.url ? <a href={source.url}>{source.title}</a> : source.title}</li>)}</ul>}
          </section>
        </Tabs.Content>
        <Tabs.Content value="measurements" className="study-content">
          <StudyMeasurements studyId={study.id} />
        </Tabs.Content>
        <Tabs.Content value="visualization" className="study-content">
          <StudyMeasurements studyId={study.id} chart />
          <StudyVideo studyId={study.id} />
        </Tabs.Content>
        <Tabs.Content value="findings" className="study-content">
          <section className="panel panel-padding">
            <h2><CheckCircle2 size={17} /> Основные выводы</h2>
            {findings.isPending && <p role="status">Загрузка…</p>}
            {findings.isError && <p role="alert">Не удалось загрузить выводы.</p>}
            {findings.data && <Findings findings={findings.data} />}
          </section>
          <section className="panel panel-padding">
            <h2><Network size={17} /> Связи между выводами</h2>
            {(relations.isPending || findings.isPending) && <p role="status">Загрузка…</p>}
            {(relations.isError || findings.isError) && <p role="alert">Не удалось загрузить связи.</p>}
            {relations.data?.length === 0 && <p className="muted">Для этого эксперимента пока нет связей.</p>}
            {relations.data && findings.data && <ul className="records">{relations.data.map((relation) => <li key={relation.id}>{findings.data.find(({ id }) => id === relation.fromFindingId)?.title ?? relation.fromFindingId} <span>{relationLabels[relation.kind]}</span> {findings.data.find(({ id }) => id === relation.toFindingId)?.title ?? relation.toFindingId}</li>)}</ul>}
          </section>
        </Tabs.Content>
        <Tabs.Content value="safety" className="study-content">
          <StudySafety studyId={study.id} />
        </Tabs.Content>
      </Tabs.Root>
    </>
  )
}

function RelatedStudies({ study, studies, onStudy }: { study?: Study; studies: Study[]; onStudy: (id: string) => void }) {
  const entry = study && catalogEntry(study.id)
  const related = studies.filter(({ id }) => id !== study?.id && catalogEntry(id)?.topics.some((index) => entry?.topics.includes(index)))
  return (
    <section className="panel panel-padding">
      <h2><Network size={17} /> Связанные эксперименты</h2>
      {related.length === 0 && <p className="muted">Нет экспериментов с общими темами.</p>}
      <div className="related-list">{related.map(({ id, title }) => <button key={id} onClick={() => onStudy(id)}><span className="related-icon"><FlaskConical size={15} /></span><span><strong>{catalogEntry(id)?.code ?? id}</strong><small>{title}</small></span><ArrowUpRight size={15} /></button>)}</div>
    </section>
  )
}

export function App() {
  const query = useQuery(studyQueries.list())
  const studies = query.data ?? []
  const [selectedId, setSelectedId] = useState(() => new URLSearchParams(window.location.search).get("study") ?? undefined)
  const [section, setSection] = useState<Section>("Исследования")
  const [view, setView] = useState<View>("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const study = studies.find(({ id }) => id === selectedId) ?? studies[0]
  const chat = useStudyChat(study)

  useEffect(() => {
    if (!sidebarOpen) return
    function dismiss(event: KeyboardEvent) {
      if (event.key === "Escape") setSidebarOpen(false)
    }
    window.addEventListener("keydown", dismiss)
    return () => window.removeEventListener("keydown", dismiss)
  }, [sidebarOpen])

  function selectStudy(id: string) {
    setSelectedId(id)
    setSection("Исследования")
    setView("overview")
    setSidebarOpen(false)
  }

  return (
    <div className="workspace">
      <header className="workspace-header">
        <button className="icon-button menu-button" aria-label="Открыть каталог" onClick={() => setSidebarOpen(true)}><Menu size={22} /></button>
        <a className="workspace-title" href="/">IGNIS <span>0G</span></a>
      </header>
      <div className="workspace-grid">
        {sidebarOpen && <div className="sidebar-backdrop" aria-hidden="true" onClick={() => setSidebarOpen(false)} />}
        <div className={sidebarOpen ? "sidebar-wrap sidebar-raised" : "sidebar-wrap"}>
          <Sidebar studies={studies} activeId={study?.id} section={section} onSection={(next) => { setSection(next); setSidebarOpen(false) }} onStudy={selectStudy} onClose={() => setSidebarOpen(false)} pending={query.isPending} error={query.isError} retry={() => void query.refetch()} />
        </div>
        <main className="main-panel">
          {section === "Исследования" && study && <StudyPanel study={study} view={view} setView={setView} />}
          {section === "Исследования" && !study && <p className="empty-main" role={query.isError ? "alert" : "status"}>{query.isPending ? "Загрузка каталога…" : query.isError ? "Не удалось загрузить исследования." : "В каталоге пока нет исследований."}</p>}
          {section !== "Исследования" && <div className="section-view"><h1>{section}</h1>
            {section === "Граф знаний" && <Nexus studies={studies} onStudy={selectStudy} />}
            {section === "Ассистент" && <AssistantChat key={study?.id} chat={chat} />}
            {section === "Миссии и безопасность" && <section className="panel panel-padding"><h2><ShieldCheck size={17} /> Пожарная безопасность на борту</h2><p className="muted">Эксперименты по распространению огня помогают изучать поведение пламени в замкнутом объёме.</p>{studies.some(({ id }) => id === "saffire") && <Button variant="outline" onClick={() => selectStudy("saffire")}>Открыть SAFFIRE <ArrowUpRight size={15} /></Button>}</section>}
          </div>}
        </main>
        <aside className="context-panel" aria-label="Контекст исследования">
          {section !== "Ассистент" && <AssistantChat key={study?.id} chat={chat} />}
          <RelatedStudies study={study} studies={studies} onStudy={selectStudy} />
        </aside>
      </div>
    </div>
  )
}
