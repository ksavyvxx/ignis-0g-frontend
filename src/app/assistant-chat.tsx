import { useEffect, useRef, useState, type FormEvent } from "react"
import { ArrowUpRight, Bot, Send, Sparkles } from "@/components/ui/icons"
import { ApiError, api } from "@/api/client"
import { Button } from "@/components/ui/button"
import type { ChatMessage, ChatResponse, Citation, StudySummary } from "@/domain/types"

interface Exchange {
  question: string
  response?: ChatResponse
  error?: string
}

export function useStudyChat(study: StudySummary | undefined) {
  const [scope, setScope] = useState<"study" | "global">(study ? "study" : "global")
  const [historyByScope, setHistoryByScope] = useState<Record<string, Exchange[]>>({})
  const [pending, setPending] = useState(false)

  const activeKey = scope === "study" && study ? `study:${study.id}` : "global"
  const exchanges = historyByScope[activeKey] ?? []

  useEffect(() => {
    if (!study && scope === "study") setScope("global")
  }, [study, scope])

  async function send(question: string) {
    const text = question.trim()
    if (!text || pending) return
    const targetScope = scope === "study" && study ? "study" : "global"
    const key = targetScope === "study" && study ? `study:${study.id}` : "global"
    const prior = historyByScope[key] ?? []

    const chatHistory: ChatMessage[] = []
    for (const ex of prior.slice(-6)) {
      if (ex.response) {
        chatHistory.push({ role: "user", content: ex.question.slice(0, 2000) })
        chatHistory.push({ role: "assistant", content: ex.response.answer.slice(0, 2000) })
      }
    }

    setHistoryByScope((prev) => ({
      ...prev,
      [key]: [...(prev[key] ?? []), { question: text }],
    }))
    setPending(true)

    try {
      const response = await api.askAssistant({
        message: text,
        study_id: targetScope === "study" && study ? study.id : null,
        history: chatHistory,
        scope: targetScope,
      })
      setHistoryByScope((prev) => {
        const list = [...(prev[key] ?? [])]
        list[list.length - 1] = { question: text, response }
        return { ...prev, [key]: list }
      })
    } catch (err) {
      let msg = "Не удалось получить ответ от ИИ-ассистента."
      if (err instanceof ApiError) {
        if (err.status === 429) {
          msg = `Превышен лимит запросов.${err.retryAfter ? ` Повторите через ${err.retryAfter} с.` : ""}`
        } else if (err.status === 503) {
          msg = "Сервис ИИ временно недоступен (503)."
        } else if (err.status === 504) {
          msg = "Превышено время ожидания ответа ИИ (504)."
        } else {
          msg = err.message
        }
      }
      setHistoryByScope((prev) => {
        const list = [...(prev[key] ?? [])]
        list[list.length - 1] = { question: text, error: msg }
        return { ...prev, [key]: list }
      })
    } finally {
      setPending(false)
    }
  }

  function clear() {
    setHistoryByScope((prev) => ({ ...prev, [activeKey]: [] }))
  }

  return {
    scope,
    setScope,
    study,
    exchanges,
    pending,
    send,
    clear,
  }
}

function CitationList({ citations }: { citations: Citation[] }) {
  if (!citations.length) return null
  return (
    <div className="chat-citations">
      {citations.map((c, idx) => (
        <details key={`${c.chunk_id}-${idx}`}>
          <summary>
            [{idx + 1}] {c.title}
            {c.locator ? ` · ${c.locator}` : ""}
          </summary>
          <p>{c.excerpt}</p>
          <a href={c.url} target="_blank" rel="noreferrer">
            Открыть источник <ArrowUpRight size={13} />
          </a>
        </details>
      ))}
    </div>
  )
}

