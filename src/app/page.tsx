'use client'
import dynamic from 'next/dynamic'

// Load the full planner client-side only (uses browser APIs: canvas, localStorage)
const PlannerApp = dynamic(() => import('@/components/PlannerApp'), { ssr: false })

export default function Home() {
  return <PlannerApp />
}
