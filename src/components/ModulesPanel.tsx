'use client'
import { useMemo, useState } from 'react'
import { ITEMS, BUILDINGS, RECIPES, iconUrl, beltRate } from '@/lib/gameData'
import { planModules, FactoryModule, ModuleSettings, FOUNDATION } from '@/lib/modulePlanner'
import type { usePlanner } from '@/hooks/usePlanner'
import styles from './ModulesPanel.module.css'

type PlannerHook = ReturnType<typeof usePlanner>

function t(lang: string, en: string, es: string) { return lang === 'es' ? es : en }
const fmt = (n: number) => (Math.round(n * 10) / 10).toLocaleString('es-ES', { maximumFractionDigits: 1 })
const INPUT_COLORS = ['var(--blue)', 'var(--green)', 'var(--purple)', 'var(--red)']

function itemName(lang: string, id: string) {
  const it = ITEMS[id]
  return it ? (lang === 'es' ? it.nameEs : it.name) : id
}

function Icon({ id, size = 22 }: { id: string; size?: number }) {
  const [broken, setBroken] = useState(false)
  const url = iconUrl(id)
  if (!url || broken) return <span className={styles.iconFallback} style={{ width: size, height: size }}>{itemName('en', id).slice(0, 1)}</span>
  return <img src={url} alt="" width={size} height={size} className={styles.icon} onError={() => setBroken(true)} />
}

// ─── SIDE VIEW (floors stacked) ──────────────────────────────────────────────

function Elevation({ m, lang }: { m: FactoryModule; lang: string }) {
  const bld = BUILDINGS[m.building]
  const padL = 34, padR = 22, padT = 14, padB = 18
  const W = 300
  const scale = Math.min((W - padL - padR) / m.floorW, 240 / m.totalH)
  const H = padT + m.totalH * scale + padB
  const gx = (x: number) => padL + x * scale
  const gy = (y: number) => padT + (m.totalH - y) * scale        // y = metres above ground

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg} role="img"
      aria-label={t(lang, 'Side view', 'Vista lateral')}>
      {/* input lift (left) and output lift (right) */}
      <line x1={gx(1.5)} x2={gx(1.5)} y1={gy(0) + 10} y2={gy(m.totalH - m.floorH + 2)} className={styles.liftIn} />
      <line x1={gx(m.floorW - 1.5)} x2={gx(m.floorW - 1.5)} y1={gy(m.totalH - m.floorH + 2)} y2={gy(0) + 10} className={styles.liftOut} />
      <text x={gx(1.5)} y={H - 3} className={styles.svgLabelIn} textAnchor="middle">▲ {t(lang, 'in', 'entra')}</text>
      <text x={gx(m.floorW - 1.5)} y={H - 3} className={styles.svgLabelOut} textAnchor="middle">{t(lang, 'out', 'sale')} ▼</text>

      {m.floors.map((f, i) => {
        const base = i * m.floorH
        const front = f.perRow[0]
        return (
          <g key={i}>
            <rect x={gx(0)} y={gy(base) } width={m.floorW * scale} height={Math.max(2, 1 * scale)} className={styles.slab} />
            {Array.from({ length: front }).map((_, k) => {
              const cx = 4 + m.pitch * (k + 0.5)
              return (
                <rect key={k} x={gx(cx - bld.w / 2)} y={gy(base + 1 + bld.h)} width={bld.w * scale} height={bld.h * scale}
                  rx={1.5} className={styles.machineSide} />
              )
            })}
            {/* belt taps from lifts at this floor */}
            <line x1={gx(1.5)} x2={gx(4)} y1={gy(base + 2)} y2={gy(base + 2)} className={styles.liftIn} />
            <line x1={gx(m.floorW - 4)} x2={gx(m.floorW - 1.5)} y1={gy(base + 2)} y2={gy(base + 2)} className={styles.liftOut} />
            <text x={4} y={gy(base + m.floorH / 2) + 4} className={styles.svgLabel}>P{i + 1}</text>
            {f.rows > 1 && (
              <text x={gx(m.floorW / 2)} y={gy(base + 1 + bld.h) - 3} className={styles.svgLabelDim} textAnchor="middle">
                ×{f.rows} {t(lang, 'rows', 'filas')} ({f.perRow.join('+')})
              </text>
            )}
          </g>
        )
      })}
      <rect x={gx(0)} y={gy(m.totalH)} width={m.floorW * scale} height={1} className={styles.slab} />
      <text x={W - 2} y={gy(m.totalH) - 3} className={styles.svgLabelDim} textAnchor="end">{m.totalH} m</text>
    </svg>
  )
}

