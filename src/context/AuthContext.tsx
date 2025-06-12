// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Session, User } from '@supabase/supabase-js';

// Define a clean type for our application user
interface AppUser {
  id: string;
  email?: string;
  role: 'supporter' | 'farmer' | 'host';
  fullName?: string;
  zipCode?: string;
  groupsHosted?: number;
  totalMembersServed?: number;
}

// Define the shape of the context value
export interface AuthContextType {
  session: Session | null;
  user: AppUser | null;
  isLoggedIn: boolean;
  logout: () => Promise<void>;
}

// Create the context with an initial value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for an active session on initial load
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await fetchUserProfile(session.user);
      }
      
      setSession(session);
      setLoading(false);
    };

    getInitialSession();

    // Set up a real-time listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      
      if (session?.user) {
        await fetchUserProfile(session.user);
      } else {
        setAppUser(null);
      }
      
      setLoading(false);
    });

    // Cleanup the listener when the component unmounts
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Function to fetch user profile and determine role
  const fetchUserProfile = async (user: User) => {
    try {
      // First, check if user has a profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, groups_hosted, total_members_served, zip_code')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
      }

      // Determine user role based on database relationships
      let role: 'supporter' | 'farmer' | 'host' = 'supporter'; // Default

      // Check if user is a farmer
      const { data: farmerData } = await supabase
        .from('farmers')
        .select('id')
        .eq('email', user.email)
        .single();

      if (farmerData) {
        role = 'farmer';
      } else {
        // Check if user is a host (has hosted groups)
        const { data: hostData } = await supabase
          .from('products')
          .select('id')
          .eq('host_id', user.id)
          .limit(1);

        if (hostData && hostData.length > 0) {
          role = 'host';
        }
      }

      // Create the app user object
      const appUserData: AppUser = {
        id: user.id,
        email: user.email,
        role,
        fullName: profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0],
        zipCode: profile?.zip_code,
        groupsHosted: profile?.groups_hosted || 0,
        totalMembersServed: profile?.total_members_served || 0,
      };

      setAppUser(appUserData);

      // Create profile if it doesn't exist
      if (!profile) {
        await supabase
          .from('profiles')
          .insert({
            id: user.id,
            full_name: appUserData.fullName,
            groups_hosted: 0,
            total_members_served: 0,
          });
      }

    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      // Fallback user object
      setAppUser({
        id: user.id,
        email: user.email,
        role: 'supporter',
        fullName: user.user_metadata?.full_name || user.email?.split('@')[0],
      });
    }
  };

  // Define the logout function
  const logout = async () => {
    await supabase.auth.signOut();
  };

  const value: AuthContextType = {
    session,
    user: appUser,
    isLoggedIn: !!appUser,
    logout,
  };

  // Render children only after the initial session check is complete
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access to the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};