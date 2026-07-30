import type { Metadata } from 'next'
import './globals.css'
import SeasonEngine from './components/SeasonEngine'

export const metadata: Metadata = {
  title: 'Alan Luk | AI & Full-Stack Developer',
  description:
    'Computer Science student focused on AI automation and full-stack development. Internship experience building multi-platform content bots and web apps.',
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