// ─── TOP VIEW (one floor) ────────────────────────────────────────────────────

function FloorPlan({ m, lang }: { m: FactoryModule; lang: string }) {
  const bld = BUILDINGS[m.building]
  const recipe = RECIPES[m.recipeId]
  const floor = m.floors.reduce((a, b) => (b.machines > a.machines ? b : a))
  const gridW = m.footprintF.w * FOUNDATION
  const gridL = m.footprintF.l * FOUNDATION
  const pad = 14
  const W = 300
  const scale = Math.min((W - pad * 2) / gridW, 300 / gridL)
  const H = gridL * scale + pad * 2
  const offX = pad + (gridW - m.floorW) / 2 * scale
  const offY = pad + (gridL - m.floorL) / 2 * scale
  const gx = (x: number) => offX + x * scale
  const gy = (y: number) => offY + y * scale
  const nIn = recipe.inputs.length

  // Row 0: inputs on top, output lane below. Row 1 is mirrored and shares that output lane.
  const rows = floor.perRow.map((count, r) => ({ count, mirrored: r === 1 }))

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg} role="img"
      aria-label={t(lang, 'Floor plan', 'Planta de un piso')}>
      {/* foundation grid */}
      {Array.from({ length: m.footprintF.w }).map((_, i) =>
        Array.from({ length: m.footprintF.l }).map((__, j) => (
          <rect key={`${i}-${j}`} x={pad + i * FOUNDATION * scale} y={pad + j * FOUNDATION * scale}
            width={FOUNDATION * scale} height={FOUNDATION * scale} className={styles.foundation} />
        ))
      )}

      {rows.map((row, r) => {
        const bodyTop = row.mirrored ? m.laneIn + bld.l + m.laneOut : m.laneIn
        const inLaneTop = row.mirrored ? bodyTop + bld.l : 0
        const outY = m.laneIn + bld.l + m.laneOut / 2
        const xs = Array.from({ length: row.count }).map((_, k) => 4 + m.pitch * (k + 0.5))
        const lastX = xs[xs.length - 1] ?? 4
        return (
          <g key={r}>
            {/* input manifolds, one belt per ingredient */}
            {recipe.inputs.slice(0, 4).map((inp, ii) => {
              const y = inLaneTop + 1.5 + ii * 2
              const color = INPUT_COLORS[ii % INPUT_COLORS.length]
              return (
                <g key={inp.item}>
                  <line x1={gx(0.5)} x2={gx(lastX)} y1={gy(y)} y2={gy(y)} stroke={color} className={styles.belt} />
                  {xs.map((x, k) => (
                    <g key={k}>
                      <rect x={gx(x) - 3} y={gy(y) - 3} width={6} height={6} fill={color} className={styles.splitter} />
                      <line x1={gx(x + (ii - (nIn - 1) / 2) * 1.2)} x2={gx(x + (ii - (nIn - 1) / 2) * 1.2)}
                        y1={gy(y)} y2={gy(row.mirrored ? bodyTop + bld.l : bodyTop)} stroke={color} className={styles.feed} />
                    </g>
                  ))}
                </g>
              )
            })}
            {/* machines */}
            {xs.map((x, k) => (
              <g key={k}>
                <rect x={gx(x - bld.w / 2)} y={gy(bodyTop)} width={bld.w * scale} height={bld.l * scale} rx={2}
                  className={styles.machineTop} />
                <text x={gx(x)} y={gy(bodyTop + bld.l / 2) + 3} textAnchor="middle" className={styles.machineLabel}>
                  {fmt(m.clkPct)}%
                </text>
                <line x1={gx(x)} x2={gx(x)} y1={gy(row.mirrored ? bodyTop : bodyTop + bld.l)} y2={gy(outY)} className={styles.feedOut} />
                <rect x={gx(x) - 3} y={gy(outY) - 3} width={6} height={6} className={styles.merger} />
              </g>
            ))}
            {r === 0 && (
              <line x1={gx(xs[0] ?? 4)} x2={gx(m.floorW - 0.5)} y1={gy(outY)} y2={gy(outY)} className={styles.beltOut} />
            )}
          </g>
        )
      })}
      <text x={pad} y={H - 3} className={styles.svgLabelDim}>
        {m.footprintF.w}×{m.footprintF.l} {t(lang, 'foundations', 'cimientos')} · {FOUNDATION} m
      </text>
    </svg>
  )
}

// ─── MODULE CARD ─────────────────────────────────────────────────────────────

