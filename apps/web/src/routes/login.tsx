import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'

import { saveToken, setUser, getAccessToken } from '../lib/auth-client'
import { API_URL } from '../lib/api'
import type { AuthUser } from '../lib/auth-client'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string
            callback: (response: { credential?: string }) => void
          }) => void
          renderButton: (
            parent: HTMLElement,
            options: Record<string, string | number>,
          ) => void
        }
      }
    }
  }
}

let googleScriptPromise: Promise<void> | null = null

function loadGoogleScript() {
  if (typeof window === 'undefined') {
    return Promise.resolve()
  }

  if (window.google?.accounts?.id) {
    return Promise.resolve()
  }

  if (googleScriptPromise) {
    return googleScriptPromise
  }

  googleScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-google-identity="true"]',
    )

    if (existing) {
      if (existing.dataset.loaded === 'true') {
        resolve()
        return
      }

      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener(
        'error',
        () => reject(new Error('Failed to load Google sign-in')),
        { once: true },
      )
      return
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.dataset.googleIdentity = 'true'
    script.onload = () => {
      script.dataset.loaded = 'true'
      resolve()
    }
    script.onerror = () => reject(new Error('Failed to load Google sign-in'))
    document.head.appendChild(script)
  })

  return googleScriptPromise
}

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    // Client-side guard: if a token already exists, redirect to home.
    if (typeof localStorage !== 'undefined' && getAccessToken()) {
      throw redirect({ to: '/' })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const buttonRef = useRef<HTMLDivElement | null>(null)
  const [error, setError] = useState('')
  const [isSigningIn, setIsSigningIn] = useState(false)

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      setError('Google sign-in is not configured.')
      return
    }

    let cancelled = false

    void loadGoogleScript()
      .then(() => {
        if (cancelled || !buttonRef.current || !window.google?.accounts?.id) {
          return
        }

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async ({ credential }) => {
            if (!credential) {
              setError('Google did not return a sign-in token.')
              return
            }

            setError('')
            setIsSigningIn(true)

            try {
              // Directly call the API to exchange the Google token for an app JWT.
              const res = await fetch(`${API_URL}/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: credential }),
              })

              if (!res.ok) {
                const err = (await res.json()) as { error?: string }
                throw new Error(err.error ?? 'Google sign-in failed')
              }

              const { token, user } = (await res.json()) as {
                token: string
                user: AuthUser
              }

              // Persist the app JWT in localStorage and hydrate in-memory state.
              saveToken(token)
              setUser(user)
              navigate({ to: '/home' })
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Google sign-in failed')
            } finally {
              setIsSigningIn(false)
            }
          },
        })

        buttonRef.current.innerHTML = ''
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'filled_black',
          size: 'large',
          shape: 'pill',
          text: 'signin_with',
          width: 320,
        })
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Google sign-in failed')
        }
      })

    return () => {
      cancelled = true
    }
  }, [navigate])

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f0f0f0]">
      <div className="w-[400px] rounded-2xl bg-white p-10 shadow-sm">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1a1a1a]">
            <span className="text-sm font-bold text-white">AM</span>
          </div>
          <h1 className="text-2xl font-black text-[#1a1a1a]">App</h1>
        </div>

        <p className="mb-8 text-sm text-gray-400">
          Sign in with your Google account to continue.
        </p>

        <div className="flex justify-center">
          <div ref={buttonRef} />
        </div>

        {isSigningIn && (
          <p className="mt-4 text-center text-sm text-gray-400">
            Verifying your Google account...
          </p>
        )}

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
