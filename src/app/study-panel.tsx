import { useQueries } from "@tanstack/react-query"
import { useState } from "react"
import { DropdownMenu, Tabs } from "radix-ui"
import { studyQueries } from "@/api/queries"
import { Bookmark, MoreHorizontal, Share, ChartNoAxesCombined, CheckCircle2, ChevronRight, FileText, Database, FlaskConical, Layers3, Network, ShieldCheck } from "@/components/ui/icons"
import type { Finding, Study } from "@/domain/types"
import { catalogEntry, topics } from "@/mocks/catalog"
import { StudyMeasurements, StudySafety, StudyVideo } from "./study-evidence"
import flame from "@/assets/flex-flame.webp"
import { SourceList } from "./research-sources"
import { QueryFailure, QueryLoading } from "./query-feedback"

const views = [
  { id: "overview", name: "Обзор", icon: Layers3 },
  { id: "measurements", name: "Экспериментальные данные", icon: Database },
  { id: "visualization", name: "Визуализация", icon: ChartNoAxesCombined },
  { id: "findings", name: "Выводы и связи", icon: Network },
  { id: "safety", name: "Пожарная безопасность", icon: ShieldCheck },
] as const

export type View = typeof views[number]["id"]

export function isStudyView(value: string): value is View {
  return views.some(({ id }) => id === value)
}

export function StudyTabs() {
  return (
    <Tabs.List aria-label="Разделы исследования" className="study-tabs">
      {views.map(({ id, name, icon: Icon }) => (
        <Tabs.Trigger key={id} value={id}><Icon size={16} />{name}</Tabs.Trigger>
      ))}
    </Tabs.List>
  )
}

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

function StudyActions({ study, onView }: { study: Study; onView: (view: View) => void }) {
  const storageKey = `ignis-saved-study-${study.id}`
  const [saved, setSaved] = useState(() => localStorage.getItem(storageKey) === "true")
  const [notice, setNotice] = useState("")

  function toggleSaved() {
    if (saved) localStorage.removeItem(storageKey)
    else localStorage.setItem(storageKey, "true")
    setSaved(!saved)
    setNotice(saved ? "Исследование удалено из закладок" : "Исследование сохранено в закладках")
  }

  async function share() {
    const url = new URL("/explorer", window.location.origin)
    url.searchParams.set("study", study.id)
    try {
      await navigator.clipboard.writeText(url.href)
      setNotice("Ссылка скопирована")
    } catch {
      setNotice("Не удалось скопировать ссылку")
    }
  }

  return <div className="study-actions">
    <button type="button" className="icon-button" aria-label="Сохранить исследование" aria-pressed={saved} title="Закладка" onClick={toggleSaved}><Bookmark size={18} /></button>
    <button type="button" className="icon-button" aria-label="Скопировать ссылку на исследование" title="Поделиться" onClick={() => void share()}><Share size={18} /></button>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild><button type="button" className="icon-button" aria-label="Дополнительные действия"><MoreHorizontal size={18} /></button></DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" sideOffset={6} className="study-action-menu">
          {views.filter(({ id }) => id !== "overview").map(({ id, name }) =>
            <DropdownMenu.Item key={id} onSelect={() => onView(id)}>{name}</DropdownMenu.Item>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
    <span className="study-action-notice" role="status">{notice}</span>
  </div>
}

export function StudyPanel({ study, onView }: { study: Study; onView: (view: View) => void }) {
  const [findings, sources, relations] = useQueries({
    queries: [studyQueries.findings(study.id), studyQueries.sources(study.id), studyQueries.relations(study.id)],
  })
  const entry = catalogEntry(study.id)
  const isFlex = study.id === "flex"
  const parameters = [
    ["Объект", entry?.subject],
    ["Установка", entry?.facility],
    ["Среда", entry ? "Микрогравитация" : undefined],
    ...(isFlex ? [["Топливо", "Метанол"], ["Начальный диаметр", "1,61–2,54 мм"]] : []),
  ]

  return (
    <>
      <header className="study-heading">
        <div className="breadcrumb">Каталог экспериментов <ChevronRight size={13} /> <span>{entry?.code ?? study.id}</span></div>
        <div className="study-title-row">
          <h1>{study.title}</h1>
          <StudyActions key={study.id} study={study} onView={onView} />
        </div>
        <p>{study.summary}</p>
        {entry && <ul className="study-topics" aria-label="Темы исследования">
          {entry.topics.map((index) => <li key={index}>{topics[index]}</li>)}
        </ul>}

      </header>
      <Tabs.Content value="overview" className="study-content">
        <div className="overview-grid">
          <figure className="experiment-figure">
            {isFlex ? <img src={flame} alt="Иллюстрация сферического пламени капли" /> : <div className="image-unavailable">Изображение недоступно</div>}
            <figcaption>{isFlex ? "Иллюстрация горения капли" : entry?.subject ?? study.title}</figcaption>
          </figure>
          <section className="study-block">
            <h2><FlaskConical size={17} /> Параметры эксперимента</h2>
            <dl className="parameters">{parameters.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value ?? "Нет данных"}</dd></div>)}</dl>
          </section>
        </div>

        <section className="overview-findings">
          <h2>Выводы исследования</h2>
          {findings.isPending && <QueryLoading label="Загрузка выводов…" />}
          {findings.isError && <QueryFailure label="Не удалось загрузить выводы." fetching={findings.isFetching} retry={() => void findings.refetch()} />}
          {findings.data && <Findings findings={findings.data} />}
        </section>
        <section className="study-block">
          <h2><FileText size={17} /> Источники</h2>
          {sources.isPending && <QueryLoading label="Загрузка…" />}
          {sources.isError && <QueryFailure label="Не удалось загрузить источники." fetching={sources.isFetching} retry={() => void sources.refetch()} />}
          {sources.data && <SourceList sources={sources.data} />}
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
        <section className="study-block">
          <h2><CheckCircle2 size={17} /> Основные выводы</h2>
          {findings.isPending && <QueryLoading label="Загрузка…" />}
          {findings.isError && <QueryFailure label="Не удалось загрузить выводы." fetching={findings.isFetching} retry={() => void findings.refetch()} />}
          {findings.data && <Findings findings={findings.data} />}
        </section>
        <section className="study-block">
          <h2><Network size={17} /> Связи между выводами</h2>
          {(relations.isPending || findings.isPending) && <QueryLoading label="Загрузка связей…" />}
          {(relations.isError || findings.isError) && <QueryFailure label="Не удалось загрузить связи." fetching={relations.isFetching || findings.isFetching} retry={() => {
            if (relations.isError) void relations.refetch()
            if (findings.isError) void findings.refetch()
          }} />}
          {relations.data?.length === 0 && <p className="muted">Для этого эксперимента пока нет связей.</p>}
          {relations.data && findings.data && <ul className="records">{relations.data.map((relation) => <li key={relation.id}>{findings.data.find(({ id }) => id === relation.fromFindingId)?.title ?? relation.fromFindingId} <span>{relationLabels[relation.kind]}</span> {findings.data.find(({ id }) => id === relation.toFindingId)?.title ?? relation.toFindingId}</li>)}</ul>}
        </section>
      </Tabs.Content>
      <Tabs.Content value="safety" className="study-content">
        <StudySafety studyId={study.id} />
      </Tabs.Content>
    </>
  )
}