function ModuleCard({ m, lang, beltMk, onJump }: { m: FactoryModule; lang: string; beltMk: number; onJump: (item: string) => void }) {
  const bld = BUILDINGS[m.building]
  const recipe = RECIPES[m.recipeId]
  const belt = beltRate(beltMk)
  const floorCounts = m.floors.map(f => f.machines)
  const sameFloors = floorCounts.every(c => c === floorCounts[0])

  return (
    <article id={`mod-${m.item}`} className={styles.card}>
      <header className={styles.cardHead}>
        <Icon id={m.item} size={32} />
        <div className={styles.cardTitle}>
          <h3>{itemName(lang, m.item)} <span className={styles.rate}>{fmt(m.rate)}/min</span></h3>
          <div className={styles.cardSub}>
            {lang === 'es' ? recipe.nameEs : recipe.name}
            {recipe.alternate && <span className={styles.altBadge}>ALT</span>}
          </div>
        </div>
        <div className={styles.machineBadge}>
          {bld.icon} {lang === 'es' ? bld.nameEs : bld.name} ×{m.machines}
          <span className={styles.clk}>@ {fmt(m.clkPct)}%</span>
        </div>
      </header>

      <dl className={styles.specs}>
        <div><dt>{t(lang, 'Floors', 'Pisos')}</dt><dd>{m.floors.length}</dd></div>
        <div><dt>{t(lang, 'Per floor', 'Por piso')}</dt>
          <dd>{sameFloors ? floorCounts[0] : floorCounts.join(' / ')}</dd></div>
        <div><dt>{t(lang, 'Footprint', 'Planta')}</dt><dd>{m.footprintF.w}×{m.footprintF.l} <small>{t(lang, 'fnd', 'cim.')}</small></dd></div>
        <div><dt>{t(lang, 'Height', 'Altura')}</dt><dd>{m.totalH} m <small>({m.floorH} m/{t(lang, 'floor', 'piso')})</small></dd></div>
        <div><dt>{t(lang, 'Power', 'Energía')}</dt><dd>{fmt(m.powerMW)} MW</dd></div>
      </dl>

      <div className={styles.cardBody}>
        <div className={styles.flows}>
          <div className={styles.flowLabel}>{t(lang, 'IN (lift on the left)', 'ENTRA (elevador izquierdo)')}</div>
          {m.inputs.map((io, ii) => {
            const fromModule = !m.rawInputs.includes(io.item)
            return (
              <div key={io.item} className={styles.flowRow}>
                <span className={styles.swatch} style={{ background: INPUT_COLORS[ii % INPUT_COLORS.length] }} />
                <Icon id={io.item} size={18} />
                {fromModule
                  ? <button className={styles.linkBtn} onClick={() => onJump(io.item)}>{itemName(lang, io.item)}</button>
                  : <span className={styles.flowName}>{itemName(lang, io.item)} <small>({t(lang, 'raw', 'bruto')})</small></span>}
                <span className={styles.flowRate}>{fmt(io.total)}/min</span>
                {m.floors.length > 1 && <span className={styles.flowFloor}>{fmt(io.perFloor)}/{t(lang, 'floor', 'piso')}</span>}
                {io.belts > 1 && <span className={styles.warn} title={`${belt}/min`}>{io.belts} {t(lang, 'belts', 'cintas')}</span>}
              </div>
            )
          })}
          <div className={styles.flowLabel}>{t(lang, 'OUT (lift on the right)', 'SALE (elevador derecho)')}</div>
          <div className={styles.flowRow}>
            <span className={styles.swatch} style={{ background: 'var(--accent)' }} />
            <Icon id={m.item} size={18} />
            <span className={styles.flowName}>{itemName(lang, m.item)}</span>
            <span className={styles.flowRate}>{fmt(m.output.total)}/min</span>
            {m.output.belts > 1 && <span className={styles.warn}>{m.output.belts} {t(lang, 'belts', 'cintas')}</span>}
          </div>
          {m.consumers.length > 0 && (
            <div className={styles.goesTo}>
              → {t(lang, 'feeds', 'alimenta a')}{' '}
              {m.consumers.map((c, i) => (
                <span key={c}>{i > 0 && ', '}<button className={styles.linkBtn} onClick={() => onJump(c)}>{itemName(lang, c)}</button></span>
              ))}
            </div>
          )}
          {m.consumers.length === 0 && <div className={styles.goesTo}>★ {t(lang, 'Final product', 'Producto final')}</div>}
        </div>

        <figure className={styles.drawing}>
          <figcaption>{t(lang, 'Side view', 'Vista lateral')}</figcaption>
          <Elevation m={m} lang={lang} />
        </figure>
        <figure className={styles.drawing}>
          <figcaption>{t(lang, 'Floor plan (busiest floor)', 'Planta (piso más lleno)')}</figcaption>
          <FloorPlan m={m} lang={lang} />
        </figure>
      </div>
    </article>
  )
}

