import { RECIPES, ITEM_DEFAULT_RECIPE, RAW_ITEMS, beltRate } from './gameData'

// ─── TYPES ───────────────────────────────────────────────────────────────────

export interface MachineNode {
  id: string
  type: 'machine'
  isRaw: boolean
  item: string
  recipeId: string | null
  clkPct: number
  inputRates: Record<string, number>
  outputRate: number
  machineIndex: number
  machineCount: number
  depth: number
  x: number
  y: number
}

export interface MergerNode {
  id: string
  type: 'merger'
  item: string
  inputNodeIds: string[]
  totalRate: number
  depth: number
  mergerX: number
  x: number
  y: number
}

export interface SplitterNode {
  id: string
  type: 'splitter'
  item: string
  inputRate: number
  outputs: { nodeId: string; rate: number }[]
  splitterX: number
  depth: number
  x: number
  y: number
}

export type GraphNode = MachineNode | MergerNode | SplitterNode

export interface GraphEdge {
  id: string
  fromId: string
  toId: string
  rate: number
  overloaded: boolean
  edgeType: 'merger_in' | 'splitter_in' | 'splitter_out' | 'belt'
}

export interface GraphState {
  machineNodes: MachineNode[]
  mergerNodes: MergerNode[]
  splitterNodes: SplitterNode[]
  edges: GraphEdge[]
}

// ─── LAYOUT CONSTANTS ────────────────────────────────────────────────────────
const COL_W = 800
const MACH_H = 320
const GROUP_GAP = 200
const MERGER_OFFSET = 320
const SPLITTER_OFFSET = 280

// ─── BUILDER ─────────────────────────────────────────────────────────────────

export function buildGraph(
  itemId: string,
  ratePerMin: number,
  recipeChoices: Record<string, string>,
  beltMk: number,
  somersloop: boolean,
  overclock: boolean
): GraphState {
  const ctx = new GraphBuilderContext(recipeChoices, beltMk, somersloop, overclock)
  ctx.buildPhysical(itemId, ratePerMin, recipeChoices[itemId] ?? ITEM_DEFAULT_RECIPE[itemId], 0)
  ctx.layout()
  return {
    machineNodes: ctx.machineNodes,
    mergerNodes: ctx.mergerNodes,
    splitterNodes: ctx.splitterNodes,
    edges: ctx.edges,
  }
}

class GraphBuilderContext {
  machineNodes: MachineNode[] = []
  mergerNodes: MergerNode[] = []
  splitterNodes: SplitterNode[] = []
  edges: GraphEdge[] = []

  private nodeCounter = 0
  private edgeCounter = 0

  constructor(
    private recipeChoices: Record<string, string>,
    private beltMk: number,
    private somersloop: boolean,
    private overclock: boolean
  ) {}

  private newId(prefix: string) { return prefix + (this.nodeCounter++) }
  private newEId() { return 'e' + (this.edgeCounter++) }

