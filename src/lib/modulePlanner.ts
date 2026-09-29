import { RECIPES, BUILDINGS, ITEM_DEFAULT_RECIPE, beltRate } from './gameData'

// ─── TYPES ───────────────────────────────────────────────────────────────────

export interface ModuleIO {
  item: string
  total: number          // items/min for the whole module
  perFloor: number       // items/min delivered to a full floor
  belts: number          // belts needed at the current belt tier
}

export interface FloorPlan {
  machines: number       // machines on this floor
  rows: number           // rows actually used on this floor
  perRow: number[]       // machines in each row
}

export interface FactoryModule {
  item: string
  recipeId: string
  building: string
  rate: number           // items/min produced
  machines: number
  clkPct: number
  powerMW: number
  depth: number          // 0 = final product, higher = closer to raw
  // Layout
  perRowMax: number
  rowsPerFloor: number
  floors: FloorPlan[]
  pitch: number          // metres between machine centres along the row
  laneIn: number         // metres reserved for input manifolds per row
  laneOut: number        // metres reserved for output manifold per row
  floorW: number         // metres
  floorL: number         // metres
  floorH: number         // metres, floor-to-floor
  totalH: number
  footprintF: { w: number; l: number }   // in 8 m foundations
  flatFootprintF: number                 // foundations if all machines sat on one floor
  inputs: ModuleIO[]
  output: ModuleIO
  consumers: string[]                    // items (modules) this output feeds
  rawInputs: string[]                    // inputs that come from miners / extractors
}

export interface ModuleSettings {
  maxWidthF: number      // max platform width in foundations
  rowsPerFloor: 1 | 2
  maxFloors: number      // soft cap; if exceeded, rows get wider
  beltMk: number
  overclock: boolean
  somersloop: boolean
}

export const FOUNDATION = 8
const SIDE_MARGIN = 4    // lift + walkway on each side of the rows

// ─── DEMAND AGGREGATION ──────────────────────────────────────────────────────

interface Demand { rate: number; recipeId: string | null; depth: number; consumers: Set<string> }

function aggregate(itemId: string, rate: number, choices: Record<string, string>) {
  const demand = new Map<string, Demand>()

  const visit = (item: string, r: number, depth: number, consumer: string | null, guard: Set<string>) => {
    const recipeId = choices[item] ?? ITEM_DEFAULT_RECIPE[item] ?? null
    let d = demand.get(item)
    if (!d) { d = { rate: 0, recipeId, depth, consumers: new Set() }; demand.set(item, d) }
    d.rate += r
    d.depth = Math.max(d.depth, depth)
    if (consumer) d.consumers.add(consumer)

    const recipe = recipeId ? RECIPES[recipeId] : null
    if (!recipe || guard.has(item)) return
    const out = recipe.outputs.find(o => o.item === item)
    if (!out) return
    const cycles = r / out.qty            // cycles per minute, in "recipe units"
    const next = new Set(guard).add(item)
    for (const inp of recipe.inputs) visit(inp.item, cycles * inp.qty, depth + 1, item, next)
  }

  visit(itemId, rate, 0, null, new Set())
  return demand
}

// ─── LAYOUT ──────────────────────────────────────────────────────────────────

const ceilTo = (v: number, step: number) => Math.ceil(v / step) * step

function packFloors(count: number, perRowMax: number, rowsPerFloor: number): FloorPlan[] {
  const perFloorMax = perRowMax * rowsPerFloor
  const nFloors = Math.max(1, Math.ceil(count / perFloorMax))
  // Spread machines evenly so every floor looks alike (easier to copy-paste in game)
  const base = Math.floor(count / nFloors)
  let extra = count % nFloors
  const floors: FloorPlan[] = []
  for (let f = 0; f < nFloors; f++) {
    const n = base + (extra-- > 0 ? 1 : 0)
    const rows = Math.min(rowsPerFloor, n)
    const perRow: number[] = []
    const rb = Math.floor(n / rows)
    let rx = n % rows
    for (let r = 0; r < rows; r++) perRow.push(rb + (rx-- > 0 ? 1 : 0))
    floors.push({ machines: n, rows, perRow })
  }
  return floors
}

