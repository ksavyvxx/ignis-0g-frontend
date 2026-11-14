import { useMemo, useState } from "react"
import { ArrowRight, GitCompare, Search, ShieldCheck, Sparkles } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import {
  MISSION_SCENARIOS,
  getQuickMeta,
  scoreStudyForScenario,
  type MissionScenarioId,
} from "@/domain/knowledge"
import type { StudySummary } from "@/domain/types"

const pillars = ["Все", "Prevention", "Detection", "Suppression", "Fundamental", "Reference"] as const

export function RankingDashboard({
  studies,
  scenario,
  onScenarioChange,
  compareIds,
  onToggleCompare,
  onSelectStudy,
  onOpenCompare,
}: {
  studies: StudySummary[]
  scenario: MissionScenarioId
  onScenarioChange: (scenario: MissionScenarioId) => void
  compareIds: string[]
  onToggleCompare: (id: string) => void
  onSelectStudy: (id: string) => void
  onOpenCompare: () => void
}) {
  const [pillar, setPillar] = useState<string>("Все")
  const [program, setProgram] = useState<string>("Все")
  const [query, setQuery] = useState("")

  const programs = useMemo(() => {
    return ["Все", ...Array.from(new Set(studies.map((s) => s.category))).sort()]
  }, [studies])

  const activeScenario = MISSION_SCENARIOS.find((s) => s.id === scenario) ?? MISSION_SCENARIOS[0]

  const ranked = useMemo(() => {
    const q = query.trim().toLowerCase()
    return studies
      .filter((study) => {
        if (program !== "Все" && study.category !== program) return false
        if (pillar !== "Все" && !study.tags.some((t) => t.toLowerCase().includes(pillar.toLowerCase()))) return false
        if (q) {
          const meta = getQuickMeta(study.id)
          const hay = `${study.id} ${study.title} ${study.description} ${study.category} ${study.tags.join(" ")} ${meta?.facility ?? ""} ${meta?.fuelMaterial ?? ""}`.toLowerCase()
          if (!hay.includes(q)) return false
        }
        return true
      })
      .map((study) => ({
        study,
        meta: getQuickMeta(study.id),
        ranking: scoreStudyForScenario(study, scenario),
      }))
      .sort((a, b) => b.ranking.score - a.ranking.score || a.study.title.localeCompare(b.study.title))
  }, [studies, scenario, pillar, program, query])

  return (
    <div className="section-view">
      <div className="dashboard-hero">
        <div>
          <span className="eyebrow-tag">NASA PSI · Fire Safety Intelligence</span>
          <h1>Дашборд и ранжирование исследований</h1>
          <p className="muted">
            Выберите целевую среду или инженерную задачу, чтобы отранжировать эксперименты NASA PSI по релевантности, сравнить условия среды и извлечь данные для моделей.
          </p>
        </div>
        {compareIds.length >= 2 && (
          <Button type="button" onClick={onOpenCompare}>
            <GitCompare size={16} /> Сравнить выбранные ({compareIds.length})
          </Button>
        )}
      </div>

      <section className="panel panel-padding scenario-panel" aria-label="Сценарий миссии">
        <div className="scenario-header">
          <h2>
            <Sparkles size={17} /> Целевой сценарий ранжирования
          </h2>
          <span className="scenario-atmo">{activeScenario.targetAtmosphere}</span>
        </div>
        <div className="scenario-pills" role="group" aria-label="Выбор сценария">
          {MISSION_SCENARIOS.map((item) => (
            <button
              key={item.id}
              type="button"
              className="scenario-pill"
              aria-pressed={scenario === item.id}
              onClick={() => onScenarioChange(item.id)}
            >
              {item.shortLabel}
            </button>
          ))}
        </div>
        <p className="muted">{activeScenario.description}</p>
      </section>

      <section className="filter-bar" aria-label="Фильтры каталога">
        <label className="search-field ranking-search">
          <Search size={15} />
          <input
            type="search"
            placeholder="Поиск по эксперименту, топливу, установке (CIR, MSG, Cygnus)…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <div className="pillar-pills" role="group" aria-label="Направление безопасности">
          {pillars.map((p) => (
            <button
              key={p}
              type="button"
              className="chip-btn"
              aria-pressed={pillar === p}
              onClick={() => setPillar(p)}
            >
              {p}
            </button>
          ))}
        </div>
        <select
          aria-label="Программа NASA"
          className="program-select"
          value={program}
          onChange={(e) => setProgram(e.target.value)}
        >
          {programs.map((prog) => (
            <option key={prog} value={prog}>
              {prog === "Все" ? "Все программы" : prog}
            </option>
          ))}
        </select>
      </section>

      <div className="ranking-summary muted">
        Найдено исследований: <strong>{ranked.length}</strong> · Сортировка по релевантности для сценария «{activeScenario.shortLabel}»
      </div>

      <div className="ranking-grid">
        {ranked.map(({ study, meta, ranking }, index) => {
          const isCompared = compareIds.includes(study.id)
          const o2 = meta?.conditions.o2_pct
          const p = meta?.conditions.pressure_kpa
          const o2Label = o2 && o2[0] != null ? `${o2[0]}–${o2[1] ?? o2[0]}% O₂` : null
          const pLabel = p && p[0] != null ? `${p[0]}–${p[1] ?? p[0]} кПа` : null

          return (
            <article key={study.id} className="panel ranking-card">
              <div className="ranking-card-top">
                <div className="ranking-badges">
                  <span className="rank-index">#{index + 1}</span>
                  <span className="badge-program">{study.category}</span>
                  {study.tags.map((t) => (
                    <span key={t} className="badge-pillar">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="relevance-meter" title="Индекс релевантности выбранному сценарию">
                  <span>{ranking.score}%</span>
                  <div className="relevance-bar">
                    <div style={{ width: `${ranking.score}%` }} />
                  </div>
                </div>
              </div>

              <h3>
                <button type="button" className="card-title-btn" onClick={() => onSelectStudy(study.id)}>
                  {study.title}
                </button>
              </h3>
              <p className="ranking-desc">{study.description}</p>

              <div className="ranking-reason">
                <ShieldCheck size={14} />
                <span>{ranking.reasons[0]}</span>
              </div>

              <div className="ranking-meta-chips">
                {meta?.facility && <span>{meta.facility}</span>}
                {o2Label && <span>{o2Label}</span>}
                {pLabel && <span>{pLabel}</span>}
              </div>

              <div className="ranking-card-actions">
                <Button type="button" size="sm" onClick={() => onSelectStudy(study.id)}>
                  Открыть карточку <ArrowRight size={14} />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={isCompared ? "default" : "outline"}
                  onClick={() => onToggleCompare(study.id)}
                >
                  <GitCompare size={14} /> {isCompared ? "В сравнении" : "Сравнить"}
                </Button>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