  buildPhysical(
    itemId: string,
    targetRate: number,
    recipeId: string | undefined,
    depth: number
  ): { nodeId: string; rate: number }[] {
    const belt = beltRate(this.beltMk)
    const rId = recipeId ?? this.recipeChoices[itemId] ?? ITEM_DEFAULT_RECIPE[itemId]

    if (!rId || !RECIPES[rId]) {
      const nodeId = this.newId('m')
      this.machineNodes.push({
        id: nodeId, type: 'machine', isRaw: true,
        item: itemId, recipeId: null,
        clkPct: 100, inputRates: {}, outputRate: targetRate,
        machineIndex: 0, machineCount: 1, depth,
        x: 0, y: 0,
      })
      return [{ nodeId, rate: targetRate }]
    }

    const recipe = RECIPES[rId]
    const outEntry = recipe.outputs.find(o => o.item === itemId)
    if (!outEntry) return []

    const baseRate = (outEntry.qty / recipe.time) * 60
    const effectiveBase = this.somersloop ? baseRate * 2 : baseRate
    const raw = targetRate / effectiveBase
    let numMachines: number, clkPct: number

    if (this.overclock) {
      numMachines = Math.ceil(raw)
      clkPct = (raw / numMachines) * 100
    } else {
      numMachines = Math.ceil(raw)
      clkPct = 100
    }

    const outPerMachine = effectiveBase * (clkPct / 100)
    const thisMachineIds: string[] = []

    for (let i = 0; i < numMachines; i++) {
      const mId = this.newId('m')
      const inputRates: Record<string, number> = {}
      for (const inp of recipe.inputs) {
        inputRates[inp.item] = (inp.qty / recipe.time) * 60 * (clkPct / 100)
      }
      this.machineNodes.push({
        id: mId, type: 'machine', isRaw: false,
        item: itemId, recipeId: rId,
        clkPct, inputRates, outputRate: outPerMachine,
        machineIndex: i, machineCount: numMachines, depth,
        x: 0, y: 0,
      })
      thisMachineIds.push(mId)
    }

    for (const inp of recipe.inputs) {
      const totalNeeded = (inp.qty / recipe.time) * 60 * (clkPct / 100) * numMachines
      const childRecipeId = this.recipeChoices[inp.item] ?? ITEM_DEFAULT_RECIPE[inp.item]
      const childProducers = this.buildPhysical(inp.item, totalNeeded, childRecipeId, depth + 1)
      const merged = this.buildMergerTree(childProducers, inp.item, depth + 1, belt)
      this.buildSplitterTree(merged, thisMachineIds, inp.item, totalNeeded, depth, belt)
    }

    return thisMachineIds.map(id => ({ nodeId: id, rate: outPerMachine }))
  }

  private buildMergerTree(
    producers: { nodeId: string; rate: number }[],
    item: string,
    depth: number,
    belt: number
  ): { nodeId: string; rate: number } {
    if (producers.length === 1) return producers[0]

    let current = [...producers]
    const mergerX = -depth * COL_W + MERGER_OFFSET

    while (current.length > 1) {
      const next: typeof current = []
      for (let i = 0; i < current.length; i += 3) {
        const batch = current.slice(i, i + 3)
        if (batch.length === 1) { next.push(batch[0]); continue }
        const totalRate = batch.reduce((s, p) => s + p.rate, 0)
        const mgId = this.newId('mg')
        this.mergerNodes.push({
          id: mgId, type: 'merger', item,
          inputNodeIds: batch.map(p => p.nodeId),
          totalRate, depth, mergerX,
          x: 0, y: 0,
        })
        for (const p of batch) {
          this.edges.push({ id: this.newEId(), fromId: p.nodeId, toId: mgId, rate: p.rate, overloaded: p.rate > belt, edgeType: 'merger_in' })
        }
        next.push({ nodeId: mgId, rate: totalRate })
      }
      current = next
    }
    return current[0]
  }