// ─── PANEL ───────────────────────────────────────────────────────────────────

export default function ModulesPanel({ planner }: { planner: PlannerHook }) {
  const { settings, target, graph, recipeChoices } = planner
  const { lang } = settings
  const [maxWidthF, setMaxWidthF] = useState(6)
  const [rowsPerFloor, setRowsPerFloor] = useState<1 | 2>(2)
  const [maxFloors, setMaxFloors] = useState(6)

  const modules = useMemo(() => {
    if (!graph) return []
    const s: ModuleSettings = {
      maxWidthF, rowsPerFloor, maxFloors,
      beltMk: settings.beltMk, overclock: settings.overclock, somersloop: settings.somersloop,
    }
    return planModules(target.itemId, target.rate, recipeChoices, s)
  }, [graph, target, recipeChoices, settings.beltMk, settings.overclock, settings.somersloop, maxWidthF, rowsPerFloor, maxFloors])

  const totals = useMemo(() => ({
    machines: modules.reduce((s, m) => s + m.machines, 0),
    floors: modules.reduce((s, m) => s + m.floors.length, 0),
    area: modules.reduce((s, m) => s + m.footprintF.w * m.footprintF.l, 0),
    flat: modules.reduce((s, m) => s + m.flatFootprintF, 0),
    power: modules.reduce((s, m) => s + m.powerMW, 0),
  }), [modules])

  const jump = (item: string) =>
    document.getElementById(`mod-${item}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  if (!graph) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyTitle}>{t(lang, 'No plan yet', 'Aún no hay plan')}</div>
        <div>{t(lang, 'Pick an item and press Calculate to design its modules.', 'Elige un ítem y pulsa Calcular para diseñar sus módulos.')}</div>
      </div>
    )
  }

  return (
    <div className={styles.panel}>
      <div className={styles.toolbar}>
        <label className={styles.ctl}>
          <span>{t(lang, 'Max platform width', 'Ancho máx. de plataforma')}</span>
          <select value={maxWidthF} onChange={e => setMaxWidthF(parseInt(e.target.value))}>
            {[3, 4, 5, 6, 8, 10, 12, 16].map(n => <option key={n} value={n}>{n} {t(lang, 'fnd', 'cim.')} ({n * 8} m)</option>)}
          </select>
        </label>
        <label className={styles.ctl}>
          <span>{t(lang, 'Rows per floor', 'Filas por piso')}</span>
          <select value={rowsPerFloor} onChange={e => setRowsPerFloor(parseInt(e.target.value) as 1 | 2)}>
            <option value={1}>1</option>
            <option value={2}>2 ({t(lang, 'shared output', 'salida compartida')})</option>
          </select>
        </label>
        <label className={styles.ctl}>
          <span>{t(lang, 'Max floors', 'Pisos máx.')}</span>
          <select value={maxFloors} onChange={e => setMaxFloors(parseInt(e.target.value))}>
            {[2, 3, 4, 6, 8, 10, 15].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
      </div>

      <div className={styles.summary}>
        <div><strong>{modules.length}</strong> {t(lang, 'modules', 'módulos')}</div>
        <div><strong>{totals.machines}</strong> {t(lang, 'machines', 'máquinas')}</div>
        <div><strong>{totals.floors}</strong> {t(lang, 'floors', 'pisos')}</div>
        <div><strong>{totals.area}</strong> {t(lang, 'foundations of ground', 'cimientos de suelo')}
          {totals.flat > totals.area && <span className={styles.saving}> vs {totals.flat} {t(lang, 'flat', 'en plano')} (−{Math.round((1 - totals.area / totals.flat) * 100)}%)</span>}
        </div>
        <div><strong>{fmt(totals.power)}</strong> MW</div>
      </div>

      <p className={styles.hint}>
        {t(lang,
          'Build order: top to bottom. Each module takes its inputs up a lift on the left, splits them onto every floor, and sends the product down a lift on the right. Sizes are approximate in-game footprints.',
          'Orden de construcción: de arriba abajo. Cada módulo sube sus entradas por un elevador a la izquierda, las reparte en cada piso y baja el producto por un elevador a la derecha. Las medidas son aproximadas a las del juego.')}
      </p>

      <div className={styles.list}>
        {modules.map(m => <ModuleCard key={m.item} m={m} lang={lang} beltMk={settings.beltMk} onJump={jump} />)}
      </div>
    </div>
  )
}
