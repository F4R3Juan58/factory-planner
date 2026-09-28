'use client'
import { useRef, useState, useEffect, useCallback } from 'react'
import { allNodes, GraphNode, MachineNode, MergerNode, SplitterNode, GraphEdge } from '@/lib/graphBuilder'
import { ITEMS, RECIPES, BUILDINGS, iconUrl } from '@/lib/gameData'
import type { usePlanner } from '@/hooks/usePlanner'
import styles from './GraphCanvas.module.css'

type PlannerHook = ReturnType<typeof usePlanner>

// ─── Node rendering helpers ──────────────────────────────────────────────────

const NODE_W = 220
const NODE_H = 130
const MERG_W = 48
const MERG_H = 48
const SPLIT_W = 48
const SPLIT_H = 48

function clkColor(pct: number) {
  if (pct <= 50) return 'var(--blue)'
  if (pct <= 100) return 'var(--green)'
  return 'var(--orange)'
}

interface MachineNodeCardProps {
  node: MachineNode
  lang: string
  showDetails: boolean
  scale: number
}

function MachineNodeCard({ node, lang, showDetails, scale }: MachineNodeCardProps) {
  const recipe = node.recipeId ? RECIPES[node.recipeId] : null
  const item = ITEMS[node.item]
  const name = lang === 'es' ? (item?.nameEs ?? item?.name ?? node.item) : (item?.name ?? node.item)
  const building = recipe ? BUILDINGS[recipe.building] : null
  const buildingName = recipe ? (lang === 'es' ? (building?.nameEs ?? recipe.building) : recipe.building) : (node.isRaw ? 'Miner' : '?')
  const iUrl = iconUrl(node.item)
  const showClk = node.clkPct !== 100

  return (
    <div className={styles.machineNode}>
      <div className={styles.machineHeader}>
        <div className={styles.machineIcon}>
          {iUrl
            ? <img src={iUrl} alt="" width={28} height={28} style={{ objectFit: 'contain' }}
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
            : <span style={{ fontSize: 18 }}>📦</span>
          }
        </div>
        <div className={styles.machineMeta}>
          <div className={styles.machineName}>{name}</div>
          <div className={styles.machineBuilding}>{buildingName}</div>
        </div>
        <div className={styles.machineIdx}>
          {node.machineIndex + 1}/{node.machineCount}
        </div>
      </div>

      <div className={styles.machineStats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Out</span>
          <span className={styles.statValue}>{node.outputRate.toFixed(1)}/min</span>
        </div>
        {showClk && (
          <div className={styles.stat}>
            <span className={styles.statLabel}>Clk</span>
            <span className={styles.statValue} style={{ color: clkColor(node.clkPct) }}>
              {node.clkPct.toFixed(0)}%
            </span>
          </div>
        )}
      </div>

      {showDetails && recipe && (
        <div className={styles.machineInputs}>
          {recipe.inputs.map(inp => {
            const inItem = ITEMS[inp.item]
            const inName = lang === 'es' ? (inItem?.nameEs ?? inp.item) : (inItem?.name ?? inp.item)
            const rate = node.inputRates[inp.item] ?? 0
            return (
              <div key={inp.item} className={styles.inputRow}>
                <span className={styles.inputName}>{inName}</span>
                <span className={styles.inputRate}>{rate.toFixed(1)}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Canvas Component ────────────────────────────────────────────────────────

export default function GraphCanvas({ planner }: { planner: PlannerHook }) {
  const { graph, settings } = planner
  const { lang, showDetails } = settings

  const canvasRef = useRef<HTMLDivElement>(null)
  const [viewport, setViewport] = useState({ x: 0, y: 0, scale: 1 })
  const dragging = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })

  // fitView when graph changes
  const fitView = useCallback(() => {
    if (!graph || !canvasRef.current) return
    const nodes = allNodes(graph)
    if (nodes.length === 0) return

    const pad = 80
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    for (const n of nodes) {
      const w = n.type === 'machine' ? NODE_W : MERG_W
      const h = n.type === 'machine' ? NODE_H : MERG_H
      minX = Math.min(minX, n.x - w / 2)
      minY = Math.min(minY, n.y - h / 2)
      maxX = Math.max(maxX, n.x + w / 2)
      maxY = Math.max(maxY, n.y + h / 2)
    }

    const vw = canvasRef.current.clientWidth
    const vh = canvasRef.current.clientHeight
    const contentW = maxX - minX + pad * 2
    const contentH = maxY - minY + pad * 2
    const scale = Math.min(1, Math.max(0.08, vw / contentW, vh / contentH),
      Math.min(vw / contentW, vh / contentH))
    const cx = (minX + maxX) / 2
    const cy = (minY + maxY) / 2

    setViewport({ x: vw / 2 - cx * scale, y: vh / 2 - cy * scale, scale })
  }, [graph])

  useEffect(() => {
    if (graph) {
      // small delay to let layout settle
      const t = setTimeout(fitView, 50)
      return () => clearTimeout(t)
    }
  }, [graph, fitView])

  // Mouse pan
  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return
    dragging.current = true
    lastPos.current = { x: e.clientX, y: e.clientY }
  }
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return
    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    lastPos.current = { x: e.clientX, y: e.clientY }
    setViewport(v => ({ ...v, x: v.x + dx, y: v.y + dy }))
  }
  const onMouseUp = () => { dragging.current = false }

  // Wheel zoom
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const factor = e.deltaY < 0 ? 1.1 : 0.9
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    setViewport(v => {
      const newScale = Math.max(0.05, Math.min(3, v.scale * factor))
      const dx = (mx - v.x) * (newScale / v.scale - 1)
      const dy = (my - v.y) * (newScale / v.scale - 1)
      return { x: v.x - dx, y: v.y - dy, scale: newScale }
    })
  }

  // Touch pan
  const lastTouch = useRef({ x: 0, y: 0 })
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
  }
  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const dx = e.touches[0].clientX - lastTouch.current.x
      const dy = e.touches[0].clientY - lastTouch.current.y
      lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      setViewport(v => ({ ...v, x: v.x + dx, y: v.y + dy }))
    }
  }

  if (!graph) {
    return (
      <div className={styles.canvas} ref={canvasRef}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>⚙️</div>
          <div className={styles.emptyTitle}>No factory planned yet</div>
          <div className={styles.emptyDesc}>Select an item and rate, then click Calculate</div>
        </div>
      </div>
    )
  }

  const nodes = allNodes(graph)
  const { x: vx, y: vy, scale } = viewport

  // Stats
  const totalMachines = graph.machineNodes.filter(n => !n.isRaw).length
  const rawNodes = graph.machineNodes.filter(n => n.isRaw).length
  const overloadedEdges = graph.edges.filter(e => e.overloaded).length

  return (
    <div className={styles.canvas} ref={canvasRef}
      onMouseDown={onMouseDown} onMouseMove={onMouseMove}
      onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
      onWheel={onWheel}
      onTouchStart={onTouchStart} onTouchMove={onTouchMove}
      style={{ cursor: dragging.current ? 'grabbing' : 'grab' }}
    >
      {/* Stats bar */}
      <div className={styles.statsBar}>
        <span className={styles.statChip}>🏭 {totalMachines} machines</span>
        {rawNodes > 0 && <span className={styles.statChip}>⛏ {rawNodes} extractors</span>}
        {overloadedEdges > 0 && <span className={styles.statChip} style={{ color: 'var(--red)' }}>⚠ {overloadedEdges} overloaded belts</span>}
        <span className={styles.statChip} style={{ marginLeft: 'auto' }}>{Math.round(scale * 100)}%</span>
      </div>

      {/* Zoom controls */}
      <div className={styles.zoomControls}>
        <button className={styles.zoomBtn} onClick={() => setViewport(v => ({ ...v, scale: Math.min(3, v.scale * 1.2) }))}>+</button>
        <button className={styles.zoomBtn} onClick={() => setViewport(v => ({ ...v, scale: Math.max(0.05, v.scale * 0.8) }))}>−</button>
        <button className={styles.zoomBtn} onClick={fitView} title="Fit view">⊡</button>
      </div>

      {/* World */}
      <div
        className={styles.world}
        style={{ transform: `translate(${vx}px,${vy}px) scale(${scale})`, transformOrigin: '0 0' }}
      >
        {/* SVG edges */}
        <svg className={styles.edgeSvg} style={{ overflow: 'visible', position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
          {graph.edges.map(edge => <EdgeLine key={edge.id} edge={edge} nodes={nodes} scale={scale} />)}
        </svg>

        {/* Machine nodes */}
        {graph.machineNodes.map(node => (
          <div
            key={node.id}
            className={`${styles.nodeWrapper} ${node.isRaw ? styles.nodeRaw : ''}`}
            style={{
              left: node.x - NODE_W / 2,
              top: node.y - NODE_H / 2,
              width: NODE_W,
              minHeight: NODE_H,
            }}
          >
            <MachineNodeCard node={node} lang={lang} showDetails={showDetails} scale={scale} />
          </div>
        ))}

        {/* Merger nodes */}
        {graph.mergerNodes.map(node => (
          <div
            key={node.id}
            className={styles.mergerNode}
            style={{
              left: node.x - MERG_W / 2,
              top: node.y - MERG_H / 2,
              width: MERG_W,
              height: MERG_H,
            }}
            title={`Merger: ${node.totalRate.toFixed(1)}/min`}
          >
            <span>⑇</span>
          </div>
        ))}

        {/* Splitter nodes */}
        {graph.splitterNodes.map(node => (
          <div
            key={node.id}
            className={styles.splitterNode}
            style={{
              left: node.x - SPLIT_W / 2,
              top: node.y - SPLIT_H / 2,
              width: SPLIT_W,
              height: SPLIT_H,
            }}
            title={`Splitter: ${node.inputRate.toFixed(1)}/min`}
          >
            <span>⑂</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Edge line ───────────────────────────────────────────────────────────────

function nodeCenter(nodeId: string, nodes: GraphNode[]): { x: number; y: number } | null {
  const n = nodes.find(n => n.id === nodeId)
  if (!n) return null
  return { x: n.x, y: n.y }
}

function EdgeLine({ edge, nodes, scale }: { edge: GraphEdge; nodes: GraphNode[]; scale: number }) {
  const from = nodeCenter(edge.fromId, nodes)
  const to = nodeCenter(edge.toId, nodes)
  if (!from || !to) return null

  // Horizontal bezier from right edge of from to left edge of to
  const fromNode = nodes.find(n => n.id === edge.fromId)
  const toNode = nodes.find(n => n.id === edge.toId)

  const fromX = from.x + (fromNode?.type === 'machine' ? NODE_W / 2 : MERG_W / 2)
  const toX = to.x - (toNode?.type === 'machine' ? NODE_W / 2 : SPLIT_W / 2)
  const fromY = from.y
  const toY = to.y

  const dx = Math.abs(toX - fromX) * 0.4
  const path = `M ${fromX} ${fromY} C ${fromX + dx} ${fromY}, ${toX - dx} ${toY}, ${toX} ${toY}`

  const color = edge.overloaded ? 'var(--red)' : edge.edgeType === 'splitter_out' ? 'var(--accent)' : 'var(--border2)'
  const strokeW = Math.max(1.5, 2 / scale)

  return (
    <g>
      <path d={path} fill="none" stroke={color} strokeWidth={strokeW} opacity={0.75} />
      {/* Rate label */}
      <text
        x={(fromX + toX) / 2}
        y={(fromY + toY) / 2 - 6}
        textAnchor="middle"
        fontSize={Math.max(9, 11 / scale)}
        fill={color}
        opacity={0.9}
        fontFamily="var(--mono, monospace)"
      >
        {edge.rate.toFixed(1)}
      </text>
    </g>
  )
}