  private buildSplitterTree(
    source: { nodeId: string; rate: number },
    consumers: string[],
    item: string,
    totalRate: number,
    consumerDepth: number,
    belt: number
  ) {
    if (consumers.length === 1) {
      this.edges.push({ id: this.newEId(), fromId: source.nodeId, toId: consumers[0], rate: source.rate, overloaded: source.rate > belt, edgeType: 'belt' })
      return
    }

    let sources: { nodeId: string; rate: number; machines: string[] }[] = [
      { nodeId: source.nodeId, rate: source.rate, machines: [...consumers] }
    ]
    let levelX = -consumerDepth * COL_W - SPLITTER_OFFSET

    while (true) {
      if (sources.every(s => s.machines.length === 1)) break
      const next: typeof sources = []

      for (const src of sources) {
        if (src.machines.length === 1) { next.push(src); continue }

        const n = src.machines.length
        const splitCount = n <= 2 ? 2 : 3
        const actual = Math.min(splitCount, n)
        const spId = this.newId('sp')
        const rateEach = src.rate / actual

        const batches: string[][] = []
        const base = Math.floor(n / actual)
        let rem = n % actual
        let start = 0
        for (let k = 0; k < actual; k++) {
          const size = base + (rem-- > 0 ? 1 : 0)
          batches.push(src.machines.slice(start, start + size))
          start += size
        }

        this.splitterNodes.push({
          id: spId, type: 'splitter', item,
          inputRate: src.rate,
          outputs: batches.map(b => ({ nodeId: b.length === 1 ? b[0] : 'tbd', rate: rateEach })),
          splitterX: levelX, depth: consumerDepth,
          x: 0, y: 0,
        })
        this.edges.push({ id: this.newEId(), fromId: src.nodeId, toId: spId, rate: src.rate, overloaded: src.rate > belt, edgeType: 'splitter_in' })

        for (const b of batches) {
          next.push({ nodeId: spId, rate: rateEach, machines: b })
        }
      }

      sources = next
      levelX -= 80
      if (levelX < -9000) break
    }

    for (const src of sources) {
      this.edges.push({ id: this.newEId(), fromId: src.nodeId, toId: src.machines[0], rate: src.rate, overloaded: src.rate > belt, edgeType: 'splitter_out' })
    }

    // fix splitter output nodeIds
    for (const sp of this.splitterNodes) {
      const outEdges = this.edges.filter(e => e.fromId === sp.id)
      sp.outputs = outEdges.map(e => ({ nodeId: e.toId, rate: e.rate }))
    }
  }

  layout() {
    // Group machines by (depth, item)
    const depthGroups: Record<number, { item: string; isRaw: boolean; machines: MachineNode[] }[]> = {}
    for (const m of this.machineNodes) {
      if (!depthGroups[m.depth]) depthGroups[m.depth] = []
      let grp = depthGroups[m.depth].find(g => g.item === m.item && !m.isRaw)
      if (!grp || m.isRaw) {
        grp = { item: m.item, isRaw: m.isRaw, machines: [] }
        depthGroups[m.depth].push(grp)
      }
      grp.machines.push(m)
    }

    for (const [depthStr, groups] of Object.entries(depthGroups)) {
      const depth = parseInt(depthStr)
      const colX = -depth * COL_W
      const totalMachines = groups.reduce((s, g) => s + g.machines.length, 0)
      const totalH = (totalMachines - 1) * MACH_H + (groups.length - 1) * GROUP_GAP
      let curY = -totalH / 2

      for (let gi = 0; gi < groups.length; gi++) {
        const grp = groups[gi]
        for (let mi = 0; mi < grp.machines.length; mi++) {
          grp.machines[mi].x = colX
          grp.machines[mi].y = curY
          if (mi < grp.machines.length - 1) curY += MACH_H
        }
        curY += MACH_H + GROUP_GAP
      }
    }

    // Mergers: right of producer column
    for (const mg of this.mergerNodes) {
      mg.x = mg.mergerX
      const inputNodes = mg.inputNodeIds.map(id =>
        (this.machineNodes.find(n => n.id === id) ??
         this.mergerNodes.find(n => n.id === id) ??
         this.splitterNodes.find(n => n.id === id))
      ).filter((n): n is GraphNode => !!n)
      mg.y = inputNodes.length ? inputNodes.reduce((s, n) => s + n.y, 0) / inputNodes.length : 0
    }

    // Splitters: left of consumer column
    const getLeafY = (nodeId: string): number[] => {
      const m = this.machineNodes.find(n => n.id === nodeId)
      if (m) return [m.y]
      return this.edges.filter(e => e.fromId === nodeId).flatMap(e => getLeafY(e.toId))
    }

    for (const sp of this.splitterNodes) {
      sp.x = sp.splitterX
      const outEdges = this.edges.filter(e => e.fromId === sp.id)
      const leafYs = outEdges.flatMap(e => getLeafY(e.toId))
      sp.y = leafYs.length ? leafYs.reduce((s, y) => s + y, 0) / leafYs.length : 0
    }
  }
}

export function allNodes(state: GraphState): GraphNode[] {
  return [...state.machineNodes, ...state.mergerNodes, ...state.splitterNodes]
}
