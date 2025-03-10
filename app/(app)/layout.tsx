import { Nav } from './components/nav'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Nav />
      <div className="flex flex-col w-full min-h-full ml-68">{children}</div>
    </div>
  )
}
