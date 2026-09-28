'use client'
import { useState } from 'react'
import { SPACE_ELEVATOR_PHASES, ITEMS, ITEM_DEFAULT_RECIPE, iconUrl } from '@/lib/gameData'
import styles from './ElevatorPanel.module.css'

interface Props {
  lang: string
  onPlanItem: (itemId: string, rate: number) => void
}

function t(lang: string, en: string, es: string) { return lang === 'es' ? es : en }

export default function ElevatorPanel({ lang, onPlanItem }: Props) {
  const [openPhase, setOpenPhase] = useState<number>(0)

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.title}>🚀 {t(lang, 'Space Elevator', 'Ascensor Espacial')}</div>
        <div className={styles.subtitle}>
          {t(lang, 'Deliver parts to unlock new tiers of technology.', 'Entrega piezas para desbloquear nuevos niveles de tecnología.')}
        </div>
      </div>

      <div className={styles.phases}>
        {SPACE_ELEVATOR_PHASES.map((phase, pi) => (
          <div key={pi} className={styles.phaseBlock}>
            <button
              className={`${styles.phaseHeader} ${openPhase === pi ? styles.phaseHeaderOpen : ''}`}
              onClick={() => setOpenPhase(openPhase === pi ? -1 : pi)}
            >
              <span className={styles.phaseNumber}>Phase {phase.phase}</span>
              <span className={styles.phaseName}>{lang === 'es' ? phase.nameEs : phase.name}</span>
              <span className={styles.phaseChevron}>{openPhase === pi ? '▾' : '▸'}</span>
            </button>

            {openPhase === pi && (
              <div className={styles.milestones}>
                {phase.milestones.map((ms, mi) => (
                  <div key={mi} className={`${styles.milestone} ${ms.isMilestone ? styles.milestoneHighlight : ''}`}>
                    <div className={styles.msName}>
                      {ms.isMilestone && <span className={styles.msBadge}>🚀</span>}
                      {lang === 'es' ? ms.nameEs : ms.name}
                    </div>
                    <div className={styles.msItems}>
                      {ms.items.map(ei => {
                        const item = ITEMS[ei.item]
                        const name = lang === 'es' ? (item?.nameEs ?? ei.item) : (item?.name ?? ei.item)
                        const iUrl = iconUrl(ei.item)
                        const canPlan = !!ITEM_DEFAULT_RECIPE[ei.item]

                        return (
                          <div key={ei.item} className={styles.msItem}>
                            <div className={styles.msItemIcon}>
                              {iUrl
                                ? <img src={iUrl} alt="" width={20} height={20} style={{ objectFit: 'contain' }}
                                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                                : '📦'
                              }
                            </div>
                            <span className={styles.msItemName}>{name}</span>
                            <span className={styles.msItemQty}>×{ei.qty}</span>
                            {canPlan && (
                              <button
                                className={styles.planBtn}
                                onClick={() => onPlanItem(ei.item, Math.ceil(ei.qty / 10))}
                                title={t(lang, 'Plan this item', 'Planificar este ítem')}
                              >
                                📐
                              </button>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
