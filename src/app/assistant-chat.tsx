import { useEffect, useRef, useState, type FormEvent } from "react"
import { ArrowUpRight, Send, Bot } from "@/components/ui/icons"
import { useQuery } from "@tanstack/react-query"
import { studyQueries } from "@/api/queries"
import { Button } from "@/components/ui/button"
import type { Study } from "@/domain/types"
import type { View } from "./study-panel"
import { QueryFailure, QueryLoading } from "./query-feedback"
import { catalogEntry } from "@/mocks/catalog"

const nasaOverview = "https://www.nasa.gov/missions/station/iss-research/studying-combustion-and-fire-safety/"
const nasaStudies: Record<string, string> = {
  flex: "https://psi.nasa.gov/physci/repo/data/investigations/PSI-69",
  acme: "https://science.nasa.gov/mission/acme/",
}

type Exchange = { question: string; answer: string; source: string; sourceTitle: string }

export function useStudyChat(study: Study | undefined, view: View) {
  const sources = useQuery({ ...studyQueries.sources(study?.id ?? ""), enabled: Boolean(study) })
  const findings = useQuery({ ...studyQueries.findings(study?.id ?? ""), enabled: Boolean(study) })
  const currentSource = sources.data?.find(({ url }) => url)
  const isDataset = study?.id === "flex" && (view === "measurements" || view === "visualization")
  const [history, setHistory] = useState<Record<string, Exchange[]>>({})
  const code = study && (catalogEntry(study.id)?.code ?? study.title)
  const exchanges = study ? history[study.id] ?? [] : []

  function send(question: string) {
    const text = question.trim()
    if (!study || !text) return
    const source = currentSource?.url ?? (Object.hasOwn(nasaStudies, study.id) ? nasaStudies[study.id] : undefined)
    const overviewQuestion = /что изучает|цель|о ч[её]м|расскажи|предмет/i.test(text)
    const sourceQuestion = /источник|ссылк|nasa/i.test(text)
    const answer = /вывод/i.test(text)
      ? findings.data?.map(({ title }) => title).join("\n") || "Для выбранного исследования нет доступных выводов."
      : isDataset && /услови|данн|измерен/i.test(text)
        ? "В эксперименте использовались метанол и смесь из 21% кислорода и 79% азота при давлении около 1 атм."
        : overviewQuestion ? study.summary
      : sourceQuestion ? `Материалы NASA по теме исследования ${code} доступны по ссылке ниже.`
      : "На этот вопрос пока нет готового ответа. Попробуйте спросить о цели исследования или запросить источник NASA."
    const exchange = {
      question: text,
      answer,
      source: source ?? nasaOverview,
      sourceTitle: currentSource?.title ?? (source ? `NASA · ${code}` : "NASA · Горение и пожарная безопасность"),
    }
    setHistory((previous) => ({
      ...previous,
      [study.id]: [...(previous[study.id] ?? []), exchange],
    }))
  }

  return { code, exchanges, send, sources }
}

export function AssistantChat({ chat, onOpenPage }: { chat: ReturnType<typeof useStudyChat>; onOpenPage?: () => void }) {
  const [draft, setDraft] = useState("")
  const log = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLTextAreaElement>(null)
  const { code, exchanges, send, sources } = chat

  useEffect(() => {
    if (log.current) log.current.scrollTop = log.current.scrollHeight
  }, [exchanges.length])

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!code || !draft.trim()) return
    send(draft)
    setDraft("")
    input.current?.focus()
  }

  return (
    <section className="panel panel-padding assistant">
      <div className="assistant-heading">
        <h2><Bot size={18} /> Ассистент</h2>
        {onOpenPage && <Button type="button" variant="ghost" size="icon" aria-label="Открыть страницу ассистента" title="Открыть страницу ассистента" onClick={onOpenPage}><ArrowUpRight size={18} /></Button>}
      </div>
      <div className="chat-body" ref={log}>
      {code ? <>
        {sources.isPending && <QueryLoading label="Загрузка источников…" />}
        {sources.isError && <QueryFailure label="Не удалось загрузить источники." fetching={sources.isFetching} retry={() => void sources.refetch()} />}
      </> : <p className="muted">Выберите исследование, чтобы начать чат.</p>}
      <div className="chat-log" role="log" aria-label="История сообщений" tabIndex={exchanges.length ? 0 : undefined}>
        {exchanges.map(({ question, answer, source, sourceTitle }, index) => (
          <div className="chat-exchange" key={index}>
            <p className="chat-message chat-question"><strong>Вы</strong>{question}</p>
            <div className="chat-message"><strong>Ответ из каталога</strong><p>{answer}</p>
              <a href={source} target="_blank" rel="noreferrer">{sourceTitle} <ArrowUpRight size={13} /></a>
            </div>
          </div>
        ))}
      </div>
      {code && exchanges.length === 0 && (
        <div className="chat-start">
          <p>Что хотите узнать об эксперименте?</p>
          <Button type="button" variant="outline" size="sm" onClick={() => { send(`Что изучает ${code}?`); input.current?.focus() }}>Цель эксперимента</Button>
        </div>
      )}
      </div>
      <form className="chat-form" onSubmit={submit}>
        <textarea ref={input} rows={1} aria-label="Сообщение ассистенту" placeholder="Задать вопрос…" maxLength={1000}
          disabled={!code} value={draft} onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) return
            event.preventDefault()
            event.currentTarget.form?.requestSubmit()
          }} />
        <Button type="submit" size="icon" aria-label="Отправить сообщение" disabled={!code || !draft.trim()}><Send size={16} /></Button>
      </form>
    </section>
  )
}