export function AssistantChat({
  chat,
  onOpenPage,
  onSelectStudy,
}: {
  chat: ReturnType<typeof useStudyChat>
  onOpenPage?: () => void
  onSelectStudy?: (id: string) => void
}) {
  const [draft, setDraft] = useState("")
  const log = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLTextAreaElement>(null)
  const { scope, setScope, study, exchanges, pending, send, clear } = chat

  useEffect(() => {
    if (log.current) log.current.scrollTop = log.current.scrollHeight
  }, [exchanges.length, pending])

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!draft.trim() || pending) return
    void send(draft)
    setDraft("")
    input.current?.focus()
  }

  const suggestions =
    scope === "study" && study
      ? [
          `Какие основные выводы в ${study.title.split(" (")[0]}?`,
          `Какие условия O₂, давления и оборудования использовались?`,
          `Как результаты применимы к лунной базе (34% O₂)?`,
        ]
      : [
          "Какие эксперименты PSI наиболее важны для лунной базы (≥30% O₂)?",
          "Как микрогравитация влияет на датчики дыма (SAME)?",
          "Почему стандарт NASA-STD-6001 Test 1 не всегда консервативен в 0g?",
        ]

  return (
    <section className="panel panel-padding assistant">
      <div className="assistant-heading">
        <h2>
          <Bot size={20} /> ИИ-ассистент PSI
        </h2>
        <div className="assistant-head-actions">
          {exchanges.length > 0 && (
            <button type="button" className="chip-btn" onClick={clear}>
              Очистить
            </button>
          )}
          {onOpenPage && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Открыть страницу ассистента"
              title="Развернуть на весь экран"
              onClick={onOpenPage}
            >
              <ArrowUpRight size={18} />
            </Button>
          )}
        </div>
      </div>

      <div className="assistant-scope-toggle" role="group" aria-label="Область поиска ассистента">
        <button
          type="button"
          disabled={!study}
          aria-pressed={scope === "study"}
          onClick={() => setScope("study")}
        >
          {study ? study.category : "Исследование"}
        </button>
        <button
          type="button"
          aria-pressed={scope === "global"}
          onClick={() => setScope("global")}
        >
          Весь каталог PSI
        </button>
      </div>

      {scope === "study" && study && (
        <p className="assistant-study">
          Контекст: <strong>{study.title}</strong>
        </p>
      )}

      <div className="chat-body" ref={log}>
        <div className="chat-log" role="log" aria-label="История сообщений" tabIndex={exchanges.length ? 0 : undefined}>
          {exchanges.map(({ question, response, error }, index) => (
            <div className="chat-exchange" key={index}>
              <p className="chat-message chat-question">
                <strong>Вы</strong>
                {question}
              </p>
              {!response && !error && (
                <div className="chat-message">
                  <strong>Поиск по источникам NASA…</strong>
                  <p className="muted">Формирую ответ с цитатами…</p>
                </div>
              )}
              {error && (
                <div className="chat-message chat-error">
                  <strong>Ошибка запроса</strong>
                  <p>{error}</p>
                </div>
              )}
              {response && (
                <div className="chat-message">
                  <strong>
                    {response.status === "insufficient_evidence"
                      ? "Недостаточно данных в источниках"
                      : "Ответ по базе PSI"}
                  </strong>
                  <p>{response.answer}</p>
                  <CitationList citations={response.citations} />
                  {response.related_study_ids.length > 0 && onSelectStudy && (
                    <div className="chat-related-studies">
                      <span>Связанные:</span>
                      {response.related_study_ids.map((id) => (
                        <button key={id} type="button" className="chip-btn" onClick={() => onSelectStudy(id)}>
                          {id}
                        </button>
                      ))}
                    </div>
                  )}
                  {response.suggested_questions.length > 0 && (
                    <div className="chat-followups">
                      {response.suggested_questions.map((sq) => (
                        <button key={sq} type="button" onClick={() => void send(sq)}>
                          <Sparkles size={12} /> {sq}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {exchanges.length === 0 && (
          <div className="chat-start">
            <p>Быстрые вопросы по базе NASA PSI</p>
            <div className="chat-suggestions">
              {suggestions.map((q) => (
                <Button
                  key={q}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    void send(q)
                    input.current?.focus()
                  }}
                >
                  {q}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <form className="chat-form" onSubmit={submit}>
        <textarea
          ref={input}
          rows={1}
          aria-label="Сообщение ассистенту"
          placeholder={
            scope === "study" && study
              ? `Спросить о ${study.title.split(" (")[0]}…`
              : "Спросить по всему каталогу PSI…"
          }
          maxLength={2000}
          disabled={pending}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) return
            event.preventDefault()
            event.currentTarget.form?.requestSubmit()
          }}
        />
        <Button type="submit" size="icon" aria-label="Отправить сообщение" disabled={pending || !draft.trim()}>
          <Send size={16} />
        </Button>
      </form>
    </section>
  )
}
