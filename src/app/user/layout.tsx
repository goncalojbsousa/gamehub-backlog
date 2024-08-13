import { Metadata } from 'next'

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}


export async function generateMetadata(): Promise<Metadata> {

  return {}
}