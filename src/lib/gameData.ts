// ─── TYPES ───────────────────────────────────────────────────────────────────

export interface ItemDef {
  name: string
  nameEs: string
  icon: string
  cat: 'raw' | 'ingot' | 'part'
}

export interface BuildingDef {
  name: string
  nameEs: string
  power: number
  icon: string
}

export interface RecipeIO {
  item: string
  qty: number
}

export interface RecipeDef {
  name: string
  nameEs: string
  building: string
  time: number // seconds per cycle
  inputs: RecipeIO[]
  outputs: RecipeIO[]
  alternate?: boolean
}

export interface BeltTier {
  mk: number
  rate: number
}

export interface MinerTier {
  mk: number
  rate: number
}

export interface ElevatorItem {
  item: string
  qty: number
}

export interface Milestone {
  name: string
  nameEs: string
  items: ElevatorItem[]
  isMilestone?: boolean
}

export interface ElevatorPhase {
  phase: number
  name: string
  nameEs: string
  tiers: string
  color: string
  milestones: Milestone[]
}

// ─── ITEMS ───────────────────────────────────────────────────────────────────

export const ITEMS: Record<string, ItemDef> = {
  IronOre:           { name: 'Iron Ore',                nameEs: 'Mineral de Hierro',       icon: 'Iron_Ore',                cat: 'raw'  },
  IronIngot:         { name: 'Iron Ingot',               nameEs: 'Lingote de Hierro',        icon: 'Iron_Ingot',              cat: 'ingot' },
  IronPlate:         { name: 'Iron Plate',               nameEs: 'Placa de Hierro',          icon: 'Iron_Plate',              cat: 'part' },
  IronRod:           { name: 'Iron Rod',                 nameEs: 'Varilla de Hierro',        icon: 'Iron_Rod',                cat: 'part' },
  Screw:             { name: 'Screw',                    nameEs: 'Tornillo',                 icon: 'Screw',                   cat: 'part' },
  ReinforcedPlate:   { name: 'Reinforced Iron Plate',    nameEs: 'Placa Reforzada',          icon: 'Reinforced_Iron_Plate',   cat: 'part' },
  CopperOre:         { name: 'Copper Ore',               nameEs: 'Mineral de Cobre',         icon: 'Copper_Ore',              cat: 'raw'  },
  CopperIngot:       { name: 'Copper Ingot',             nameEs: 'Lingote de Cobre',         icon: 'Copper_Ingot',            cat: 'ingot' },
  Wire:              { name: 'Wire',                     nameEs: 'Cable',                    icon: 'Wire',                    cat: 'part' },
  Cable:             { name: 'Cable',                    nameEs: 'Cable Eléctrico',          icon: 'Cable',                   cat: 'part' },
  Limestone:         { name: 'Limestone',                nameEs: 'Caliza',                   icon: 'Limestone',               cat: 'raw'  },
  Concrete:          { name: 'Concrete',                 nameEs: 'Hormigón',                 icon: 'Concrete',                cat: 'part' },
  Coal:              { name: 'Coal',                     nameEs: 'Carbón',                   icon: 'Coal',                    cat: 'raw'  },
  SteelIngot:        { name: 'Steel Ingot',              nameEs: 'Lingote de Acero',         icon: 'Steel_Ingot',             cat: 'ingot' },
  SteelBeam:         { name: 'Steel Beam',               nameEs: 'Viga de Acero',            icon: 'Steel_Beam',              cat: 'part' },
  SteelPipe:         { name: 'Steel Pipe',               nameEs: 'Tubería de Acero',         icon: 'Steel_Pipe',              cat: 'part' },
  Rotor:             { name: 'Rotor',                    nameEs: 'Rotor',                    icon: 'Rotor',                   cat: 'part' },
  Stator:            { name: 'Stator',                   nameEs: 'Estátor',                  icon: 'Stator',                  cat: 'part' },
  Motor:             { name: 'Motor',                    nameEs: 'Motor',                    icon: 'Motor',                   cat: 'part' },
  ModularFrame:      { name: 'Modular Frame',            nameEs: 'Marco Modular',            icon: 'Modular_Frame',           cat: 'part' },
  HeavyModularFrame: { name: 'Heavy Modular Frame',      nameEs: 'Marco Modular Pesado',     icon: 'Heavy_Modular_Frame',     cat: 'part' },
  EncasedBeam:       { name: 'Encased Industrial Beam',  nameEs: 'Viga Industrial Blindada', icon: 'Encased_Industrial_Beam', cat: 'part' },
  Quickwire:         { name: 'Quickwire',                nameEs: 'Cable Rápido',             icon: 'Quickwire',               cat: 'part' },
  CateriumIngot:     { name: 'Caterium Ingot',           nameEs: 'Lingote de Caterio',       icon: 'Caterium_Ingot',          cat: 'ingot' },
  CateriumOre:       { name: 'Caterium Ore',             nameEs: 'Mineral de Caterio',       icon: 'Caterium_Ore',            cat: 'raw'  },
  AILimiter:         { name: 'AI Limiter',               nameEs: 'Limitador IA',             icon: 'AI_Limiter',              cat: 'part' },
  CircuitBoard:      { name: 'Circuit Board',            nameEs: 'Placa de Circuito',        icon: 'Circuit_Board',           cat: 'part' },
  Computer:          { name: 'Computer',                 nameEs: 'Ordenador',                icon: 'Computer',                cat: 'part' },
  Silica:            { name: 'Silica',                   nameEs: 'Sílice',                   icon: 'Silica',                  cat: 'part' },
  RawQuartz:         { name: 'Raw Quartz',               nameEs: 'Cuarzo en Bruto',          icon: 'Raw_Quartz',              cat: 'raw'  },
}

