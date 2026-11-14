import { useState } from "react"
import { useQueries } from "@tanstack/react-query"
import { ApiError, api } from "@/api/client"
import { studyQueries } from "@/api/queries"
import { AlertTriangle, Cpu, GitCompare, Sparkles, X } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import { HARDWARE_RACKS, getQuickMeta } from "@/domain/knowledge"
import type { CompareResponse, StudySummary } from "@/domain/types"

function formatRange(range: unknown, unit: string) {
  if (!Array.isArray(range) || !range.length) return "н/д"
  const [min, max] = range as [number | null | undefined, number | null | undefined]
  if (min == null && max == null) return "н/д"
  if (min != null && max != null && min !== max) return `${min}–${max} ${unit}`
  return `${min ?? max} ${unit}`
}

export function CompareView({
  studies,
  compareIds,
  onSetCompareIds,
  onSelectStudy,
}: {
  studies: StudySummary[]
  compareIds: string[]
  onSetCompareIds: (ids: string[]) => void
  onSelectStudy: (id: string) => void
}) {
  const [aiResult, setAiResult] = useState<CompareResponse | null>(null)
  const [aiError, setAiError] = useState<string | null>(null)
  const [aiPending, setAiPending] = useState(false)
  const [focus, setFocus] = useState("")

  const effectiveIds = compareIds.length >= 2
    ? compareIds.slice(0, 3)
    : studies.slice(0, Math.min(2, studies.length)).map((s) => s.id)

  const detailQueries = useQueries({
    queries: effectiveIds.map((id) => studyQueries.detail(id)),
  })

  function updateSlot(index: number, nextId: string) {
    const next = [...effectiveIds]
    if (next.includes(nextId)) return
    next[index] = nextId
    onSetCompareIds(next)
    setAiResult(null)
  }

  function addThirdSlot() {
    const candidate = studies.find((s) => !effectiveIds.includes(s.id))
    if (candidate) {
      onSetCompareIds([...effectiveIds, candidate.id])
      setAiResult(null)
    }
  }

  function removeSlot(index: number) {
    if (effectiveIds.length <= 2) return
    onSetCompareIds(effectiveIds.filter((_, i) => i !== index))
    setAiResult(null)
  }

  async function runAiCompare() {
    if (effectiveIds.length < 2 || aiPending) return
    setAiPending(true)
    setAiError(null)
    try {
      const res = await api.compareStudies({
        study_ids: effectiveIds,
        focus: focus.trim() || null,
      })
      setAiResult(res)
    } catch (err) {
      setAiError(err instanceof ApiError ? err.message : "Не удалось выполнить ИИ-сравнение.")
    } finally {
      setAiPending(false)
    }
  }

  return (
    <div className="section-view">
      <div>
        <h1>Сравнение исследований и оборудование МКС</h1>
        <p className="muted">
          Сопоставьте 2–3 эксперимента по условиям атмосферы, типу топлива, переменным и применимости к пожарной безопасности, а также изучите группировку по бортовым стойкам.
        </p>
      </div>

      <section className="panel panel-padding">
        <div className="panel-head-row">
          <h2>
            <GitCompare size={17} /> Матрица сравнения ({effectiveIds.length} исследования)
          </h2>
          {effectiveIds.length < 3 && studies.length > effectiveIds.length && (
            <Button type="button" variant="outline" size="sm" onClick={addThirdSlot}>
              + Добавить 3-й эксперимент
            </Button>
          )}
        </div>

        <div className="compare-selectors">
          {effectiveIds.map((id, idx) => (
            <div key={`${id}-${idx}`} className="compare-slot">
              <select
                aria-label={`Исследование ${idx + 1}`}
                value={id}
                onChange={(e) => updateSlot(idx, e.target.value)}
              >
                {studies.map((s) => (
                  <option
                    key={s.id}
                    value={s.id}
                    disabled={effectiveIds.includes(s.id) && s.id !== id}
                  >
                    {s.title}
                  </option>
                ))}
              </select>
              {effectiveIds.length > 2 && (
                <button
                  type="button"
                  className="icon-button"
                  aria-label="Убрать из сравнения"
                  onClick={() => removeSlot(idx)}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="compare-table-wrap">
          <table className="compare-table">
            <thead>
              <tr>
                <th scope="col">Параметр</th>
                {effectiveIds.map((id, idx) => {
                  const s = studies.find((item) => item.id === id)
                  return (
                    <th key={id} scope="col">
                      <button type="button" className="compare-study-link" onClick={() => onSelectStudy(id)}>
                        {s?.title ?? id}
                      </button>
                      {detailQueries[idx]?.isPending && <small className="muted"> (загрузка…)</small>}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Программа / Pillar</th>
                {effectiveIds.map((id) => {
                  const s = studies.find((item) => item.id === id)
                  return <td key={id}>{s?.category} · {s?.tags.join(", ")}</td>
                })}
              </tr>
              <tr>
                <th scope="row">Установка (Facility)</th>
                {effectiveIds.map((id) => (
                  <td key={id}>{getQuickMeta(id)?.facility ?? "н/д"}</td>
                ))}
              </tr>
              <tr>
                <th scope="row">Топливо и размер</th>
                {effectiveIds.map((id) => {
                  const m = getQuickMeta(id)
                  return (
                    <td key={id}>
                      {m?.fuelMaterial ?? "н/д"}
                      {m?.sampleSizeMm ? ` (${m.sampleSizeMm})` : ""}
                    </td>
                  )
                })}
              </tr>
              <tr>
                <th scope="row">Кислород (O₂)</th>
                {effectiveIds.map((id, idx) => {
                  const cond = detailQueries[idx]?.data?.conditions ?? getQuickMeta(id)?.conditions
                  return <td key={id}>{formatRange(cond?.o2_pct, "%")}</td>
                })}
              </tr>
              <tr>
                <th scope="row">Давление</th>
                {effectiveIds.map((id, idx) => {
                  const cond = detailQueries[idx]?.data?.conditions ?? getQuickMeta(id)?.conditions
                  return <td key={id}>{formatRange(cond?.pressure_kpa, "кПа")}</td>
                })}
              </tr>
              <tr>
                <th scope="row">Скорость потока</th>
                {effectiveIds.map((id, idx) => {
                  const cond = detailQueries[idx]?.data?.conditions ?? getQuickMeta(id)?.conditions
                  return <td key={id}>{formatRange(cond?.flow_cms, "см/с")}</td>
                })}
              </tr>
              <tr>
                <th scope="row">Ключевой вывод</th>
                {effectiveIds.map((id, idx) => {
                  const s = studies.find((item) => item.id === id)
                  return <td key={id}>{detailQueries[idx]?.data?.description ?? s?.description ?? "—"}</td>
                })}
              </tr>
              <tr>
                <th scope="row">Пожарная безопасность</th>
                {effectiveIds.map((id, idx) => {
                  const imp = detailQueries[idx]?.data?.safety_implications[0]?.text
                  return <td key={id}>{imp ?? "см. карточку исследования"}</td>
                })}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="compare-ai-bar">
          <input
            type="text"
            placeholder="Фокус сравнения (опционально: например, лунная база 34% O₂ или датчики дыма)…"
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
          />
          <Button type="button" onClick={() => void runAiCompare()} disabled={aiPending || effectiveIds.length < 2}>
            <Sparkles size={15} /> {aiPending ? "Анализ…" : "ИИ-анализ сходств и различий"}
          </Button>
        </div>

        {aiError && <p className="query-failure">{aiError}</p>}

        {aiResult && (
          <div className="compare-ai-result">
            <h3>{aiResult.summary}</h3>
            <div className="compare-ai-cols">
              <div>
                <h4>Сходства</h4>
                <ul>
                  {aiResult.similarities.length ? (
                    aiResult.similarities.map((item, i) => <li key={i}>{item.text}</li>)
                  ) : (
                    <li className="muted">Не выявлено</li>
                  )}
                </ul>
              </div>
              <div>
                <h4>Различия</h4>
                <ul>
                  {aiResult.differences.length ? (
                    aiResult.differences.map((item, i) => <li key={i}>{item.text}</li>)
                  ) : (
                    <li className="muted">Не выявлено</li>
                  )}
                </ul>
              </div>
            </div>
            {aiResult.limitations.length > 0 && (
              <p className="muted">
                <strong>Ограничения сопоставимости:</strong> {aiResult.limitations.join(" ")}
              </p>
            )}
          </div>
        )}
      </section>

      <section className="panel panel-padding">
        <h2>
          <Cpu size={17} /> Группировка по оборудованию и стойкам (CIR, MDCA, MSG, Cygnus)
        </h2>
        <div className="hardware-grid">
          {HARDWARE_RACKS.map((rack) => (
            <article key={rack.id} className="hardware-card">
              <span className="muted">{rack.location}</span>
              <h3>{rack.title}</h3>
              <p>{rack.description}</p>
              <div className="hardware-links">
                {rack.studyIds.map((sid) => {
                  const found = studies.find((s) => s.id === sid)
                  if (!found) return null
                  return (
                    <button key={sid} type="button" className="chip-btn" onClick={() => onSelectStudy(sid)}>
                      {found.title.split(" (")[0]}
                    </button>
                  )
                })}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel panel-padding partial-gravity-note">
        <h2>
          <AlertTriangle size={17} /> Пробел данных по частичной гравитации (Луна 1/6g, Марс 3/8g)
        </h2>
        <p>
          В базе NASA PSI пока отсутствуют прямые орбитальные данные по горению при частичной гравитации (ожидаются миссии <strong>LUCI</strong> и <strong>FM2</strong>). Для оценки рисков на поверхности Луны и Марса инженеры используют верхние/нижние границы между <strong>0g</strong> и <strong>1g</strong>, а также эксперимент <strong>ACME E-FIELD Flames</strong>, имитировавший гравитационную конвекцию с помощью электрического поля.
        </p>
      </section>
    </div>
  )
}
