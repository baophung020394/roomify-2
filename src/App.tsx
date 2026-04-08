import { useEffect, useState } from 'react'
import { Outlet } from "react-router"
import { getCurrentUser, signIn as puterSignIn, signOut as puterSignOut } from "./lib/puter.action"

const DEFAULT_AUTH_STATE: AuthState = {
  isSignedIn: false,
  userName: null,
  userId: null,
}

async function resolveAuthState(): Promise<AuthState> {
  try {
    const user = await getCurrentUser()
    return {
      isSignedIn: !!user,
      userName: user?.username || null,
      userId: user?.uuid || null,
    }
  } catch (error) {
    console.error(error)
    return DEFAULT_AUTH_STATE
  }
}

export default function App() {
  const [authState, setAuthState] = useState(DEFAULT_AUTH_STATE)

  const refreshAuth = async () => {
    const next = await resolveAuthState()
    setAuthState(next)
    return next.isSignedIn
  }

  useEffect(() => {
    let cancelled = false
    void resolveAuthState().then((next) => {
      if (!cancelled) setAuthState(next)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const signIn = async () => {
    await puterSignIn()
    return await refreshAuth()
  }

  const signOut = async () => {
    puterSignOut()
    return await refreshAuth()
  }


  return (
    <main className="min-h-screen bg-background text-foreground relative z-10">
      <Outlet
        context={{
          ...authState, refreshAuth, signIn, signOut
        }}
      />
    
    </main>
  )
}
