import { createFileRoute } from '@tanstack/react-router'

import { useSession } from '../../lib/auth-client'

export const Route = createFileRoute('/_app/home')({
  component: HomePage,
})

function HomePage() {
  const session = useSession()
  const user = session.data?.user

  return (
    <div className="h-full overflow-y-auto px-8 py-7">
      <h1 className="text-3xl font-black text-[#1a1a1a]">Welcome</h1>
      {user && (
        <p className="mt-2 text-sm text-gray-400">
          Signed in as <span className="font-semibold text-[#1a1a1a]">{user.email}</span>
        </p>
      )}
      <div className="mt-8 rounded-2xl bg-gray-50 p-6">
        <p className="text-sm text-gray-500">
          This is your application. Add your features here.
        </p>
      </div>
    </div>
  )
}
