import supabase from '../supabaseClient';

export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    email: string;
  };
}

const AuthService = {
  async signInWithEmail(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, user: data.user ? { id: data.user.id, email: data.user.email || '' } : undefined };
    } catch (err) {
      return { success: false, error: 'Erro desconhecido' };
    }
  },

  async signUp(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, user: data.user ? { id: data.user.id, email: data.user.email || '' } : undefined };
    } catch (err) {
      return { success: false, error: 'Erro desconhecido' };
    }
  },

  // removido signInWithGoogle
};

export default AuthService;
