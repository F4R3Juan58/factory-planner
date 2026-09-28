'use client'
import { useMemo } from 'react'
import { ITEMS, BUILDINGS, ITEM_DEFAULT_RECIPE, RAW_ITEMS, BELT_TIERS, MINER_TIERS, RECIPES, getItemRecipes, iconUrl, beltRate } from '@/lib/gameData'
import type { usePlanner } from '@/hooks/usePlanner'
import styles from './Sidebar.module.css'

type PlannerHook = ReturnType<typeof usePlanner>

function t(lang: string, en: string, es: string) { return lang === 'es' ? es : en }

export default function Sidebar({ planner }: { planner: PlannerHook }) {
  const { settings, setSettings, target, setTarget, graph, recipeChoices, calculate, recalculate, savedPlans, savePlan, deletePlan, loadPlan } = planner
  const { lang, beltMk, minerMk, overclock, somersloop, showDetails } = settings

  const eligible = useMemo(() =>
    Object.entries(ITEMS)
      .filter(([id]) => !RAW_ITEMS.includes(id) && ITEM_DEFAULT_RECIPE[id])
      .sort((a, b) => {
        const na = lang === 'es' ? a[1].nameEs : a[1].name
        const nb = lang === 'es' ? b[1].nameEs : b[1].name
        return na.localeCompare(nb)
      }),
    [lang]
  )

  // Collect crafted items for recipe panel
  const craftedItems = useMemo(() => {
    if (!graph) return []
    const map: Record<string, { count: number; recipeId: string }> = {}
    for (const n of graph.machineNodes) {
      if (n.isRaw || !n.recipeId) continue
      if (!map[n.item]) map[n.item] = { count: 0, recipeId: n.recipeId }
      map[n.item].count++
    }
    return Object.entries(map)
  }, [graph])

  const handleCalculate = () => {
    calculate(target, {})
  }

  const handleSave = () => {
    const name = window.prompt(
      t(lang, 'Plan name:', 'Nombre del plan:'),
      `${lang === 'es' ? ITEMS[target.itemId]?.nameEs : ITEMS[target.itemId]?.name} × ${target.rate}/min`
    )
    if (name) savePlan(name)
  }

  return (
    <aside className={styles.sidebar}>
      {/* Target */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>{t(lang,'TARGET ITEM','ÍTEM OBJETIVO')}</div>
        <div className={styles.field}>
          <select
            className={styles.select}
            value={target.itemId}
            onChange={e => setTarget(t2 => ({ ...t2, itemId: e.target.value }))}
          >
            {eligible.map(([id, it]) => (
              <option key={id} value={id}>{lang === 'es' ? it.nameEs : it.name}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>{t(lang,'Rate (items/min)','Tasa (items/min)')}</label>
          <div className={styles.inputRow}>
            <input
              className={styles.input}
              type="number" min="0.1" step="0.5"
              value={target.rate}
              onChange={e => setTarget(t2 => ({ ...t2, rate: parseFloat(e.target.value) || 10 }))}
            />
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleCalculate}>
              {t(lang,'Calculate','Calcular')}
            </button>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>{t(lang,'OPTIONS','OPCIONES')}</div>
        <label className={styles.checkRow}>
          <input type="checkbox" checked={overclock} onChange={e => setSettings(s => ({ ...s, overclock: e.target.checked }))} />
          <span>{t(lang,'Auto overclock / underclock','Sobrecarga automática')}</span>
        </label>
        <label className={styles.checkRow}>
          <input type="checkbox" checked={somersloop} onChange={e => setSettings(s => ({ ...s, somersloop: e.target.checked }))} />
          <span>{t(lang,'Use Somersloops (×2 output)','Usar Somersloops (×2 salida)')}</span>
        </label>
        <label className={styles.checkRow}>
          <input type="checkbox" checked={showDetails} onChange={e => setSettings(s => ({ ...s, showDetails: e.target.checked }))} />
          <span>{t(lang,'Show performance details','Mostrar detalles de rendimiento')}</span>
        </label>
      </div>

      {/* Tiers */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>{t(lang,'TIERS','TIERS')}</div>
        <div className={styles.tierRow}>
          <label className={styles.tierLabel}>Belt</label>
          <select
            className={styles.select}
            value={beltMk}
            onChange={e => setSettings(s => ({ ...s, beltMk: parseInt(e.target.value) }))}
          >
            {BELT_TIERS.map(b => (
              <option key={b.mk} value={b.mk}>Mk.{b.mk} — {b.rate}/min</option>
            ))}
          </select>
          <span className={styles.tierBadge}>{beltRate(beltMk)}/min</span>
        </div>
        <div className={styles.tierRow}>
          <label className={styles.tierLabel}>Miner</label>
          <select
            className={styles.select}
            value={minerMk}
            onChange={e => setSettings(s => ({ ...s, minerMk: parseInt(e.target.value) }))}
          >
            {MINER_TIERS.map(m => (
              <option key={m.mk} value={m.mk}>Mk.{m.mk} — {m.rate}/min</option>
            ))}
          </select>
        </div>
      </div>

      {/* Recipe Choices */}
      {craftedItems.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionLabel}>{t(lang,'RECIPE CHOICES','ELECCIÓN DE RECETAS')}</div>
          {craftedItems.map(([itemId, info]) => {
            const item = ITEMS[itemId]
            const allRecipes = getItemRecipes(itemId)
            const curRecipeId = recipeChoices[itemId] ?? info.recipeId
            const curRecipe = RECIPES[curRecipeId]
            const iUrl = iconUrl(itemId)
            const hasAlt = allRecipes.length > 1
            const isAlt = curRecipe?.alternate

            const buildingDef = curRecipe ? BUILDINGS[curRecipe.building] : null
            const building = curRecipe ? (lang === 'es' ? (buildingDef?.nameEs ?? curRecipe.building) : curRecipe.building) : ''

            return (
              <div key={itemId} className={styles.recipeItem}>
                <div className={styles.recipeHeader}>
                  <div className={styles.recipeIcon}>
                    {iUrl ? (
                      <img src={iUrl} alt="" width={24} height={24} style={{objectFit:'contain'}}
                        onError={e => { (e.target as HTMLImageElement).style.display='none' }} />
                    ) : '📦'}
                  </div>
                  <div className={styles.recipeName}>
                    {lang === 'es' ? item?.nameEs : item?.name}
                  </div>
                  <div className={styles.recipeCount}>×{info.count} {t(lang,'machines','máq.')}</div>
                </div>
                {hasAlt ? (
                  <select
                    className={`${styles.recipeSelect}${isAlt ? ' ' + styles.recipeSelectAlt : ''}`}
                    value={curRecipeId}
                    onChange={e => {
                      const newChoices = { ...recipeChoices, [itemId]: e.target.value }
                      recalculate(newChoices)
                    }}
                  >
                    {allRecipes.map(r => (
                      <option key={r} value={r}>
                        {lang === 'es' ? RECIPES[r]?.nameEs : RECIPES[r]?.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className={styles.recipeOnlyOne}>
                    {lang === 'es' ? curRecipe?.nameEs : curRecipe?.name} {t(lang,'(only recipe)','(única receta)')}
                  </div>
                )}
                {curRecipe && (
                  <div className={styles.recipeInfo}>
                    {building} · {curRecipe.inputs.map(i => `${i.qty} ${lang==='es'?ITEMS[i.item]?.nameEs:ITEMS[i.item]?.name}`).join(' + ')} → {curRecipe.outputs.map(o => `${o.qty} ${lang==='es'?ITEMS[o.item]?.nameEs:ITEMS[o.item]?.name}`).join(', ')}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Saved Plans */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>{t(lang,'SAVED PLANS','PLANES GUARDADOS')}</div>
        <button
          className={`${styles.btn} ${styles.btnSecondary} ${styles.btnFull} ${styles.btnSm}`}
          onClick={handleSave}
          style={{marginBottom: '10px'}}
          disabled={!graph}
        >
          💾 {t(lang,'Save Plan','Guardar Plan')}
        </button>
        {savedPlans.length === 0 ? (
          <div className={styles.emptyPlans}>{t(lang,'No saved plans','Sin planes guardados')}</div>
        ) : (
          savedPlans.map((p, i) => (
            <div key={p.ts} className={styles.planItem} onClick={() => loadPlan(p)}>
              <span className={styles.planName}>{p.name}</span>
              <span className={styles.planMeta}>{p.rate}/min</span>
              <button
                className={styles.planDelete}
                onClick={e => { e.stopPropagation(); deletePlan(i) }}
              >✕</button>
            </div>
          ))
        )}
      </div>
    </aside>
  )
}
