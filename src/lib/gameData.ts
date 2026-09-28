// ─── TYPES ───────────────────────────────────────────────────────────────────

export interface ItemDef {
  name: string
  nameEs: string
  icon: string
  cat: 'raw' | 'ingot' | 'part' | 'fluid'
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
  // Raw
  IronOre:            { name: 'Iron Ore',                   nameEs: 'Mineral de Hierro',         icon: 'Iron_Ore',                    cat: 'raw'   },
  CopperOre:          { name: 'Copper Ore',                 nameEs: 'Mineral de Cobre',           icon: 'Copper_Ore',                  cat: 'raw'   },
  Limestone:          { name: 'Limestone',                  nameEs: 'Caliza',                     icon: 'Limestone',                   cat: 'raw'   },
  Coal:               { name: 'Coal',                       nameEs: 'Carbón',                     icon: 'Coal',                        cat: 'raw'   },
  CateriumOre:        { name: 'Caterium Ore',               nameEs: 'Mineral de Caterio',         icon: 'Caterium_Ore',                cat: 'raw'   },
  RawQuartz:          { name: 'Raw Quartz',                 nameEs: 'Cuarzo en Bruto',            icon: 'Raw_Quartz',                  cat: 'raw'   },
  Sulfur:             { name: 'Sulfur',                     nameEs: 'Azufre',                     icon: 'Sulfur',                      cat: 'raw'   },
  Bauxite:            { name: 'Bauxite',                    nameEs: 'Bauxita',                    icon: 'Bauxite',                     cat: 'raw'   },
  SAMOre:             { name: 'SAM Ore',                    nameEs: 'Mineral SAM',                icon: 'SAM',                         cat: 'raw'   },
  Uranium:            { name: 'Uranium',                    nameEs: 'Uranio',                     icon: 'Uranium',                     cat: 'raw'   },
  // Ingots
  IronIngot:          { name: 'Iron Ingot',                 nameEs: 'Lingote de Hierro',          icon: 'Iron_Ingot',                  cat: 'ingot' },
  CopperIngot:        { name: 'Copper Ingot',               nameEs: 'Lingote de Cobre',           icon: 'Copper_Ingot',                cat: 'ingot' },
  SteelIngot:         { name: 'Steel Ingot',                nameEs: 'Lingote de Acero',           icon: 'Steel_Ingot',                 cat: 'ingot' },
  CateriumIngot:      { name: 'Caterium Ingot',             nameEs: 'Lingote de Caterio',         icon: 'Caterium_Ingot',              cat: 'ingot' },
  AluminumIngot:      { name: 'Aluminum Ingot',             nameEs: 'Lingote de Aluminio',        icon: 'Aluminum_Ingot',              cat: 'ingot' },
  // Basic parts
  IronPlate:          { name: 'Iron Plate',                 nameEs: 'Placa de Hierro',            icon: 'Iron_Plate',                  cat: 'part'  },
  IronRod:            { name: 'Iron Rod',                   nameEs: 'Varilla de Hierro',          icon: 'Iron_Rod',                    cat: 'part'  },
  Screw:              { name: 'Screw',                      nameEs: 'Tornillo',                   icon: 'Screw',                       cat: 'part'  },
  ReinforcedPlate:    { name: 'Reinforced Iron Plate',      nameEs: 'Placa Reforzada de Hierro',  icon: 'Reinforced_Iron_Plate',       cat: 'part'  },
  Wire:               { name: 'Wire',                       nameEs: 'Cable',                      icon: 'Wire',                        cat: 'part'  },
  Cable:              { name: 'Cable',                      nameEs: 'Cable Eléctrico',            icon: 'Cable',                       cat: 'part'  },
  Concrete:           { name: 'Concrete',                   nameEs: 'Hormigón',                   icon: 'Concrete',                    cat: 'part'  },
  Quickwire:          { name: 'Quickwire',                  nameEs: 'Cable Rápido',               icon: 'Quickwire',                   cat: 'part'  },
  Silica:             { name: 'Silica',                     nameEs: 'Sílice',                     icon: 'Silica',                      cat: 'part'  },
  // Steel parts
  SteelBeam:          { name: 'Steel Beam',                 nameEs: 'Viga de Acero',              icon: 'Steel_Beam',                  cat: 'part'  },
  SteelPipe:          { name: 'Steel Pipe',                 nameEs: 'Tubería de Acero',           icon: 'Steel_Pipe',                  cat: 'part'  },
  EncasedBeam:        { name: 'Encased Industrial Beam',    nameEs: 'Viga Industrial Blindada',   icon: 'Encased_Industrial_Beam',     cat: 'part'  },
  // Mechanical
  Rotor:              { name: 'Rotor',                      nameEs: 'Rotor',                      icon: 'Rotor',                       cat: 'part'  },
  Stator:             { name: 'Stator',                     nameEs: 'Estátor',                    icon: 'Stator',                      cat: 'part'  },
  Motor:              { name: 'Motor',                      nameEs: 'Motor',                      icon: 'Motor',                       cat: 'part'  },
  ModularFrame:       { name: 'Modular Frame',              nameEs: 'Marco Modular',              icon: 'Modular_Frame',               cat: 'part'  },
  HeavyModularFrame:  { name: 'Heavy Modular Frame',        nameEs: 'Marco Modular Pesado',       icon: 'Heavy_Modular_Frame',         cat: 'part'  },
  // Electronics
  CircuitBoard:       { name: 'Circuit Board',              nameEs: 'Placa de Circuito',          icon: 'Circuit_Board',               cat: 'part'  },
  AILimiter:          { name: 'AI Limiter',                 nameEs: 'Limitador IA',               icon: 'AI_Limiter',                  cat: 'part'  },
  Computer:           { name: 'Computer',                   nameEs: 'Ordenador',                  icon: 'Computer',                    cat: 'part'  },
  HighSpeedConnector: { name: 'High-Speed Connector',       nameEs: 'Conector Alta Velocidad',    icon: 'High-Speed_Connector',        cat: 'part'  },
  // Advanced
  CrystalOscillator:  { name: 'Crystal Oscillator',        nameEs: 'Oscilador de Cristal',       icon: 'Crystal_Oscillator',          cat: 'part'  },
  Supercomputer:      { name: 'Supercomputer',              nameEs: 'Superordenador',             icon: 'Supercomputer',               cat: 'part'  },
  RadioControlUnit:   { name: 'Radio Control Unit',         nameEs: 'Unidad de Control Radio',    icon: 'Radio_Control_Unit',          cat: 'part'  },
  // Aluminum
  AluminaSolution:    { name: 'Alumina Solution',           nameEs: 'Solución de Alúmina',        icon: 'Alumina_Solution',            cat: 'fluid' },
  AluminumCasing:     { name: 'Aluminum Casing',            nameEs: 'Carcasa de Aluminio',        icon: 'Aluminum_Casing',             cat: 'part'  },
  AluminumScrap:      { name: 'Aluminum Scrap',             nameEs: 'Chatarra de Aluminio',       icon: 'Aluminum_Scrap',              cat: 'part'  },
  // Tier 7+
  FusedModularFrame:  { name: 'Fused Modular Frame',        nameEs: 'Marco Modular Fusionado',    icon: 'Fused_Modular_Frame',         cat: 'part'  },
  TurboMotor:         { name: 'Turbo Motor',                nameEs: 'Motor Turbo',                icon: 'Turbo_Motor',                 cat: 'part'  },
  CoolingSystem:      { name: 'Cooling System',             nameEs: 'Sistema de Enfriamiento',    icon: 'Cooling_System',              cat: 'part'  },
  Battery:            { name: 'Battery',                    nameEs: 'Batería',                    icon: 'Battery',                     cat: 'part'  },
  // Polymer / Rubber
  Plastic:            { name: 'Plastic',                    nameEs: 'Plástico',                   icon: 'Plastic',                     cat: 'part'  },
  Rubber:             { name: 'Rubber',                     nameEs: 'Caucho',                     icon: 'Rubber',                      cat: 'part'  },
  // Packaging
  EmptyCanister:      { name: 'Empty Canister',             nameEs: 'Envase Vacío',               icon: 'Empty_Canister',              cat: 'part'  },
  // Quartz
  QuartzCrystal:      { name: 'Quartz Crystal',             nameEs: 'Cristal de Cuarzo',          icon: 'Quartz_Crystal',              cat: 'part'  },
  // Heat Sink
  HeatSink:           { name: 'Heat Sink',                  nameEs: 'Disipador de Calor',         icon: 'Heat_Sink',                   cat: 'part'  },
}

