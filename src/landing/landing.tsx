import { useState } from "react"
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, FileText, Flame, FlaskConical, Network, Search } from "@/components/ui/icons"
import flame from "@/assets/flex-flame.webp"
import { catalogEntry, research } from "@/mocks/catalog"
import "./landing.css"

const features = [
  { icon: Search, title: "Find the right experiment", text: "Search the catalog by name or acronym, then narrow the results by topic and study status." },
  { icon: FileText, title: "Read the evidence", text: "See what each study tested, review its findings, and trace them back to the listed sources." },
  { icon: Network, title: "Follow related research", text: "Move between experiments that share a topic and inspect the relationships between findings." },
]

const summaries: Record<string, string> = {
  flex: "Studies how droplets of liquid fuel burn and extinguish in microgravity.",
  bass: "Examines how airflow affects burning and extinguishment in solid materials.",
  saffire: "Investigates how fire spreads in a cargo spacecraft.",
  acme: "Studies gaseous combustion, flame structure, and heat transfer in microgravity.",
  sofie: "Examines how oxygen concentration affects ignition and extinguishment in solid fuels.",
}

const topicNames = ["Microgravity", "Fuel types", "Flame extinction", "Fire spread", "Heat transfer"]

export function Landing() {
  const [selectedId, setSelectedId] = useState("flex")
  const study = research.find(({ id }) => id === selectedId) ?? research[0]
  const entry = catalogEntry(study.id)
  const explorerUrl = `/explorer?study=${encodeURIComponent(study.id)}`

  return (
    <div className="landing">
      <a className="landing-skip" href="#landing-main">Skip to content</a>
      <header className="landing-header">
        <div className="landing-container landing-header-inner">
          <a className="landing-brand" href="/" aria-label="IGNIS 0G home"><Flame size={21} /> IGNIS <span>0G</span></a>
          <nav aria-label="Main navigation"><a href="#workflow">Workflow</a><a href="#catalog">Catalog</a></nav>
          <a className="landing-button small" href="/explorer">Open explorer <ArrowUpRight size={16} /></a>
        </div>
      </header>
      <main id="landing-main">
        <section className="landing-container landing-hero" aria-labelledby="landing-title">
          <div className="landing-pitch">
            <div className="landing-category"><FlaskConical size={16} /> MICROGRAVITY RESEARCH EXPLORER</div>
            <h1 id="landing-title">Study fire<br />in <span>zero gravity.</span></h1>
            <p>Explore how flames ignite, spread, and go out in microgravity. Bring experiments, findings, and sources into one research workspace.</p>
            <div className="landing-actions">
              <a className="landing-button" href="/explorer">Open explorer <ArrowUpRight size={19} /></a>
              <a className="landing-secondary" href="#workflow">See how it works <ArrowDown size={16} /></a>
            </div>
          </div>
          <figure className="landing-figure">
            <div className="landing-figure-header"><span><FlaskConical size={15} /> COMBUSTION IN MICROGRAVITY</span><span>NASA / FLEX</span></div>
            <div className="landing-figure-image"><img src={flame} alt="Illustration of a spherical blue flame surrounding a glowing fuel droplet" fetchPriority="high" /><i aria-hidden="true" /></div>
            <figcaption><div><strong>FLEX</strong><span>Flame Extinguishment Experiment · Illustration</span></div><a href="/explorer?study=flex" aria-label="Open the FLEX experiment"><ArrowUpRight size={21} /></a></figcaption>
          </figure>
        </section>

        <section className="landing-workflow" id="workflow">
          <div className="landing-container">
            <div className="landing-section-head"><h2>From experiment<br />to evidence.</h2><p>Start with a question about combustion, then follow the findings across the catalog.</p></div>
            <div className="landing-features">{features.map(({ icon: Icon, title, text }) => <article key={title}><Icon size={23} /><h3>{title}</h3><p>{text}</p></article>)}</div>
          </div>
        </section>

        <section className="landing-container landing-catalog" id="catalog">
          <div className="landing-section-head"><h2>Browse the catalog.</h2><p>Preview one of five NASA experiments in the demo workspace.</p></div>
          <div className="landing-catalog-grid">
            <div className="landing-catalog-nav" role="group" aria-label="Choose an experiment">
              {research.map(({ id }) => <button type="button" aria-pressed={study.id === id} key={id} onClick={() => setSelectedId(id)}>{catalogEntry(id)?.code}<ArrowRight size={17} /></button>)}
            </div>
            <article className="landing-catalog-detail" aria-live="polite">
              <BookOpen size={24} />
              <h3>{study.title}</h3>
              <p>{summaries[study.id]}</p>
              <ul>{entry?.topics.map((index) => <li key={index}>{topicNames[index]}</li>)}</ul>
              <a className="landing-secondary" href={explorerUrl}>View experiment <ArrowUpRight size={17} /></a>
            </article>
          </div>
        </section>
      </main>
      <footer className="landing-footer"><div className="landing-container"><a className="landing-brand" href="/" aria-label="IGNIS 0G home"><Flame size={20} /> IGNIS <span>0G</span></a><a href="/explorer">Open explorer <ArrowUpRight size={16} /></a></div></footer>
    </div>
  )
}
