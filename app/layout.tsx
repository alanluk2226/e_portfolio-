import type { Metadata } from 'next'
import './globals.css'
import SeasonEngine from './components/SeasonEngine'

export const metadata: Metadata = {
  title: 'Alan Luk | Portfolio',
  description: 'Cloud developer & cybersecurity enthusiast — In the clouds, you can decide anything.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body>
        <SeasonEngine />
        {children}
      </body>
    </html>
  )
}
