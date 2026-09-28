import { useState, useCallback } from 'react'
import { buildGraph, GraphState, allNodes } from '@/lib/graphBuilder'
import { ITEM_DEFAULT_RECIPE } from '@/lib/gameData'

export interface PlannerSettings {
  beltMk: number
  minerMk: number
  overclock: boolean
  somersloop: boolean
  showDetails: boolean
  lang: 'en' | 'es'
}

export interface PlannerTarget {
  itemId: string
  rate: number
}

export interface SavedPlan {
  name: string
  itemId: string
  rate: number
  beltMk: number
  minerMk: number
  ts: number
}

export function usePlanner() {
  const [settings, setSettings] = useState<PlannerSettings>({
    beltMk: 4,
    minerMk: 2,
    overclock: true,
    somersloop: false,
    showDetails: true,
    lang: 'en',
  })

  const [target, setTarget] = useState<PlannerTarget>({ itemId: 'ReinforcedPlate', rate: 10 })
  const [graph, setGraph] = useState<GraphState | null>(null)
  const [recipeChoices, setRecipeChoices] = useState<Record<string, string>>({})
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>(() => {
    try { return JSON.parse(localStorage.getItem('sf-plans') ?? '[]') } catch { return [] }
  })

  const calculate = useCallback((newTarget?: PlannerTarget, newRecipeChoices?: Record<string, string>) => {
    const t = newTarget ?? target
    const rc = newRecipeChoices ?? {}
    const state = buildGraph(
      t.itemId, t.rate, rc,
      settings.beltMk, settings.somersloop, settings.overclock
    )
    setGraph(state)
    setRecipeChoices(rc)
  }, [target, settings])

  const recalculate = useCallback((newRecipeChoices: Record<string, string>) => {
    const state = buildGraph(
      target.itemId, target.rate, newRecipeChoices,
      settings.beltMk, settings.somersloop, settings.overclock
    )
    setGraph(state)
    setRecipeChoices(newRecipeChoices)
  }, [target, settings])

  const savePlan = useCallback((name: string) => {
    const plan: SavedPlan = { name, itemId: target.itemId, rate: target.rate, beltMk: settings.beltMk, minerMk: settings.minerMk, ts: Date.now() }
    const next = [plan, ...savedPlans]
    setSavedPlans(next)
    try { localStorage.setItem('sf-plans', JSON.stringify(next)) } catch {}
  }, [target, settings, savedPlans])

  const deletePlan = useCallback((i: number) => {
    const next = savedPlans.filter((_, idx) => idx !== i)
    setSavedPlans(next)
    try { localStorage.setItem('sf-plans', JSON.stringify(next)) } catch {}
  }, [savedPlans])

  const loadPlan = useCallback((plan: SavedPlan) => {
    const t = { itemId: plan.itemId, rate: plan.rate }
    setTarget(t)
    setSettings(s => ({ ...s, beltMk: plan.beltMk, minerMk: plan.minerMk }))
    const rc: Record<string, string> = {}
    const state = buildGraph(t.itemId, t.rate, rc, plan.beltMk, settings.somersloop, settings.overclock)
    setGraph(state)
    setRecipeChoices(rc)
  }, [settings])

  return {
    settings, setSettings,
    target, setTarget,
    graph, recipeChoices,
    calculate, recalculate,
    savedPlans, savePlan, deletePlan, loadPlan,
  }
}