// ─── BUILDINGS ───────────────────────────────────────────────────────────────

export const BUILDINGS: Record<string, BuildingDef> = {
  Smelter:      { name: 'Smelter',      nameEs: 'Fundidora',   power: 4,  icon: '🏭' },
  Constructor:  { name: 'Constructor',  nameEs: 'Constructor', power: 4,  icon: '🔧' },
  Assembler:    { name: 'Assembler',    nameEs: 'Ensamblador', power: 15, icon: '⚙️' },
  Manufacturer: { name: 'Manufacturer', nameEs: 'Fabricante',  power: 55, icon: '🏗️' },
  Foundry:      { name: 'Foundry',      nameEs: 'Fundición',   power: 16, icon: '🔥' },
}

// ─── RECIPES ─────────────────────────────────────────────────────────────────

export const RECIPES: Record<string, RecipeDef> = {
  // Iron
  SmeltIron:      { name: 'Smelt Iron',                    nameEs: 'Fundir Hierro',               building: 'Smelter',      time: 2,  inputs: [{item:'IronOre',qty:1}],                                          outputs: [{item:'IronIngot',qty:1}] },
  MakeIronPlate:  { name: 'Iron Plate',                    nameEs: 'Placa de Hierro',             building: 'Constructor',  time: 6,  inputs: [{item:'IronIngot',qty:3}],                                        outputs: [{item:'IronPlate',qty:2}] },
  MakeIronRod:    { name: 'Iron Rod',                      nameEs: 'Varilla de Hierro',           building: 'Constructor',  time: 4,  inputs: [{item:'IronIngot',qty:1}],                                        outputs: [{item:'IronRod',qty:1}] },
  MakeScrew:      { name: 'Screw',                         nameEs: 'Tornillo',                    building: 'Constructor',  time: 6,  inputs: [{item:'IronRod',qty:1}],                                          outputs: [{item:'Screw',qty:4}] },
  MakeScrewAlt:   { name: 'Cast Screw (ALT)',              nameEs: 'Tornillo Fundido (ALT)',       building: 'Constructor',  time: 24, inputs: [{item:'IronIngot',qty:5}],                                        outputs: [{item:'Screw',qty:20}], alternate: true },
  MakeReinforced: { name: 'Reinforced Iron Plate',         nameEs: 'Placa Reforzada',             building: 'Assembler',    time: 12, inputs: [{item:'IronPlate',qty:6},{item:'Screw',qty:12}],                  outputs: [{item:'ReinforcedPlate',qty:1}] },
  MakeReinfAlt:   { name: 'Stitched Iron Plate (ALT)',     nameEs: 'Placa de Hierro Cosida (ALT)',building: 'Assembler',    time: 32, inputs: [{item:'IronPlate',qty:10},{item:'Wire',qty:20}],                  outputs: [{item:'ReinforcedPlate',qty:3}], alternate: true },
  // Copper
  SmeltCopper:    { name: 'Smelt Copper',                  nameEs: 'Fundir Cobre',                building: 'Smelter',      time: 2,  inputs: [{item:'CopperOre',qty:1}],                                        outputs: [{item:'CopperIngot',qty:1}] },
  MakeWire:       { name: 'Wire',                          nameEs: 'Cable',                       building: 'Constructor',  time: 4,  inputs: [{item:'CopperIngot',qty:1}],                                      outputs: [{item:'Wire',qty:2}] },
  MakeCable:      { name: 'Cable',                         nameEs: 'Cable Eléctrico',             building: 'Constructor',  time: 2,  inputs: [{item:'Wire',qty:2}],                                             outputs: [{item:'Cable',qty:1}] },
  // Concrete
  MakeConcrete:   { name: 'Concrete',                      nameEs: 'Hormigón',                    building: 'Constructor',  time: 4,  inputs: [{item:'Limestone',qty:3}],                                        outputs: [{item:'Concrete',qty:1}] },
  // Steel
  MakeSteel:      { name: 'Steel Ingot',                   nameEs: 'Lingote de Acero',            building: 'Foundry',      time: 4,  inputs: [{item:'IronOre',qty:3},{item:'Coal',qty:3}],                      outputs: [{item:'SteelIngot',qty:3}] },
  MakeSteelBeam:  { name: 'Steel Beam',                    nameEs: 'Viga de Acero',               building: 'Constructor',  time: 4,  inputs: [{item:'SteelIngot',qty:4}],                                       outputs: [{item:'SteelBeam',qty:1}] },
  MakeSteelPipe:  { name: 'Steel Pipe',                    nameEs: 'Tubería de Acero',            building: 'Constructor',  time: 6,  inputs: [{item:'SteelIngot',qty:3}],                                       outputs: [{item:'SteelPipe',qty:2}] },
  // Rotor / Stator / Motor
  MakeRotor:      { name: 'Rotor',                         nameEs: 'Rotor',                       building: 'Assembler',    time: 15, inputs: [{item:'IronRod',qty:5},{item:'Screw',qty:25}],                    outputs: [{item:'Rotor',qty:1}] },
  MakeStator:     { name: 'Stator',                        nameEs: 'Estátor',                     building: 'Assembler',    time: 12, inputs: [{item:'SteelPipe',qty:3},{item:'Wire',qty:8}],                    outputs: [{item:'Stator',qty:1}] },
  MakeMotor:      { name: 'Motor',                         nameEs: 'Motor',                       building: 'Assembler',    time: 12, inputs: [{item:'Rotor',qty:2},{item:'Stator',qty:2}],                      outputs: [{item:'Motor',qty:1}] },
  // Modular
  MakeModularFrame:{ name: 'Modular Frame',                nameEs: 'Marco Modular',               building: 'Assembler',    time: 60, inputs: [{item:'ReinforcedPlate',qty:3},{item:'IronRod',qty:12}],          outputs: [{item:'ModularFrame',qty:2}] },
  MakeEncasedBeam: { name: 'Encased Industrial Beam',      nameEs: 'Viga Blindada',               building: 'Assembler',    time: 10, inputs: [{item:'SteelBeam',qty:4},{item:'Concrete',qty:5}],               outputs: [{item:'EncasedBeam',qty:1}] },
  MakeHeavyFrame:  { name: 'Heavy Modular Frame',          nameEs: 'Marco Modular Pesado',        building: 'Manufacturer', time: 30, inputs: [{item:'ModularFrame',qty:5},{item:'SteelPipe',qty:15},{item:'EncasedBeam',qty:5},{item:'Screw',qty:100}], outputs: [{item:'HeavyModularFrame',qty:1}] },
  // Caterium
  SmeltCaterium:  { name: 'Smelt Caterium',                nameEs: 'Fundir Caterio',              building: 'Smelter',      time: 4,  inputs: [{item:'CateriumOre',qty:3}],                                      outputs: [{item:'CateriumIngot',qty:1}] },
  MakeQuickwire:  { name: 'Quickwire',                     nameEs: 'Cable Rápido',                building: 'Constructor',  time: 5,  inputs: [{item:'CateriumIngot',qty:1}],                                    outputs: [{item:'Quickwire',qty:5}] },
  MakeSilica:     { name: 'Silica',                        nameEs: 'Sílice',                      building: 'Constructor',  time: 8,  inputs: [{item:'RawQuartz',qty:3}],                                        outputs: [{item:'Silica',qty:5}] },
  MakeCircuit:    { name: 'Circuit Board',                 nameEs: 'Placa de Circuito',           building: 'Assembler',    time: 8,  inputs: [{item:'CopperIngot',qty:2},{item:'Silica',qty:2}],                outputs: [{item:'CircuitBoard',qty:1}] },
  MakeAILimiter:  { name: 'AI Limiter',                    nameEs: 'Limitador IA',                building: 'Assembler',    time: 12, inputs: [{item:'CopperIngot',qty:5},{item:'Quickwire',qty:20}],            outputs: [{item:'AILimiter',qty:1}] },
  MakeComputer:   { name: 'Computer',                      nameEs: 'Ordenador',                   building: 'Manufacturer', time: 24, inputs: [{item:'CircuitBoard',qty:5},{item:'Cable',qty:22},{item:'Screw',qty:50}], outputs: [{item:'Computer',qty:1}] },
}

