'use client'
import { useState } from 'react'
import { usePlanner } from '@/hooks/usePlanner'
import Sidebar from './Sidebar'
import GraphCanvas from './GraphCanvas'
import ElevatorPanel from './ElevatorPanel'
import styles from './PlannerApp.module.css'

export default function PlannerApp() {
  const [tab, setTab] = useState<'planner' | 'elevator'>('planner')
  const planner = usePlanner()
  const { settings, setSettings } = planner

  const toggleLang = () => setSettings(s => ({ ...s, lang: s.lang === 'en' ? 'es' : 'en' }))
  const lang = settings.lang

  return (
    <div className={styles.root}>
      {/* ─── HEADER ─── */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>⚙</div>
          <span>Factory<span className={styles.logoAccent}>Planner</span></span>
        </div>

        <div className={styles.headerMid}>
          <div className={styles.navTabs}>
            <button
              className={`${styles.navTab} ${tab === 'planner' ? styles.navTabActive : ''}`}
              onClick={() => setTab('planner')}
            >
              🏭 Planner
            </button>
            <button
              className={`${styles.navTab} ${tab === 'elevator' ? styles.navTabActive : ''}`}
              onClick={() => setTab('elevator')}
            >
              🚀 Space Elevator
            </button>
          </div>
        </div>

        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={toggleLang} title="Switch language">
            {lang === 'en' ? '🇬🇧' : '🇪🇸'}
          </button>
        </div>
      </header>

      {/* ─── BODY ─── */}
      <div className={styles.appBody}>
        {tab === 'planner' ? (
          <>
            <Sidebar planner={planner} />
            <GraphCanvas planner={planner} />
          </>
        ) : (
          <ElevatorPanel
            lang={lang}
            onPlanItem={(itemId, rate) => {
              setTab('planner')
              planner.setTarget({ itemId, rate })
              planner.calculate({ itemId, rate }, {})
            }}
          />
        )}
      </div>
    </div>
  )
}
