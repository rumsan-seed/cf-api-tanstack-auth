import * as React from 'react'
import { useNavigate } from '@tanstack/react-router'
import { LogOut, Settings, User } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@rs/ui/dropdown-menu'
import { cn } from '@rs/ui'

import type { AuthUser } from '../../lib/auth-client'

export interface AppHeaderProps {
  user: AuthUser
  onLogout: () => void
  /** Optional slot for search or breadcrumbs */
  left?: React.ReactNode
}

export function AppHeader({ user, onLogout, left }: AppHeaderProps) {
  const navigate = useNavigate()

  const initials = user.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

  return (
    <header className="sticky top-0 z-20 border-b border-gray-100 bg-white/95 px-4 py-1.5 backdrop-blur">
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0">{left}</div>

        <div className="flex items-center gap-2">
          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  'flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-gray-200 transition-opacity hover:opacity-80',
                )}
                title={user.name}
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center bg-gray-900 text-xs font-semibold text-white">
                    {initials || 'U'}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-44 rounded-lg border border-gray-100 bg-white p-1.5 shadow-xl"
            >
              <div className="px-2 py-1.5">
                <p className="truncate text-sm font-semibold text-gray-900">{user.name}</p>
                <p className="truncate text-xs text-gray-400">{user.email}</p>
              </div>
              <DropdownMenuSeparator className="mx-1 my-1 bg-gray-100" />
              <DropdownMenuItem
                onClick={() => void navigate({ to: '/settings' })}
                className="rounded px-2 py-1.5 text-sm text-gray-700 focus:bg-gray-50"
              >
                <Settings size={14} className="text-gray-500" />
                <span className="ml-2">Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onLogout}
                className="rounded px-2 py-1.5 text-sm text-red-600 focus:bg-red-50 focus:text-red-700"
              >
                <LogOut size={14} />
                <span className="ml-2">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
