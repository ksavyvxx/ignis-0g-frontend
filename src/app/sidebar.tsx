import {
  Bot,
  FlaskConical,
  GitCompare,
  Layers3,
  Rocket,
  Search,
  Settings,
} from "@/components/ui/icons"
import { useMocks } from "@/api/client"

export const sections = [
  { name: "Дашборд и рейтинг", label: "Главная", icon: Layers3 },
  { name: "Исследования", label: "Исследования", icon: FlaskConical },
  { name: "Сравнение и установки", label: "Сравнение", icon: GitCompare },
  { name: "Среды обитания", label: "Среды О₂", icon: Rocket },
] as const

export type Section = (typeof sections)[number]["name"] | "ИИ-ассистент" | "Настройки"

interface SidebarProps {
  studiesCount: number
  section: Section
  compareCount: number
  onSection: (section: Section) => void
  onOpenSearch: () => void
}

export function Sidebar({
  studiesCount,
  section,
  compareCount,
  onSection,
  onOpenSearch,
}: SidebarProps) {
  return (
    <aside className="sidebar" aria-label="Навигация">
      <div className="sidebar-brand-row">
        <a className="workspace-title" href="/">
          <img src="/ignis-logo.png" alt="" className="brand-logo-img" />
          <span className="brand-wordmark">
            <span className="brand-ignis">Ignis</span>{" "}
            <span className="brand-zero-g">0g</span>
          </span>
        </a>
        <span className="brand-sub">NASA PSI</span>
      </div>

      <button type="button" className="sidebar-primary-cta" onClick={onOpenSearch}>
        <Search size={16} />
        <span>Быстрый поиск</span>
        <kbd>Ctrl K</kbd>
      </button>

      <div className="sidebar-quick-pair">
        <button type="button" onClick={() => onSection("Сравнение и установки")}>
          <GitCompare size={15} />
          <span>Сравнить{compareCount ? ` (${compareCount})` : ""}</span>
        </button>
        <button type="button" onClick={() => onSection("Среды обитания")}>
          <Rocket size={15} />
          <span>Среды О₂</span>
        </button>
      </div>

      <div className="sidebar-group-label">НАВИГАЦИЯ</div>
      <nav aria-label="Разделы" className="side-nav">
        {sections.map(({ name, label, icon: Icon }) => (
          <button
            key={name}
            type="button"
            aria-current={section === name ? "page" : undefined}
            onClick={() => onSection(name)}
          >
            <Icon size={17} />
            <span>{label}</span>
            {name === "Исследования" && studiesCount > 0 && (
              <span className="nav-count-muted">{studiesCount}</span>
            )}
            {name === "Сравнение и установки" && compareCount > 0 && (
              <span className="nav-count">{compareCount}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-group-label">ИНСТРУМЕНТЫ</div>
      <nav className="side-nav side-nav-compact" aria-label="Инструменты">
        <button
          type="button"
          aria-current={section === "ИИ-ассистент" ? "page" : undefined}
          onClick={() => onSection("ИИ-ассистент")}
        >
          <Bot size={17} />
          <span>ИИ-ассистент</span>
        </button>
        <button
          type="button"
          aria-current={section === "Настройки" ? "page" : undefined}
          onClick={() => onSection("Настройки")}
        >
          <Settings size={17} />
          <span>Настройки</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-avatar">PSI</div>
        <div className="sidebar-footer-info">
          <strong>{useMocks ? "Локальный каталог" : "FastAPI v1"}</strong>
          <small>{studiesCount} исследований</small>
        </div>
      </div>
    </aside>
  )
}
