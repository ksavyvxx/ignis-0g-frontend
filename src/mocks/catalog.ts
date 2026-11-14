import type { Study } from "@/domain/types"

export const topics = [
  "Микрогравитация", "Типы топлива", "Затухание пламени", "Распространение огня", "Теплоперенос",
] as const

export const catalog = {
  flex: { code: "FLEX", topics: [0, 1, 2], subject: "Капельное горение", facility: "МКС · CIR" },
  bass: { code: "BASS", topics: [0, 3], subject: "Твёрдые материалы", facility: "МКС · MSG" },
  saffire: { code: "SAFFIRE", topics: [3, 4], subject: "Распространение пламени", facility: "Cygnus" },
  acme: { code: "ACME", topics: [0, 4], subject: "Газовое пламя", facility: "МКС · CIR" },
  sofie: { code: "SoFIE", topics: [1, 2, 3], subject: "Воспламенение твёрдых материалов", facility: "МКС · CIR" },
} satisfies Record<string, { code: string; topics: number[]; subject: string; facility: string }>

export function catalogEntry(id: string) {
  return catalog[id as keyof typeof catalog]
}

export const research: Study[] = [
  {id:"flex", title:"Flame Extinguishment Experiment", summary:"Изучение горения и затухания капель жидкого топлива в условиях микрогравитации.", status:"completed", createdAt:"2026-11-01T09:00:00Z"},
  {id:"bass", title:"Burning and Suppression of Solids", summary:"Изучение горения твёрдых материалов и влияния воздушного потока на затухание пламени.", status:"completed", createdAt:"2026-11-02T09:00:00Z"},
  {id:"saffire", title:"Spacecraft Fire Experiment", summary:"Изучение распространения огня на борту грузового корабля и условий пожарной безопасности.", status:"completed", createdAt:"2026-11-03T09:00:00Z"},
  {id:"acme", title:"Advanced Combustion via Microgravity Experiments", summary:"Серия экспериментов по газовому горению, структуре пламени и переносу тепла.", status:"completed", createdAt:"2026-11-04T09:00:00Z"},
  {id:"sofie", title:"Solid Fuel Ignition and Extinction", summary:"Изучение воспламенения и затухания твёрдых образцов при разной концентрации кислорода.", status:"in_progress", createdAt:"2026-11-05T09:00:00Z"},
]