// ─── BUILDINGS ───────────────────────────────────────────────────────────────

export const BUILDINGS: Record<string, BuildingDef> = {
  Smelter:      { name: 'Smelter',         nameEs: 'Fundidora',           power: 4,   icon: '🏭' },
  Constructor:  { name: 'Constructor',     nameEs: 'Constructor',         power: 4,   icon: '🔧' },
  Assembler:    { name: 'Assembler',       nameEs: 'Ensamblador',         power: 15,  icon: '⚙️' },
  Manufacturer: { name: 'Manufacturer',   nameEs: 'Fabricante',          power: 55,  icon: '🏗️' },
  Foundry:      { name: 'Foundry',         nameEs: 'Fundición',           power: 16,  icon: '🔥' },
  Refinery:     { name: 'Refinery',        nameEs: 'Refinería',           power: 30,  icon: '🛢️' },
  Blender:      { name: 'Blender',         nameEs: 'Mezcladora',          power: 75,  icon: '🌀' },
  ParticleAcc:  { name: 'Particle Accelerator', nameEs: 'Acelerador de Partículas', power: 500, icon: '⚛️' },
}

// ─── RECIPES ─────────────────────────────────────────────────────────────────

export const RECIPES: Record<string, RecipeDef> = {

  // ── Iron ──────────────────────────────────────────────────────────────────
  SmeltIron:           { name: 'Iron Ingot',                      nameEs: 'Lingote de Hierro',                building: 'Smelter',      time: 2,  inputs: [{item:'IronOre',qty:1}],                                                                   outputs: [{item:'IronIngot',qty:1}] },
  IronIngotAlloy:      { name: 'Iron Alloy Ingot (ALT)',          nameEs: 'Lingote Aleación Hierro (ALT)',    building: 'Foundry',      time: 6,  inputs: [{item:'IronOre',qty:2},{item:'CopperOre',qty:2}],                                           outputs: [{item:'IronIngot',qty:5}], alternate: true },
  PureIronIngot:       { name: 'Pure Iron Ingot (ALT)',           nameEs: 'Lingote de Hierro Puro (ALT)',     building: 'Refinery',     time: 12, inputs: [{item:'IronOre',qty:7}],                                                                   outputs: [{item:'IronIngot',qty:13}], alternate: true },

  MakeIronPlate:       { name: 'Iron Plate',                      nameEs: 'Placa de Hierro',                 building: 'Constructor',  time: 6,  inputs: [{item:'IronIngot',qty:3}],                                                                 outputs: [{item:'IronPlate',qty:2}] },
  CoatedIronPlate:     { name: 'Coated Iron Plate (ALT)',         nameEs: 'Placa de Hierro Revestida (ALT)', building: 'Assembler',    time: 12, inputs: [{item:'IronIngot',qty:10},{item:'Plastic',qty:2}],                                          outputs: [{item:'IronPlate',qty:15}], alternate: true },
  SteelCoatedPlate:    { name: 'Steel Coated Plate (ALT)',        nameEs: 'Placa Revestida de Acero (ALT)',  building: 'Assembler',    time: 24, inputs: [{item:'SteelIngot',qty:3},{item:'Plastic',qty:2}],                                          outputs: [{item:'IronPlate',qty:18}], alternate: true },

  MakeIronRod:         { name: 'Iron Rod',                        nameEs: 'Varilla de Hierro',               building: 'Constructor',  time: 4,  inputs: [{item:'IronIngot',qty:1}],                                                                 outputs: [{item:'IronRod',qty:1}] },
  SteelRod:            { name: 'Steel Rod (ALT)',                 nameEs: 'Varilla de Acero (ALT)',           building: 'Constructor',  time: 5,  inputs: [{item:'SteelIngot',qty:1}],                                                                outputs: [{item:'IronRod',qty:4}], alternate: true },

  MakeScrew:           { name: 'Screw',                           nameEs: 'Tornillo',                        building: 'Constructor',  time: 6,  inputs: [{item:'IronRod',qty:1}],                                                                   outputs: [{item:'Screw',qty:4}] },
  CastScrew:           { name: 'Cast Screw (ALT)',                nameEs: 'Tornillo Fundido (ALT)',           building: 'Constructor',  time: 24, inputs: [{item:'IronIngot',qty:5}],                                                                 outputs: [{item:'Screw',qty:20}], alternate: true },
  SteelScrew:          { name: 'Steel Screw (ALT)',               nameEs: 'Tornillo de Acero (ALT)',          building: 'Constructor',  time: 12, inputs: [{item:'SteelBeam',qty:1}],                                                                 outputs: [{item:'Screw',qty:52}], alternate: true },

  MakeReinforced:      { name: 'Reinforced Iron Plate',           nameEs: 'Placa Reforzada de Hierro',       building: 'Assembler',    time: 12, inputs: [{item:'IronPlate',qty:6},{item:'Screw',qty:12}],                                           outputs: [{item:'ReinforcedPlate',qty:1}] },
  StitchedIronPlate:   { name: 'Stitched Iron Plate (ALT)',       nameEs: 'Placa de Hierro Cosida (ALT)',    building: 'Assembler',    time: 32, inputs: [{item:'IronPlate',qty:10},{item:'Wire',qty:20}],                                           outputs: [{item:'ReinforcedPlate',qty:3}], alternate: true },
  AdheredIronPlate:    { name: 'Adhered Iron Plate (ALT)',        nameEs: 'Placa de Hierro Adherida (ALT)',  building: 'Assembler',    time: 16, inputs: [{item:'IronPlate',qty:3},{item:'Rubber',qty:1}],                                           outputs: [{item:'ReinforcedPlate',qty:1}], alternate: true },
  BoltedIronPlate:     { name: 'Bolted Iron Plate (ALT)',         nameEs: 'Placa de Hierro Atornillada (ALT)',building:'Assembler',    time: 12, inputs: [{item:'IronPlate',qty:18},{item:'Screw',qty:50}],                                          outputs: [{item:'ReinforcedPlate',qty:3}], alternate: true },

  // ── Copper ────────────────────────────────────────────────────────────────
  SmeltCopper:         { name: 'Copper Ingot',                    nameEs: 'Lingote de Cobre',                building: 'Smelter',      time: 2,  inputs: [{item:'CopperOre',qty:1}],                                                                 outputs: [{item:'CopperIngot',qty:1}] },
  CopperAlloyIngot:    { name: 'Copper Alloy Ingot (ALT)',        nameEs: 'Lingote de Aleación de Cobre (ALT)', building: 'Foundry',  time: 12, inputs: [{item:'CopperOre',qty:10},{item:'IronOre',qty:5}],                                          outputs: [{item:'CopperIngot',qty:20}], alternate: true },
  PureCopperIngot:     { name: 'Pure Copper Ingot (ALT)',         nameEs: 'Lingote de Cobre Puro (ALT)',      building: 'Refinery',     time: 24, inputs: [{item:'CopperOre',qty:6}],                                                                outputs: [{item:'CopperIngot',qty:15}], alternate: true },
  TemperedCopperIngot: { name: 'Tempered Copper Ingot (ALT)',     nameEs: 'Lingote de Cobre Templado (ALT)',  building: 'Foundry',      time: 28, inputs: [{item:'CopperOre',qty:9},{item:'PetroleumCoke',qty:6}],                                    outputs: [{item:'CopperIngot',qty:15}], alternate: true },

  MakeWire:            { name: 'Wire',                            nameEs: 'Cable',                           building: 'Constructor',  time: 4,  inputs: [{item:'CopperIngot',qty:1}],                                                               outputs: [{item:'Wire',qty:2}] },
  IronWire:            { name: 'Iron Wire (ALT)',                 nameEs: 'Cable de Hierro (ALT)',            building: 'Constructor',  time: 24, inputs: [{item:'IronIngot',qty:5}],                                                                 outputs: [{item:'Wire',qty:9}], alternate: true },
  CateriumWire:        { name: 'Caterium Wire (ALT)',             nameEs: 'Cable de Caterio (ALT)',           building: 'Constructor',  time: 4,  inputs: [{item:'CateriumIngot',qty:1}],                                                             outputs: [{item:'Wire',qty:8}], alternate: true },
  FusedWire:           { name: 'Fused Wire (ALT)',                nameEs: 'Cable Fusionado (ALT)',            building: 'Assembler',    time: 20, inputs: [{item:'CopperIngot',qty:4},{item:'CateriumIngot',qty:1}],                                  outputs: [{item:'Wire',qty:30}], alternate: true },

  MakeCable:           { name: 'Cable',                           nameEs: 'Cable Eléctrico',                 building: 'Constructor',  time: 2,  inputs: [{item:'Wire',qty:2}],                                                                      outputs: [{item:'Cable',qty:1}] },
  QuickwireCable:      { name: 'Quickwire Cable (ALT)',           nameEs: 'Cable Rápido (ALT)',               building: 'Assembler',    time: 24, inputs: [{item:'Quickwire',qty:3},{item:'Rubber',qty:2}],                                           outputs: [{item:'Cable',qty:11}], alternate: true },
  InsulatedCable:      { name: 'Insulated Cable (ALT)',           nameEs: 'Cable Aislado (ALT)',              building: 'Assembler',    time: 12, inputs: [{item:'Wire',qty:9},{item:'Rubber',qty:6}],                                                outputs: [{item:'Cable',qty:20}], alternate: true },

  // ── Concrete / Limestone ──────────────────────────────────────────────────
  MakeConcrete:        { name: 'Concrete',                        nameEs: 'Hormigón',                        building: 'Constructor',  time: 4,  inputs: [{item:'Limestone',qty:3}],                                                                 outputs: [{item:'Concrete',qty:1}] },
  WetConcrete:         { name: 'Wet Concrete (ALT)',              nameEs: 'Hormigón Húmedo (ALT)',            building: 'Refinery',     time: 3,  inputs: [{item:'Limestone',qty:6}],                                                                 outputs: [{item:'Concrete',qty:4}], alternate: true },
  FineConcrete:        { name: 'Fine Concrete (ALT)',             nameEs: 'Hormigón Fino (ALT)',              building: 'Assembler',    time: 24, inputs: [{item:'Silica',qty:3},{item:'Limestone',qty:12}],                                          outputs: [{item:'Concrete',qty:10}], alternate: true },
  RubberConcrete:      { name: 'Rubber Concrete (ALT)',           nameEs: 'Hormigón de Caucho (ALT)',         building: 'Assembler',    time: 12, inputs: [{item:'Limestone',qty:10},{item:'Rubber',qty:2}],                                          outputs: [{item:'Concrete',qty:9}], alternate: true },

  // ── Steel ─────────────────────────────────────────────────────────────────
  MakeSteel:           { name: 'Steel Ingot',                     nameEs: 'Lingote de Acero',                building: 'Foundry',      time: 4,  inputs: [{item:'IronOre',qty:3},{item:'Coal',qty:3}],                                               outputs: [{item:'SteelIngot',qty:3}] },
  SolidSteelIngot:     { name: 'Solid Steel Ingot (ALT)',         nameEs: 'Lingote de Acero Sólido (ALT)',   building: 'Foundry',      time: 3,  inputs: [{item:'IronIngot',qty:2},{item:'Coal',qty:2}],                                             outputs: [{item:'SteelIngot',qty:3}], alternate: true },
  CompactedSteelIngot: { name: 'Compacted Steel Ingot (ALT)',     nameEs: 'Lingote de Acero Compacto (ALT)', building: 'Foundry',      time: 16, inputs: [{item:'IronOre',qty:5},{item:'CompactedCoal',qty:1}],                                      outputs: [{item:'SteelIngot',qty:10}], alternate: true },
  CokeSteelIngot:      { name: 'Coke Steel Ingot (ALT)',          nameEs: 'Lingote Acero Coque (ALT)',        building: 'Foundry',      time: 12, inputs: [{item:'IronOre',qty:15},{item:'PetroleumCoke',qty:15}],                                    outputs: [{item:'SteelIngot',qty:20}], alternate: true },

  MakeSteelBeam:       { name: 'Steel Beam',                      nameEs: 'Viga de Acero',                   building: 'Constructor',  time: 4,  inputs: [{item:'SteelIngot',qty:4}],                                                               outputs: [{item:'SteelBeam',qty:1}] },
  BoltedFrame:         { name: 'Bolted Frame (ALT)',              nameEs: 'Marco Atornillado (ALT)',          building: 'Assembler',    time: 24, inputs: [{item:'ReinforcedPlate',qty:3},{item:'Screw',qty:56}],                                     outputs: [{item:'ModularFrame',qty:2}], alternate: true },

  MakeSteelPipe:       { name: 'Steel Pipe',                      nameEs: 'Tubería de Acero',                building: 'Constructor',  time: 6,  inputs: [{item:'SteelIngot',qty:3}],                                                               outputs: [{item:'SteelPipe',qty:2}] },
  IronPipe:            { name: 'Iron Pipe (ALT)',                  nameEs: 'Tubería de Hierro (ALT)',          building: 'Constructor',  time: 12, inputs: [{item:'IronIngot',qty:20}],                                                               outputs: [{item:'SteelPipe',qty:5}], alternate: true },

  MakeEncasedBeam:     { name: 'Encased Industrial Beam',         nameEs: 'Viga Industrial Blindada',        building: 'Assembler',    time: 10, inputs: [{item:'SteelBeam',qty:4},{item:'Concrete',qty:5}],                                        outputs: [{item:'EncasedBeam',qty:1}] },
  EncasedMold:         { name: 'Encased Industrial Pipe (ALT)',   nameEs: 'Tubería Industrial Blindada (ALT)',building: 'Assembler',    time: 15, inputs: [{item:'SteelPipe',qty:7},{item:'Concrete',qty:5}],                                        outputs: [{item:'EncasedBeam',qty:1}], alternate: true },

  // ── Rotor / Stator / Motor ────────────────────────────────────────────────
  MakeRotor:           { name: 'Rotor',                           nameEs: 'Rotor',                           building: 'Assembler',    time: 15, inputs: [{item:'IronRod',qty:5},{item:'Screw',qty:25}],                                             outputs: [{item:'Rotor',qty:1}] },
  CopperRotor:         { name: 'Copper Rotor (ALT)',              nameEs: 'Rotor de Cobre (ALT)',             building: 'Assembler',    time: 16, inputs: [{item:'CopperIngot',qty:6},{item:'Screw',qty:52}],                                         outputs: [{item:'Rotor',qty:3}], alternate: true },
  SteelRotor:          { name: 'Steel Rotor (ALT)',               nameEs: 'Rotor de Acero (ALT)',             building: 'Assembler',    time: 12, inputs: [{item:'SteelPipe',qty:2},{item:'Wire',qty:6}],                                             outputs: [{item:'Rotor',qty:1}], alternate: true },

  MakeStator:          { name: 'Stator',                          nameEs: 'Estátor',                         building: 'Assembler',    time: 12, inputs: [{item:'SteelPipe',qty:3},{item:'Wire',qty:8}],                                             outputs: [{item:'Stator',qty:1}] },
  QuickwireStator:     { name: 'Quickwire Stator (ALT)',          nameEs: 'Estátor de Cable Rápido (ALT)',    building: 'Assembler',    time: 15, inputs: [{item:'SteelPipe',qty:4},{item:'Quickwire',qty:15}],                                       outputs: [{item:'Stator',qty:2}], alternate: true },

  MakeMotor:           { name: 'Motor',                           nameEs: 'Motor',                           building: 'Assembler',    time: 12, inputs: [{item:'Rotor',qty:2},{item:'Stator',qty:2}],                                               outputs: [{item:'Motor',qty:1}] },
  ElectricMotor:       { name: 'Electric Motor (ALT)',            nameEs: 'Motor Eléctrico (ALT)',            building: 'Assembler',    time: 16, inputs: [{item:'EncasedBeam',qty:3},{item:'Rotor',qty:2}],                                          outputs: [{item:'Motor',qty:2}], alternate: true },

  // ── Modular frames ────────────────────────────────────────────────────────
  MakeModularFrame:    { name: 'Modular Frame',                   nameEs: 'Marco Modular',                   building: 'Assembler',    time: 60, inputs: [{item:'ReinforcedPlate',qty:3},{item:'IronRod',qty:12}],                                   outputs: [{item:'ModularFrame',qty:2}] },
  SteelModularFrame:   { name: 'Steel Modular Frame (ALT)',       nameEs: 'Marco Modular de Acero (ALT)',    building: 'Assembler',    time: 30, inputs: [{item:'SteelBeam',qty:10},{item:'Concrete',qty:2}],                                        outputs: [{item:'ModularFrame',qty:2}], alternate: true },

  MakeHeavyFrame:      { name: 'Heavy Modular Frame',             nameEs: 'Marco Modular Pesado',            building: 'Manufacturer', time: 30, inputs: [{item:'ModularFrame',qty:5},{item:'SteelPipe',qty:15},{item:'EncasedBeam',qty:5},{item:'Screw',qty:100}], outputs: [{item:'HeavyModularFrame',qty:1}] },
  HeavyEncasedFrame:   { name: 'Heavy Encased Frame (ALT)',       nameEs: 'Marco Blindado Pesado (ALT)',     building: 'Manufacturer', time: 64, inputs: [{item:'ModularFrame',qty:8},{item:'EncasedBeam',qty:10},{item:'SteelPipe',qty:36},{item:'Concrete',qty:22}], outputs: [{item:'HeavyModularFrame',qty:3}], alternate: true },
  HeavyFlexibleFrame:  { name: 'Heavy Flexible Frame (ALT)',      nameEs: 'Marco Flexible Pesado (ALT)',     building: 'Manufacturer', time: 16, inputs: [{item:'ModularFrame',qty:5},{item:'EncasedBeam',qty:3},{item:'Rubber',qty:20},{item:'Screw',qty:104}], outputs: [{item:'HeavyModularFrame',qty:1}], alternate: true },

  // ── Caterium ──────────────────────────────────────────────────────────────
  SmeltCaterium:       { name: 'Caterium Ingot',                  nameEs: 'Lingote de Caterio',              building: 'Smelter',      time: 4,  inputs: [{item:'CateriumOre',qty:3}],                                                               outputs: [{item:'CateriumIngot',qty:1}] },
  PureCateriumIngot:   { name: 'Pure Caterium Ingot (ALT)',       nameEs: 'Lingote Caterio Puro (ALT)',       building: 'Refinery',     time: 5,  inputs: [{item:'CateriumOre',qty:2}],                                                               outputs: [{item:'CateriumIngot',qty:1}], alternate: true },

  MakeQuickwire:       { name: 'Quickwire',                       nameEs: 'Cable Rápido',                    building: 'Constructor',  time: 5,  inputs: [{item:'CateriumIngot',qty:1}],                                                             outputs: [{item:'Quickwire',qty:5}] },
  FusedQuickwire:      { name: 'Fused Quickwire (ALT)',           nameEs: 'Cable Rápido Fusionado (ALT)',     building: 'Assembler',    time: 8,  inputs: [{item:'CateriumIngot',qty:1},{item:'CopperIngot',qty:5}],                                  outputs: [{item:'Quickwire',qty:12}], alternate: true },

  // ── Silica / Quartz ───────────────────────────────────────────────────────
  MakeSilica:          { name: 'Silica',                          nameEs: 'Sílice',                          building: 'Constructor',  time: 8,  inputs: [{item:'RawQuartz',qty:3}],                                                                 outputs: [{item:'Silica',qty:5}] },
  CheapSilica:         { name: 'Cheap Silica (ALT)',              nameEs: 'Sílice Barata (ALT)',              building: 'Assembler',    time: 16, inputs: [{item:'RawQuartz',qty:3},{item:'Limestone',qty:5}],                                        outputs: [{item:'Silica',qty:7}], alternate: true },

  MakeQuartzCrystal:   { name: 'Quartz Crystal',                  nameEs: 'Cristal de Cuarzo',               building: 'Constructor',  time: 8,  inputs: [{item:'RawQuartz',qty:5}],                                                                outputs: [{item:'QuartzCrystal',qty:3}] },

  MakeCrystalOsc:      { name: 'Crystal Oscillator',              nameEs: 'Oscilador de Cristal',            building: 'Manufacturer', time: 120,inputs: [{item:'QuartzCrystal',qty:36},{item:'Cable',qty:28},{item:'ReinforcedPlate',qty:5}],       outputs: [{item:'CrystalOscillator',qty:2}] },
  InsulatedCrystalOsc: { name: 'Insulated Crystal Oscillator (ALT)', nameEs: 'Oscilador Cristal Aislado (ALT)', building: 'Manufacturer', time: 32, inputs: [{item:'QuartzCrystal',qty:10},{item:'Rubber',qty:7},{item:'AILimiter',qty:1}],          outputs: [{item:'CrystalOscillator',qty:1}], alternate: true },

  // ── Electronics ───────────────────────────────────────────────────────────
  MakeCircuit:         { name: 'Circuit Board',                   nameEs: 'Placa de Circuito',               building: 'Assembler',    time: 8,  inputs: [{item:'CopperIngot',qty:2},{item:'Silica',qty:2}],                                         outputs: [{item:'CircuitBoard',qty:1}] },
  SiliconeCircuit:     { name: 'Silicon Circuit Board (ALT)',     nameEs: 'Placa Circuito Silicio (ALT)',     building: 'Assembler',    time: 24, inputs: [{item:'CopperIngot',qty:11},{item:'Silica',qty:11}],                                       outputs: [{item:'CircuitBoard',qty:5}], alternate: true },
  CateriumCircuit:     { name: 'Caterium Circuit Board (ALT)',    nameEs: 'Placa Circuito Caterio (ALT)',     building: 'Assembler',    time: 48, inputs: [{item:'Plastic',qty:10},{item:'Quickwire',qty:30}],                                        outputs: [{item:'CircuitBoard',qty:7}], alternate: true },
  ElectrodeCB:         { name: 'Electrode Circuit Board (ALT)',   nameEs: 'Placa Circuito Electrodo (ALT)',   building: 'Assembler',    time: 12, inputs: [{item:'Rubber',qty:6},{item:'Plastic',qty:9}],                                             outputs: [{item:'CircuitBoard',qty:1}], alternate: true },

  MakeAILimiter:       { name: 'AI Limiter',                      nameEs: 'Limitador IA',                    building: 'Assembler',    time: 12, inputs: [{item:'CopperIngot',qty:5},{item:'Quickwire',qty:20}],                                     outputs: [{item:'AILimiter',qty:1}] },

  MakeComputer:        { name: 'Computer',                        nameEs: 'Ordenador',                       building: 'Manufacturer', time: 24, inputs: [{item:'CircuitBoard',qty:5},{item:'Cable',qty:22},{item:'Screw',qty:50}],                  outputs: [{item:'Computer',qty:1}] },
  CateriumComputer:    { name: 'Caterium Computer (ALT)',         nameEs: 'Ordenador de Caterio (ALT)',       building: 'Manufacturer', time: 16, inputs: [{item:'CircuitBoard',qty:7},{item:'Quickwire',qty:28},{item:'Rubber',qty:12}],             outputs: [{item:'Computer',qty:1}], alternate: true },
  CrystalComputer:     { name: 'Crystal Computer (ALT)',          nameEs: 'Ordenador de Cristal (ALT)',       building: 'Assembler',    time: 64, inputs: [{item:'CircuitBoard',qty:8},{item:'CrystalOscillator',qty:3}],                            outputs: [{item:'Computer',qty:3}], alternate: true },

  MakeHSC:             { name: 'High-Speed Connector',            nameEs: 'Conector Alta Velocidad',         building: 'Manufacturer', time: 16, inputs: [{item:'Quickwire',qty:56},{item:'Cable',qty:10},{item:'CircuitBoard',qty:1}],              outputs: [{item:'HighSpeedConnector',qty:1}] },
  SiliconHSC:          { name: 'Silicon High-Speed Connector (ALT)', nameEs: 'Conector AV Silicio (ALT)',    building: 'Manufacturer', time: 40, inputs: [{item:'Silica',qty:60},{item:'Quickwire',qty:25}],                                         outputs: [{item:'HighSpeedConnector',qty:2}], alternate: true },

  MakeSupercomputer:   { name: 'Supercomputer',                   nameEs: 'Superordenador',                  building: 'Manufacturer', time: 32, inputs: [{item:'Computer',qty:2},{item:'AILimiter',qty:2},{item:'HighSpeedConnector',qty:3},{item:'Plastic',qty:28}], outputs: [{item:'Supercomputer',qty:1}] },
  OCSupercomputer:     { name: 'OC Supercomputer (ALT)',          nameEs: 'Superordenador OC (ALT)',          building: 'Assembler',    time: 20, inputs: [{item:'RadioControlUnit',qty:3},{item:'CoolingSystem',qty:3}],                            outputs: [{item:'Supercomputer',qty:1}], alternate: true },

  MakeRCU:             { name: 'Radio Control Unit',              nameEs: 'Unidad de Control Radio',         building: 'Manufacturer', time: 48, inputs: [{item:'AluminumCasing',qty:32},{item:'CrystalOscillator',qty:1},{item:'Computer',qty:1}],  outputs: [{item:'RadioControlUnit',qty:2}] },
  RadioConnectionUnit: { name: 'Radio Connection Unit (ALT)',     nameEs: 'Unidad Conexión Radio (ALT)',      building: 'Manufacturer', time: 16, inputs: [{item:'HeatSink',qty:4},{item:'HighSpeedConnector',qty:2},{item:'QuartzCrystal',qty:12}], outputs: [{item:'RadioControlUnit',qty:1}], alternate: true },

  // ── Aluminum ──────────────────────────────────────────────────────────────
  MakeAluminaRefined:  { name: 'Alumina Solution',                nameEs: 'Solución de Alúmina',             building: 'Refinery',     time: 6,  inputs: [{item:'Bauxite',qty:12}],                                                                  outputs: [{item:'AluminaSolution',qty:12}] },
  MakeAluminumScrap:   { name: 'Aluminum Scrap',                  nameEs: 'Chatarra de Aluminio',            building: 'Refinery',     time: 1,  inputs: [{item:'AluminaSolution',qty:4}],                                                           outputs: [{item:'AluminumScrap',qty:6}] },
  MakeAluminumIngot:   { name: 'Aluminum Ingot',                  nameEs: 'Lingote de Aluminio',             building: 'Foundry',      time: 4,  inputs: [{item:'AluminumScrap',qty:6},{item:'Silica',qty:5}],                                       outputs: [{item:'AluminumIngot',qty:4}] },
  PureAluminumIngot:   { name: 'Pure Aluminum Ingot (ALT)',       nameEs: 'Lingote de Aluminio Puro (ALT)',   building: 'Smelter',      time: 2,  inputs: [{item:'AluminumScrap',qty:2}],                                                             outputs: [{item:'AluminumIngot',qty:1}], alternate: true },

  MakeAluminumCasing:  { name: 'Aluminum Casing',                 nameEs: 'Carcasa de Aluminio',             building: 'Constructor',  time: 2,  inputs: [{item:'AluminumIngot',qty:3}],                                                             outputs: [{item:'AluminumCasing',qty:2}] },
  AlcladCasing:        { name: 'Alclad Casing (ALT)',             nameEs: 'Carcasa Alclad (ALT)',             building: 'Assembler',    time: 8,  inputs: [{item:'AluminumIngot',qty:20},{item:'CopperIngot',qty:10}],                                outputs: [{item:'AluminumCasing',qty:15}], alternate: true },

  // ── Heat Sink ────────────────────────────────────────────────────────────
  MakeHeatSink:        { name: 'Heat Sink',                         nameEs: 'Disipador de Calor',             building: 'Assembler',    time: 8,  inputs: [{item:'AluminumCasing',qty:5},{item:'CopperIngot',qty:3}],                                 outputs: [{item:'HeatSink',qty:1}] },
  HeatExchanger:       { name: 'Heat Exchanger (ALT)',              nameEs: 'Intercambiador de Calor (ALT)',   building: 'Assembler',    time: 6,  inputs: [{item:'AluminumCasing',qty:3},{item:'Rubber',qty:3}],                                      outputs: [{item:'HeatSink',qty:1}], alternate: true },

  // ── Cooling System ────────────────────────────────────────────────────────
  MakeCoolingSystem:   { name: 'Cooling System',                  nameEs: 'Sistema de Enfriamiento',         building: 'Blender',      time: 10, inputs: [{item:'AluminumCasing',qty:2},{item:'Rubber',qty:2},{item:'HeatSink',qty:2}],              outputs: [{item:'CoolingSystem',qty:1}] },
  CoolingDevice:       { name: 'Cooling Device (ALT)',            nameEs: 'Dispositivo de Enfriamiento (ALT)', building: 'Manufacturer', time: 32, inputs: [{item:'HeatSink',qty:5},{item:'Motor',qty:1},{item:'AluminumCasing',qty:3}],             outputs: [{item:'CoolingSystem',qty:2}], alternate: true },

  // ── Fused Modular Frame ───────────────────────────────────────────────────
  MakeFusedFrame:      { name: 'Fused Modular Frame',             nameEs: 'Marco Modular Fusionado',         building: 'Blender',      time: 40, inputs: [{item:'HeavyModularFrame',qty:1},{item:'AluminumCasing',qty:50},{item:'HeatSink',qty:5}], outputs: [{item:'FusedModularFrame',qty:1}] },
  HeatFusedFrame:      { name: 'Heat-Fused Frame (ALT)',          nameEs: 'Marco Fusionado por Calor (ALT)', building: 'Blender',      time: 20, inputs: [{item:'HeavyModularFrame',qty:1},{item:'AluminumIngot',qty:50},{item:'Rubber',qty:10}],      outputs: [{item:'FusedModularFrame',qty:1}], alternate: true },

  // ── Turbo Motor ───────────────────────────────────────────────────────────
  MakeTurboMotor:      { name: 'Turbo Motor',                     nameEs: 'Motor Turbo',                     building: 'Manufacturer', time: 32, inputs: [{item:'CoolingSystem',qty:4},{item:'RadioControlUnit',qty:2},{item:'Motor',qty:4},{item:'Rubber',qty:24}], outputs: [{item:'TurboMotor',qty:1}] },
  TurboElectricMotor:  { name: 'Turbo Electric Motor (ALT)',      nameEs: 'Motor Eléctrico Turbo (ALT)',      building: 'Manufacturer', time: 64, inputs: [{item:'Motor',qty:7},{item:'RadioControlUnit',qty:9},{item:'Stator',qty:7},{item:'Rotor',qty:7}], outputs: [{item:'TurboMotor',qty:3}], alternate: true },
  TurboPressureMotor:  { name: 'Turbo Pressure Motor (ALT)',      nameEs: 'Motor de Presión Turbo (ALT)',     building: 'Manufacturer', time: 32, inputs: [{item:'Motor',qty:4},{item:'CoolingSystem',qty:2},{item:'Stator',qty:8},{item:'Rotor',qty:4}], outputs: [{item:'TurboMotor',qty:2}], alternate: true },

  // ── Battery ───────────────────────────────────────────────────────────────
  MakeBattery:         { name: 'Battery',                         nameEs: 'Batería',                         building: 'Blender',      time: 3,  inputs: [{item:'AluminaSolution',qty:2},{item:'AluminumCasing',qty:1},{item:'Rubber',qty:2}],     outputs: [{item:'Battery',qty:1}] },
  ClassicBattery:      { name: 'Classic Battery (ALT)',           nameEs: 'Batería Clásica (ALT)',            building: 'Manufacturer', time: 8,  inputs: [{item:'Sulfur',qty:6},{item:'AluminumIngot',qty:7},{item:'Plastic',qty:8},{item:'Wire',qty:12}], outputs: [{item:'Battery',qty:4}], alternate: true },

  // ── Plastic / Rubber (from Crude Oil — simplified as raw) ─────────────────
  MakePlastic:         { name: 'Plastic',                         nameEs: 'Plástico',                        building: 'Refinery',     time: 6,  inputs: [{item:'CrudeOil',qty:3}],                                                                  outputs: [{item:'Plastic',qty:2}] },
  RecycledPlastic:     { name: 'Recycled Plastic (ALT)',          nameEs: 'Plástico Reciclado (ALT)',         building: 'Refinery',     time: 12, inputs: [{item:'Rubber',qty:6},{item:'FuelOil',qty:6}],                                             outputs: [{item:'Plastic',qty:12}], alternate: true },

  MakeRubber:          { name: 'Rubber',                          nameEs: 'Caucho',                          building: 'Refinery',     time: 6,  inputs: [{item:'CrudeOil',qty:3}],                                                                  outputs: [{item:'Rubber',qty:2}] },
  RecycledRubber:      { name: 'Recycled Rubber (ALT)',           nameEs: 'Caucho Reciclado (ALT)',           building: 'Refinery',     time: 12, inputs: [{item:'Plastic',qty:6},{item:'FuelOil',qty:6}],                                            outputs: [{item:'Rubber',qty:12}], alternate: true },

  // ── Empty Canister ────────────────────────────────────────────────────────
  MakeEmptyCanister:   { name: 'Empty Canister',                  nameEs: 'Envase Vacío',                    building: 'Constructor',  time: 4,  inputs: [{item:'Plastic',qty:2}],                                                                   outputs: [{item:'EmptyCanister',qty:4}] },
  SteelCanister:       { name: 'Steel Canister (ALT)',            nameEs: 'Envase de Acero (ALT)',            building: 'Constructor',  time: 3,  inputs: [{item:'SteelIngot',qty:3}],                                                               outputs: [{item:'EmptyCanister',qty:4}], alternate: true },
  CoatedCanister:      { name: 'Coated Iron Canister (ALT)',      nameEs: 'Envase de Hierro Revestido (ALT)',building: 'Assembler',    time: 4,  inputs: [{item:'IronPlate',qty:2},{item:'CopperIngot',qty:1}],                                       outputs: [{item:'EmptyCanister',qty:4}], alternate: true },
}