// ─── DEFAULT RECIPES ──────────────────────────────────────────────────────────

export const ITEM_DEFAULT_RECIPE: Record<string, string> = {
  IronIngot:         'SmeltIron',
  IronPlate:         'MakeIronPlate',
  IronRod:           'MakeIronRod',
  Screw:             'MakeScrew',
  ReinforcedPlate:   'MakeReinforced',
  CopperIngot:       'SmeltCopper',
  Wire:              'MakeWire',
  Cable:             'MakeCable',
  Concrete:          'MakeConcrete',
  SteelIngot:        'MakeSteel',
  SteelBeam:         'MakeSteelBeam',
  SteelPipe:         'MakeSteelPipe',
  Rotor:             'MakeRotor',
  Stator:            'MakeStator',
  Motor:             'MakeMotor',
  ModularFrame:      'MakeModularFrame',
  EncasedBeam:       'MakeEncasedBeam',
  HeavyModularFrame: 'MakeHeavyFrame',
  CateriumIngot:     'SmeltCaterium',
  Quickwire:         'MakeQuickwire',
  Silica:            'MakeSilica',
  CircuitBoard:      'MakeCircuit',
  AILimiter:         'MakeAILimiter',
  Computer:          'MakeComputer',
}

export const RAW_ITEMS = ['IronOre','CopperOre','Limestone','Coal','CateriumOre','RawQuartz']

