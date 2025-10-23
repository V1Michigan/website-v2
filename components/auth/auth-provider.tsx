"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import supabase from "@/utils/supabaseClient";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Function to create user in v1-people table
async function createUserInPeopleTable(user: User) {
  try {
    // Check if user already exists in v1-people table
    const { data: existingUser, error: checkError } = await supabase
      .from('v1-people')
      .select('id')
      .eq('id', user.id)
      .single();

    // If user already exists, don't create a duplicate
    if (existingUser && !checkError) {
      console.log('User already exists in v1-people table');
      return;
    }

    // Create new user record in v1-people table
    const { error: insertError } = await supabase
      .from('v1-people')
      .insert({
        id: user.id,
        name: user.user_metadata?.full_name || user.email?.split('@')[0],
        role: 'Member',
        'short-bio': '',
        'full-bio': '',
        email: user.email,
        tags: [],
        linkedin: '',
        twitter: '',
        instagram: '',
        website: '',
        'image-path': user.user_metadata?.avatar_url
      });

    if (insertError) {
      console.error('Error creating user in v1-people table:', insertError.message);
    } else {
      console.log('User successfully created in v1-people table');
    }
  } catch (error) {
    console.error('Unexpected error creating user in v1-people table:', error);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);

      // Handle user creation in v1-people table
      if (event === 'SIGNED_IN' && session?.user) {
        await createUserInPeopleTable(session.user);
      }

      // Handle session refresh
      if (event === 'TOKEN_REFRESHED' && session?.user) {
        console.log('Session refreshed successfully');
      }

      // Handle session expiry
      if (event === 'SIGNED_OUT') {
        console.log('User signed out');
      }
    });

    // Set up periodic session refresh (every 30 minutes)
    const refreshInterval = setInterval(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Refresh the session to keep it alive
        await supabase.auth.refreshSession();
      }
    }, 30 * 60 * 1000); // 30 minutes

    return () => {
      subscription.unsubscribe();
      clearInterval(refreshInterval);
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
