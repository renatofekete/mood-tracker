import { createClient, Session } from "@supabase/supabase-js";
import { GenericSchema } from "@supabase/supabase-js/dist/module/lib/types";
import { createContext, useEffect, useState } from "react";

const supabase = createClient<unknown, never, GenericSchema>(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)

interface AuthContextType {
    supabase: ReturnType<typeof createClient>;
    session: Session | null;
    setSession: (session: Session | null) => void;
    handleLogout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {

    const [session, setSession] = useState<Session | null>(null)

    useEffect(() => {
          supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
          })
    
          const {
            data: { subscription },
          } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
          })
    
          return () => subscription.unsubscribe()
        }, [])
    
        async function handleLogout() {
            try {
                await supabase.auth.signOut()
            } catch(e) {
                console.error(e)
            }
        }

    return (
        <AuthContext.Provider value={{ supabase, session, setSession, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
}


