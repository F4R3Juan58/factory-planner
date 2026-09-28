import type { Metadata } from 'next'
import { Inter, Rajdhani, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--inter', display: 'swap' })
const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['400','500','600','700'], variable: '--rajdhani', display: 'swap' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--mono', display: 'swap' })

export const metadata: Metadata = {
  title: 'Factory Planner',
  description: 'Satisfactory factory production planner with physical machine layout',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${rajdhani.variable} ${jetbrainsMono.variable}`}>
      <body style={{ fontFamily: 'var(--inter)', height: '100%', display: 'flex', flexDirection: 'column' }}>
        {children}
      </body>
    </html>
  )
}
