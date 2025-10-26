import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Frontend App',
  description: 'Frontend application with TDD',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