// ─── DEFAULT RECIPES ──────────────────────────────────────────────────────────

export const ITEM_DEFAULT_RECIPE: Record<string, string> = {
  IronIngot:           'SmeltIron',
  IronPlate:           'MakeIronPlate',
  IronRod:             'MakeIronRod',
  Screw:               'MakeScrew',
  ReinforcedPlate:     'MakeReinforced',
  CopperIngot:         'SmeltCopper',
  Wire:                'MakeWire',
  Cable:               'MakeCable',
  Concrete:            'MakeConcrete',
  SteelIngot:          'MakeSteel',
  SteelBeam:           'MakeSteelBeam',
  SteelPipe:           'MakeSteelPipe',
  EncasedBeam:         'MakeEncasedBeam',
  Rotor:               'MakeRotor',
  Stator:              'MakeStator',
  Motor:               'MakeMotor',
  ModularFrame:        'MakeModularFrame',
  HeavyModularFrame:   'MakeHeavyFrame',
  CateriumIngot:       'SmeltCaterium',
  Quickwire:           'MakeQuickwire',
  Silica:              'MakeSilica',
  QuartzCrystal:       'MakeQuartzCrystal',
  CircuitBoard:        'MakeCircuit',
  AILimiter:           'MakeAILimiter',
  Computer:            'MakeComputer',
  HighSpeedConnector:  'MakeHSC',
  CrystalOscillator:   'MakeCrystalOsc',
  Supercomputer:       'MakeSupercomputer',
  RadioControlUnit:    'MakeRCU',
  AluminaSolution:     'MakeAluminaRefined',
  AluminumScrap:       'MakeAluminumScrap',
  AluminumIngot:       'MakeAluminumIngot',
  AluminumCasing:      'MakeAluminumCasing',
  CoolingSystem:       'MakeCoolingSystem',
  FusedModularFrame:   'MakeFusedFrame',
  TurboMotor:          'MakeTurboMotor',
  Battery:             'MakeBattery',
  Plastic:             'MakePlastic',
  Rubber:              'MakeRubber',
  EmptyCanister:       'MakeEmptyCanister',
  HeatSink:            'MakeHeatSink',
}

export const RAW_ITEMS = [
  'IronOre','CopperOre','Limestone','Coal','CateriumOre','RawQuartz',
  'Sulfur','Bauxite','SAMOre','Uranium',
  // Fluid placeholders treated as raw (no recipe chain shown)
  'CrudeOil','Water','NitrogenGas','SulfuricAcid','FuelOil',
  'CompactedCoal','PetroleumCoke',
]

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
  // Use wiki.gg via a proxy-friendly URL
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
