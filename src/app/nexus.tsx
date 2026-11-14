import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { studyQueries } from "@/api/queries"
import { ArrowRight, Network } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import type { Study } from "@/domain/types"
import { catalogEntry } from "@/mocks/catalog"

const connections = [
  { name: "Теплоперенос", kind: "Явление", ids: ["flex", "acme"], description: "FLEX изучает горение капель, а ACME — структуру газового пламени и перенос тепла." },
  { name: "Концентрация кислорода", kind: "Условие", ids: ["flex", "sofie"], description: "В FLEX и SoFIE исследуют влияние состава среды на горение жидкого и твёрдого топлива." },
  { name: "Поток воздуха", kind: "Условие", ids: ["bass", "saffire"], description: "BASS и SAFFIRE изучают горение материалов при заданном потоке воздуха." },
  { name: "Затухание пламени", kind: "Явление", ids: ["flex", "bass", "sofie"], description: "Эксперименты исследуют затухание пламени на разных типах топлива." },
]

function StudyFindings({ id }: { id: string }) {
  const findings = useQuery(studyQueries.findings(id))
  if (findings.isPending) return <p role="status">Загрузка выводов…</p>
  if (findings.isError) return <p role="alert">Не удалось загрузить выводы.</p>
  if (!findings.data.length) return <p className="muted">В каталоге пока нет выводов для этого исследования.</p>
  return <ul className="nexus-findings">{findings.data.map(({ id, title }) => <li key={id}>{title}</li>)}</ul>
}

export function Nexus({ studies, onStudy }: { studies: Study[]; onStudy: (id: string) => void }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [activeStudy, setActiveStudy] = useState<string>()
  const connection = connections[activeIndex]
  const connected = studies.filter(({ id }) => connection.ids.includes(id))
  const selected = connected.find(({ id }) => id === activeStudy) ?? connected[0]

  return (
    <section className="panel panel-padding nexus-panel">
      <h2><Network size={18} /> Nexus</h2>
      <p className="muted">Выберите явление или условие, чтобы увидеть связи между исследованиями.</p>
      <div className="nexus-map">
        <div className="nexus-topics" role="group" aria-label="Научные связи">
          {connections.map(({ name, kind }, index) => (
            <button type="button" key={name} aria-pressed={index === activeIndex} onClick={() => setActiveIndex(index)}>
              <small>{kind}</small>{name}
            </button>
          ))}
        </div>
        <div className="nexus-connector" aria-hidden="true"><ArrowRight size={21} /></div>
        <div className="nexus-studies" role="group" aria-label="Связанные исследования">
          {connected.map(({ id, title }) => (
            <button type="button" key={id} aria-pressed={id === selected?.id} onClick={() => setActiveStudy(id)}>
              <strong>{catalogEntry(id)?.code ?? id}</strong><small>{title}</small>
            </button>
          ))}
          {!connected.length && <p className="muted">В каталоге пока нет связанных исследований.</p>}
        </div>
      </div>
      <div className="nexus-detail" aria-live="polite">
        <p>{connection.description}</p>
        {selected && <>
          <h3>Выводы · {catalogEntry(selected.id)?.code ?? selected.title}</h3>
          <StudyFindings id={selected.id} />
          <Button variant="outline" onClick={() => onStudy(selected.id)}>Открыть исследование <ArrowRight size={15} /></Button>
        </>}
      </div>
    </section>
  )
}
