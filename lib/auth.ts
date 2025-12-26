import { supabase } from './supabase';

/**
 * Ensure user is authenticated
 * Signs in anonymously if no user exists
 */
export async function ensureAuthenticated(): Promise<string> {
  try {
    // Check if user is already authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      return user.id;
    }

    // Try to get session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      return session.user.id;
    }

    // Sign in anonymously if no user exists
    const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
    
    if (authError) {
      console.error('Anonymous authentication failed:', authError.message);
      throw new Error(
        'Anonymous authentication is required. Please enable Anonymous authentication in your Supabase project: ' +
        'Authentication → Providers → Anonymous → Enable'
      );
    }

    if (!authData.user) {
      throw new Error('Failed to authenticate user: No user data returned');
    }

    return authData.user.id;
  } catch (error) {
    console.error('Error ensuring authentication:', error);
    throw error;
  }
}

/**
 * Get current user ID
 */
export async function getCurrentUserId(): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

