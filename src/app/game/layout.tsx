import { Metadata } from 'next'

export default function GameLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}


export async function generateMetadata(): Promise<Metadata> {

  return {}
}