// ─── BELT / MINER TIERS ───────────────────────────────────────────────────────

export const BELT_TIERS: BeltTier[] = [
  { mk:1, rate:60  }, { mk:2, rate:120 }, { mk:3, rate:270 },
  { mk:4, rate:480 }, { mk:5, rate:780 }, { mk:6, rate:1200 },
]

export const MINER_TIERS: MinerTier[] = [
  { mk:1, rate:60  }, { mk:2, rate:120 }, { mk:3, rate:240 },
]

// ─── SPACE ELEVATOR ───────────────────────────────────────────────────────────

export const SPACE_ELEVATOR_PHASES: ElevatorPhase[] = [
  {
    phase: 1, name: 'Phase 1', nameEs: 'Fase 1', tiers: 'Tier 0–2', color: '#f59e0b',
    milestones: [
      { name: 'HUB Upgrade 1', nameEs: 'Mejora HUB 1', items: [{item:'IronPlate',qty:10},{item:'IronRod',qty:10}] },
      { name: 'HUB Upgrade 2', nameEs: 'Mejora HUB 2', items: [{item:'IronPlate',qty:20},{item:'IronRod',qty:10},{item:'Wire',qty:20}] },
      { name: 'HUB Upgrade 3', nameEs: 'Mejora HUB 3', items: [{item:'IronPlate',qty:40},{item:'IronRod',qty:20},{item:'Wire',qty:40}] },
      { name: 'HUB Upgrade 4', nameEs: 'Mejora HUB 4', items: [{item:'IronPlate',qty:10},{item:'Concrete',qty:10},{item:'IronRod',qty:5}] },
      { name: 'HUB Upgrade 5', nameEs: 'Mejora HUB 5', items: [{item:'IronPlate',qty:20},{item:'Concrete',qty:20},{item:'IronRod',qty:10},{item:'Wire',qty:20}] },
      { name: 'HUB Upgrade 6', nameEs: 'Mejora HUB 6', items: [{item:'ReinforcedPlate',qty:10},{item:'IronRod',qty:10}] },
      { name: 'Space Elevator Part 1', nameEs: 'Lanzadera Parte 1', isMilestone: true, items: [{item:'ReinforcedPlate',qty:50},{item:'IronRod',qty:100},{item:'Wire',qty:200},{item:'Concrete',qty:100}] },
    ]
  },
  {
    phase: 2, name: 'Phase 2', nameEs: 'Fase 2', tiers: 'Tier 3–4', color: '#3b82f6',
    milestones: [
      { name: 'HUB Upgrade 1', nameEs: 'Mejora HUB 1', items: [{item:'ReinforcedPlate',qty:20},{item:'Rotor',qty:10}] },
      { name: 'HUB Upgrade 2', nameEs: 'Mejora HUB 2', items: [{item:'ModularFrame',qty:15},{item:'Rotor',qty:10},{item:'ReinforcedPlate',qty:20}] },
      { name: 'HUB Upgrade 3', nameEs: 'Mejora HUB 3', items: [{item:'ModularFrame',qty:25},{item:'SteelBeam',qty:50},{item:'SteelPipe',qty:30}] },
      { name: 'HUB Upgrade 4', nameEs: 'Mejora HUB 4', items: [{item:'Motor',qty:10},{item:'Rotor',qty:15},{item:'SteelPipe',qty:20}] },
      { name: 'HUB Upgrade 5', nameEs: 'Mejora HUB 5', items: [{item:'Motor',qty:20},{item:'ModularFrame',qty:10},{item:'SteelBeam',qty:50}] },
      { name: 'HUB Upgrade 6', nameEs: 'Mejora HUB 6', items: [{item:'Motor',qty:25},{item:'ModularFrame',qty:15},{item:'SteelPipe',qty:20},{item:'Wire',qty:100}] },
      { name: 'Space Elevator Part 2', nameEs: 'Lanzadera Parte 2', isMilestone: true, items: [{item:'ModularFrame',qty:25},{item:'Motor',qty:10},{item:'SteelPipe',qty:100},{item:'Wire',qty:200}] },
    ]
  },
  {
    phase: 3, name: 'Phase 3', nameEs: 'Fase 3', tiers: 'Tier 5–6', color: '#8b5cf6',
    milestones: [
      { name: 'HUB Upgrade 1', nameEs: 'Mejora HUB 1', items: [{item:'Motor',qty:25},{item:'Stator',qty:15},{item:'Cable',qty:100}] },
      { name: 'HUB Upgrade 2', nameEs: 'Mejora HUB 2', items: [{item:'HeavyModularFrame',qty:5},{item:'Motor',qty:20},{item:'Cable',qty:50}] },
      { name: 'HUB Upgrade 3', nameEs: 'Mejora HUB 3', items: [{item:'HeavyModularFrame',qty:10},{item:'Computer',qty:5},{item:'Motor',qty:25}] },
      { name: 'HUB Upgrade 4', nameEs: 'Mejora HUB 4', items: [{item:'HeavyModularFrame',qty:15},{item:'Computer',qty:10},{item:'Stator',qty:30}] },
      { name: 'HUB Upgrade 5', nameEs: 'Mejora HUB 5', items: [{item:'HeavyModularFrame',qty:20},{item:'Computer',qty:15},{item:'Motor',qty:30},{item:'Cable',qty:200}] },
      { name: 'HUB Upgrade 6', nameEs: 'Mejora HUB 6', items: [{item:'HeavyModularFrame',qty:30},{item:'Computer',qty:20},{item:'Motor',qty:50},{item:'Stator',qty:40}] },
      { name: 'Space Elevator Part 3', nameEs: 'Lanzadera Parte 3', isMilestone: true, items: [{item:'HeavyModularFrame',qty:25},{item:'Motor',qty:50},{item:'Computer',qty:25},{item:'Cable',qty:500}] },
    ]
  },
  {
    phase: 4, name: 'Phase 4', nameEs: 'Fase 4', tiers: 'Tier 7–8', color: '#10b981',
    milestones: [
      { name: 'HUB Upgrade 1', nameEs: 'Mejora HUB 1', items: [{item:'Computer',qty:25},{item:'HeavyModularFrame',qty:10},{item:'Motor',qty:50}] },
      { name: 'HUB Upgrade 2', nameEs: 'Mejora HUB 2', items: [{item:'Computer',qty:50},{item:'HeavyModularFrame',qty:20},{item:'Motor',qty:100},{item:'Quickwire',qty:500}] },
      { name: 'Space Elevator Part 4', nameEs: 'Lanzadera Parte 4', isMilestone: true, items: [{item:'Computer',qty:500},{item:'HeavyModularFrame',qty:100},{item:'Motor',qty:250},{item:'Quickwire',qty:1000}] },
    ]
  },
]

// ─── HELPERS ─────────────────────────────────────────────────────────────────

export function iconUrl(itemId: string): string {
  const item = ITEMS[itemId]
  if (!item) return ''
  return `https://satisfactory.wiki.gg/images/thumb/0/00/${item.icon}.png/40px-${item.icon}.png`
}

export function getItemRecipes(itemId: string): string[] {
  return Object.entries(RECIPES)
    .filter(([, r]) => r.outputs.some(o => o.item === itemId))
    .map(([id]) => id)
}

export function beltRate(mk: number): number {
  return BELT_TIERS.find(b => b.mk === mk)?.rate ?? 480
}
