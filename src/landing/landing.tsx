import { ArrowDown, ArrowRight, FileText, Network, Search } from "@/components/ui/icons"
import flame from "@/assets/flex-flame.webp"
import { catalogEntry, research } from "@/mocks/catalog"
import "./landing.css"

const features = [
  { icon: Search, title: "Find the right experiment", text: "Search by name or acronym, or narrow the catalog by topic." },
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

export function Landing() {
  return (
    <div className="landing">
      <a className="landing-skip" href="#landing-main">Skip to content</a>
      <header className="landing-header">
        <div className="landing-container landing-header-inner">
          <a className="landing-brand" href="/" aria-label="IGNIS 0G home">IGNIS <span>0G</span></a>
          <nav aria-label="Main navigation"><a href="#workflow">Workflow</a><a href="#catalog">Catalog</a></nav>
          <a className="landing-button small" href="/explorer">Open explorer <ArrowRight size={16} /></a>
        </div>
      </header>
      <main id="landing-main">
        <section className="landing-hero" aria-labelledby="landing-title">
          <div className="landing-container landing-hero-inner">
            <div className="landing-pitch">
              <h1 id="landing-title">How fire behaves in microgravity</h1>
              <p>In orbit, a flame can form a sphere around a single droplet of fuel. Explore NASA experiments on how flames take shape, spread, and go out.</p>
              <div className="landing-actions">
                <a className="landing-button" href="/explorer">Open explorer <ArrowRight size={19} /></a>
                <a className="landing-secondary" href="#catalog">Browse experiments <ArrowDown size={16} /></a>
              </div>
            </div>
            <figure className="landing-banner">
              <img src={flame} alt="Illustration of a spherical blue flame surrounding a glowing fuel droplet" fetchPriority="high" />
              <figcaption><a href="/explorer?study=flex">FLEX · Flame illustration <ArrowRight size={15} /></a></figcaption>
            </figure>
          </div>
        </section>

        <section className="landing-workflow" id="workflow">
          <div className="landing-container">
            <div className="landing-section-head"><h2>From experiment to evidence</h2><p>Use the explorer to move from a research question to the experiments and sources that address it.</p></div>
            <div className="landing-features">{features.map(({ icon: Icon, title, text }) => <article key={title}><Icon size={23} /><h3>{title}</h3><p>{text}</p></article>)}</div>
          </div>
        </section>

        <section className="landing-container landing-catalog" id="catalog" aria-labelledby="catalog-title">
          <h2 id="catalog-title">NASA experiment catalog</h2>
          <p className="landing-section-intro">From a single droplet to a fire aboard a spacecraft. Choose an experiment to explore its findings and available data.</p>
          <ul className="landing-experiments">
            {research.map(({ id, title }) => (
              <li key={id}>
                <a href={`/explorer?study=${encodeURIComponent(id)}`}>
                  <span className="experiment-code">{catalogEntry(id)?.code ?? id}</span>
                  <span><strong>{title}</strong><span className="experiment-summary">{summaries[id]}</span></span>
                  <ArrowRight size={18} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <footer className="landing-footer"><div className="landing-container"><a className="landing-brand" href="/" aria-label="IGNIS 0G home">IGNIS <span>0G</span></a><a href="/explorer">Open explorer <ArrowRight size={16} /></a></div></footer>
    </div>
  )
}