export function planModules(
  itemId: string,
  rate: number,
  choices: Record<string, string>,
  s: ModuleSettings,
): FactoryModule[] {
  const belt = beltRate(s.beltMk)
  const demand = aggregate(itemId, rate, choices)
  const modules: FactoryModule[] = []

  for (const [item, d] of demand) {
    if (!d.recipeId) continue
    const recipe = RECIPES[d.recipeId]
    const bld = BUILDINGS[recipe.building]
    if (!recipe || !bld) continue
    const out = recipe.outputs.find(o => o.item === item)!
    const base = (out.qty / recipe.time) * 60 * (s.somersloop ? 2 : 1)
    const raw = d.rate / base
    const machines = Math.max(1, Math.ceil(raw - 1e-9))
    const clkPct = s.overclock ? (raw / machines) * 100 : 100

    // Machine pitch snapped to half-foundations so rows line up with the grid
    const pitch = ceilTo(bld.w + 1, 4)
    const laneIn = Math.min(4, recipe.inputs.length) * 2 + 2   // stacked input belts + splitters
    const laneOut = 4
    const usableW = s.maxWidthF * FOUNDATION - SIDE_MARGIN * 2
    let perRowMax = Math.max(1, Math.floor(usableW / pitch))

    // If the soft floor cap would be blown, widen the rows instead
    const floorsNeeded = Math.ceil(machines / (perRowMax * s.rowsPerFloor))
    if (floorsNeeded > s.maxFloors) perRowMax = Math.ceil(machines / (s.maxFloors * s.rowsPerFloor))

    const floors = packFloors(machines, perRowMax, s.rowsPerFloor)
    const widest = Math.max(...floors.flatMap(f => f.perRow))
    const rowsUsed = Math.max(...floors.map(f => f.rows))

    const floorW = widest * pitch + SIDE_MARGIN * 2
    const rowL = laneIn + bld.l + laneOut
    // Two rows share the output manifold in the middle
    const floorL = rowsUsed === 2 ? laneIn * 2 + bld.l * 2 + laneOut : rowL
    const floorH = ceilTo(bld.h + 3, 4)
    const totalH = floorH * floors.length

    const perFloorShare = Math.max(...floors.map(f => f.machines)) / machines
    const cyclesPerMin = d.rate / out.qty
    const inputs: ModuleIO[] = recipe.inputs.map(inp => {
      const total = cyclesPerMin * inp.qty
      return { item: inp.item, total, perFloor: total * perFloorShare, belts: Math.ceil(total / belt - 1e-9) }
    })

    const flatPerRow = Math.max(1, Math.floor(usableW / pitch))
    const flatRows = Math.ceil(machines / flatPerRow)
    const flatW = Math.min(machines, flatPerRow) * pitch + SIDE_MARGIN * 2
    const flatL = flatRows * rowL

    modules.push({
      item, recipeId: d.recipeId, building: recipe.building,
      rate: d.rate, machines, clkPct,
      powerMW: machines * bld.power * Math.pow(clkPct / 100, 1.321928),
      depth: d.depth,
      perRowMax, rowsPerFloor: s.rowsPerFloor, floors,
      pitch, laneIn, laneOut, floorW, floorL, floorH, totalH,
      footprintF: { w: Math.ceil(floorW / FOUNDATION), l: Math.ceil(floorL / FOUNDATION) },
      flatFootprintF: Math.ceil(flatW / FOUNDATION) * Math.ceil(flatL / FOUNDATION),
      inputs,
      output: { item, total: d.rate, perFloor: d.rate * perFloorShare, belts: Math.ceil(d.rate / belt - 1e-9) },
      consumers: [...d.consumers],
      rawInputs: recipe.inputs.map(i => i.item).filter(i => !demand.get(i)?.recipeId),
    })
  }

  // Raw side first, final product last — the order you'd build them in
  return modules.sort((a, b) => b.depth - a.depth || a.item.localeCompare(b.item))
}
