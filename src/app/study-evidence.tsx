import { useState } from "react"
import { ArrowUpRight, ChartNoAxesCombined, FlaskConical, ShieldCheck } from "@/components/ui/icons"

// NASA/TP–2015-216046, Table IX. Methanol tests ending in extinction,
// with 21% O₂, 79% N₂ and ambient pressure near 760 mmHg.
const flexSamples = [
  { run: "FLEX-003", diameter: 1.61, seconds: 3.2 },
  { run: "FLEX-002", diameter: 1.86, seconds: 5 },
  { run: "FLEX-005", diameter: 1.92, seconds: 6.34 },
  { run: "FLEX-004", diameter: 2.06, seconds: 7.64 },
  { run: "FLEX-006", diameter: 2.54, seconds: 9.6 },
]

const format = new Intl.NumberFormat("ru", { maximumFractionDigits: 2 })

export function StudyMeasurements({ studyId, chart = false }: { studyId: string; chart?: boolean }) {
  const hasSamples = studyId === "flex"
  const [variable, setVariable] = useState<"seconds" | "diameter">("seconds")
  const [selectedRun, setSelectedRun] = useState("")
  const samples = flexSamples.filter(({ run }) => !selectedRun || run === selectedRun)
  const axisMaximum = variable === "seconds" ? 10 : 3
  const unit = variable === "seconds" ? "с" : "мм"

  return (
    <section className="panel panel-padding measurement-panel">
      <h2>{chart ? <ChartNoAxesCombined size={17} /> : <FlaskConical size={17} />}{chart ? "Сравнение испытаний FLEX" : "Экспериментальные измерения"}</h2>
      {!hasSamples ? <p className="muted">Для этого эксперимента пока нет измерений.</p> : (
        <>
          <p className="muted">Метанол · 21% O₂, 79% N₂ · около 1 атм. Выбраны испытания, завершившиеся затуханием.</p>
          <div className="data-toolbar">
            <label>Набор данных<select defaultValue="table-ix"><option value="table-ix">NASA · Таблица IX</option></select></label>
            <label>Испытание<select value={selectedRun} onChange={(event) => setSelectedRun(event.target.value)}>
              <option value="">Все испытания</option>
              {flexSamples.map(({ run }) => <option key={run}>{run}</option>)}
            </select></label>
            {chart && <label>Переменная<select value={variable} onChange={(event) => setVariable(event.target.value === "diameter" ? "diameter" : "seconds")}>
              <option value="seconds">Время горения, с</option><option value="diameter">Начальный диаметр, мм</option>
            </select></label>}
          </div>
          {chart ? (
            <>
            <div className="measurement-axis" aria-hidden="true"><span>Серия</span><div><span>0</span><span>{format.format(axisMaximum / 2)}</span><span>{axisMaximum} {unit}</span></div></div>
            <ul className="measurement-chart" aria-label={variable === "seconds" ? "Время горения по испытаниям" : "Начальный диаметр по испытаниям"}>
              {samples.map((sample) => (
                <li key={sample.run} title={`${sample.run}: ${format.format(sample.diameter)} мм · ${format.format(sample.seconds)} с`}>
                  <span>{sample.run}</span>
                  <div className="measurement-track" aria-hidden="true"><div style={{ width: `${sample[variable] / axisMaximum * 100}%` }} /></div>
                  <strong>{format.format(sample[variable])} {unit}</strong>
                </li>
              ))}
            </ul>
            </>
          ) : (
            <table className="measurement-table">
              <thead><tr><th scope="col">Серия</th><th scope="col">Начальный диаметр, мм</th><th scope="col">Время горения, с</th></tr></thead>
              <tbody>{samples.map(({ run, diameter, seconds }) => (
                <tr key={run}><th scope="row">{run}</th><td>{format.format(diameter)}</td><td>{format.format(seconds)}</td></tr>
              ))}</tbody>
            </table>
          )}
          <a href="https://ntrs.nasa.gov/citations/20150023456" target="_blank" rel="noreferrer">Источник данных NASA <ArrowUpRight size={14} /></a>
        </>
      )}
    </section>
  )
}

const safetyTopics: Record<string, string> = {
  flex: "Условия, при которых пламя вокруг капли жидкого топлива затухает.",
  bass: "Влияние воздушного потока на горение и затухание твёрдых материалов.",
  saffire: "Распространение пламени в замкнутом объёме грузового корабля.",
  acme: "Устойчивость газового пламени и перенос тепла в микрогравитации.",
  sofie: "Влияние концентрации кислорода на воспламенение и затухание твёрдого топлива.",
}

export function StudySafety({ studyId }: { studyId: string }) {
  const topic = safetyTopics[studyId]

  return (
    <section className="panel panel-padding measurement-panel">
      <h2><ShieldCheck size={17} /> Применение к пожарной безопасности</h2>
      {topic ? <p>{topic}</p> : <p className="muted">Для этого эксперимента пока нет справки.</p>}
    </section>
  )
}

export function StudyVideo({ studyId }: { studyId: string }) {
  if (studyId !== "flex") return null

  return (
    <section className="panel panel-padding study-video">
      <h2>Видео NASA · Горение капли в микрогравитации</h2>
      <video controls playsInline preload="metadata" aria-label="Запись эксперимента FLEX от NASA">
        <source src="/media/nasa-flex.mp4" type="video/mp4" />
      </video>
      <a href="https://svs.gsfc.nasa.gov/11318/" target="_blank" rel="noreferrer">Оригинал и описание на NASA SVS <ArrowUpRight size={14} /></a>
    </section>
  )
}
