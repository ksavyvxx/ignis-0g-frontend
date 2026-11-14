import { ArrowRight, Rocket, ShieldCheck, Wind } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import { CREW_ENVIRONMENTS, type MissionScenarioId } from "@/domain/knowledge"
import type { StudySummary } from "@/domain/types"

export function EnvironmentsView({
  studies,
  onOpenScenario,
  onSelectStudy,
}: {
  studies: StudySummary[]
  onOpenScenario: (scenario: MissionScenarioId) => void
  onSelectStudy: (id: string) => void
}) {
  return (
    <div className="section-view">
      <div>
        <h1>Среды обитания экипажа и атмосфера</h1>
        <p className="muted">
          Концентрация кислорода, давление и скорость вентиляции критически меняют пределы воспламенения. Выберите среду, чтобы перейти к ранжированным исследованиям PSI.
        </p>
      </div>

      <div className="env-grid">
        {CREW_ENVIRONMENTS.map((env) => (
          <article key={env.id} className="panel panel-padding env-card">
            <div className="env-card-head">
              <Rocket size={18} />
              <div>
                <h2>{env.title}</h2>
                <span className="muted">{env.subtitle}</span>
              </div>
            </div>

            <dl className="parameters env-params">
              <div>
                <dt>Кислород (O₂)</dt>
                <dd>{env.o2}</dd>
              </div>
              <div>
                <dt>Давление</dt>
                <dd>{env.pressure}</dd>
              </div>
              <div>
                <dt>Гравитация</dt>
                <dd>{env.gravity}</dd>
              </div>
            </dl>

            <p className="env-risk">
              <ShieldCheck size={15} /> {env.riskNote}
            </p>

            <div className="env-studies">
              <span className="muted">Ключевые исследования:</span>
              <div className="hardware-links">
                {env.keyStudyIds.map((id) => {
                  const s = studies.find((item) => item.id === id)
                  if (!s) return null
                  return (
                    <button key={id} type="button" className="chip-btn" onClick={() => onSelectStudy(id)}>
                      {s.title.split(" (")[0]}
                    </button>
                  )
                })}
              </div>
            </div>

            <Button type="button" size="sm" onClick={() => onOpenScenario(env.scenarioId)}>
              Ранжировать исследования для этой среды <ArrowRight size={14} />
            </Button>
          </article>
        ))}
      </div>

      <section className="panel panel-padding">
        <h2>
          <Wind size={17} /> Почему лунная атмосфера (≥30% O₂, ≤10.2 psi) опаснее земной?
        </h2>
        <p className="study-prose">
          В скафандрах используется 100% кислород при давлении 4.3 psi. Чтобы астронавтам не требовалась длительная десатурация (вымывание азота против кессонной болезни) перед каждым выходом, в лунных базах и герметичных роверах планируется промежуточная атмосфера: концентрация O₂ 30–34% при давлении 8.2–10.2 psi. Это более чем на 40% выше земного уровня кислорода (21%), что резко снижает порог воспламенения тканей и пластиков и требует валидации через эксперименты <strong>SoFIE</strong> и <strong>ACME BRE</strong>.
        </p>
      </section>
    </div>
  )
}
