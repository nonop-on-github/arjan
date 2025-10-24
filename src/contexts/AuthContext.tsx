
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<{
    error: AuthError | null;
    data: { session: Session | null; user: User | null } | null;
  }>;
  signUp: (email: string, password: string, metadata?: { firstName: string, lastName: string }) => Promise<{
    error: AuthError | null;
    data: { session: Session | null; user: User | null } | null;
  }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  loading: boolean;
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>;
  updateEmail: (newEmail: string) => Promise<{ error: AuthError | null }>;
  userProfile: { firstName: string, lastName: string } | null;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<{ firstName: string, lastName: string } | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (data) {
        setUserProfile({ 
          firstName: data.first_name || '',
          lastName: data.last_name || '' 
        });
      } else {
        setUserProfile(null);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user.id);
    }
  };
  
  // Set up token refresh
  const setupRefreshToken = () => {
    if (refreshInterval) clearInterval(refreshInterval);
    
    // Refresh session every 10 minutes
    const interval = window.setInterval(async () => {
      try {
        const { error } = await supabase.auth.refreshSession();
        if (error) {
          console.error("Failed to refresh session:", error);
        }
      } catch (err) {
        console.error("Error refreshing session:", err);
      }
    }, 10 * 60 * 1000); // 10 minutes
    
    setRefreshInterval(interval);
  };

  useEffect(() => {
    const setupAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
        
        setLoading(false);

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state change:', event, session?.user?.user_metadata);
            setSession(session);
            setUser(session?.user ?? null);
            
            if (session?.user) {
              // Pour les nouveaux utilisateurs Google, créer le profil si nécessaire
              if (event === 'SIGNED_IN' && session.user.user_metadata) {
                const metadata = session.user.user_metadata;
                console.log('User metadata:', metadata);
                
                // Vérifier si le profil existe
                const { data: existingProfile } = await supabase
                  .from('profiles')
                  .select('user_id')
                  .eq('user_id', session.user.id)
                  .single();
                
                if (!existingProfile) {
                  // Créer le profil avec les données Google
                  const firstName = metadata.given_name || metadata.first_name || metadata.firstName || '';
                  const lastName = metadata.family_name || metadata.last_name || metadata.lastName || '';
                  
                  await supabase
                    .from('profiles')
                    .insert({
                      user_id: session.user.id,
                      first_name: firstName,
                      last_name: lastName
                    });
                }
              }
              
              await fetchUserProfile(session.user.id);
              setupRefreshToken();
            } else {
              setUserProfile(null);
              if (refreshInterval) clearInterval(refreshInterval);
            }
            
            setLoading(false);
          }
        );

        // Setup refresh token if we already have a session
        if (session) {
          setupRefreshToken();
        }

        return () => {
          subscription.unsubscribe();
          if (refreshInterval) clearInterval(refreshInterval);
        };
      } catch (error) {
        console.error("Error setting up auth:", error);
        setLoading(false);
      }
    };

    setupAuth();
    
    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = async (email: string, password: string, metadata?: { firstName: string, lastName: string }) => {
    return await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: metadata 
      }
    });
  };

  const signInWithGoogle = async () => {
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
  };

  const signOut = async () => {
    if (refreshInterval) clearInterval(refreshInterval);
    await supabase.auth.signOut();
    setUserProfile(null);
  };

  const updatePassword = async (newPassword: string) => {
    return await supabase.auth.updateUser({ password: newPassword });
  };

  const updateEmail = async (newEmail: string) => {
    return await supabase.auth.updateUser({ email: newEmail });
  };

  const value = {
    session,
    user,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    loading,
    updatePassword,
    updateEmail,
    userProfile,
    refreshProfile
  } as AuthContextType;

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
