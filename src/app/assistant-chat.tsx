import { useEffect, useRef, useState, type FormEvent } from "react"
import { ArrowUpRight, Send, Sparkles } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import type { Study } from "@/domain/types"
import { catalogEntry } from "@/mocks/catalog"

const nasaOverview = "https://www.nasa.gov/missions/station/iss-research/studying-combustion-and-fire-safety/"
const nasaStudies: Record<string, string> = {
  flex: "https://psi.nasa.gov/physci/repo/data/investigations/PSI-69",
  acme: "https://science.nasa.gov/mission/acme/",
}

type Exchange = { question: string; answer: string; source: string; sourceTitle: string }

export function useStudyChat(study?: Study) {
  const [history, setHistory] = useState<Record<string, Exchange[]>>({})
  const code = study && (catalogEntry(study.id)?.code ?? study.title)
  const exchanges = study ? history[study.id] ?? [] : []

  function send(question: string) {
    const text = question.trim()
    if (!study || !text) return
    const source = nasaStudies[study.id]
    const overviewQuestion = /что изучает|цель|о ч[её]м|расскажи|предмет/i.test(text)
    const sourceQuestion = /источник|ссылк|nasa/i.test(text)
    const answer = overviewQuestion ? study.summary
      : sourceQuestion ? `Материалы NASA по теме исследования ${code} доступны по ссылке ниже.`
      : "Для этого вопроса в демо-чате пока нет ответа. Попробуйте спросить о цели исследования или запросить источник NASA."
    const exchange = {
      question: text,
      answer,
      source: source ?? nasaOverview,
      sourceTitle: source ? `NASA · ${code}` : "NASA · Горение и пожарная безопасность",
    }
    setHistory((previous) => ({
      ...previous,
      [study.id]: [...(previous[study.id] ?? []), exchange],
    }))
  }

  return { code, exchanges, send }
}

export function AssistantChat({ chat }: { chat: ReturnType<typeof useStudyChat> }) {
  const [draft, setDraft] = useState("")
  const log = useRef<HTMLDivElement>(null)
  const { code, exchanges, send } = chat

  useEffect(() => {
    if (log.current) log.current.scrollTop = log.current.scrollHeight
  }, [exchanges.length])

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    send(draft)
    setDraft("")
  }

  return (
    <section className="panel panel-padding assistant">
      <h2><Sparkles size={17} /> ИИ-ассистент <span className="local-tag">Демо</span></h2>
      {code ? <p className="muted">Контекст · {code}</p> : <p className="muted">Выберите исследование, чтобы начать чат.</p>}
      <div className="chat-log" role="log" aria-label="История сообщений" ref={log} tabIndex={exchanges.length ? 0 : undefined}>
        {exchanges.map(({ question, answer, source, sourceTitle }, index) => (
          <div className="chat-exchange" key={index}>
            <p className="chat-message chat-question"><strong>Вы</strong>{question}</p>
            <div className="chat-message"><strong>Ассистент</strong><p>{answer}</p>
              <a href={source} target="_blank" rel="noreferrer">{sourceTitle} <ArrowUpRight size={13} /></a>
            </div>
          </div>
        ))}
      </div>
      {code && exchanges.length === 0 && (
        <Button type="button" variant="outline" size="sm" onClick={() => send(`Что изучает ${code}?`)}>Что изучает {code}?</Button>
      )}
      <form className="chat-form" onSubmit={submit}>
        <input aria-label="Сообщение ассистенту" placeholder="Вопрос об исследовании…" maxLength={1000} disabled={!code} value={draft} onChange={(event) => setDraft(event.target.value)} />
        <Button type="submit" size="icon" aria-label="Отправить сообщение" disabled={!code || !draft.trim()}><Send size={16} /></Button>
      </form>
    </section>
  )
}
