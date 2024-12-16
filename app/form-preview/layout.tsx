import { Suspense } from 'react'

export default function ApplyLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="container m-auto min-h-screen max-w-xl">
      <Suspense>{children}</Suspense>
    </div>
  )
}
