import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase/client';

type AuthUser = {
  id: string; // profile id from public.users
  authId: string; // auth user id from auth.users
  fullName: string;
  email: string;
  cargo: string;
  avatarUrl?: string;
};

type RegisterPayload = {
  email: string;
  password: string;
  fullName: string;
  cargo?: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type AuthResult = { user?: AuthUser; error?: string };

type AuthContextValue = {
  user: AuthUser | null;
  isInitializing: boolean;
  signUp: (payload: RegisterPayload) => Promise<AuthResult>;
  signIn: (payload: LoginPayload) => Promise<AuthResult>;
  signOut: () => void;
  updateUserProfile: (updates: Partial<AuthUser> & { currentPassword?: string; newPassword?: string }) => Promise<AuthResult>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const loadUserProfile = async (authUser: any): Promise<AuthUser | null> => {
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .select('id,email,full_name,cargo,avatar_url')
      .eq('auth_uid', authUser.id)
      .single();

    if (profileError || !profileData) {
      console.error('Erro ao carregar perfil do usuário', profileError);
      return null;
    }

    return {
      id: profileData.id,
      authId: authUser.id,
      fullName: profileData.full_name ?? (authUser.user_metadata as any)?.full_name ?? '',
      email: profileData.email ?? authUser.email ?? '',
      cargo: profileData.cargo ?? (authUser.user_metadata as any)?.cargo ?? 'Analista de Inventário',
      avatarUrl: profileData.avatar_url ?? (authUser.user_metadata as any)?.avatar_url ?? '',
    };
  };

  const restoreSession = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data?.session?.user;
      if (sessionUser) {
        const loadedUser = await loadUserProfile(sessionUser);
        if (loadedUser) setUser(loadedUser);
      }
    } catch (err) {
      console.error('Erro ao restaurar sessão', err);
    } finally {
      setIsInitializing(false);
    }
  };

  const signUp = async ({ fullName, email, password, cargo }: RegisterPayload): Promise<AuthResult> => {
    try {
      const metadata: Record<string, string> = { full_name: fullName };
      if (cargo) metadata.cargo = cargo;
      const options = { data: metadata };
      const { data, error } = await supabase.auth.signUp({ email, password }, options);
      if (error) {
        console.error('Supabase signUp error', error);
        return { error: error.message };
      }

      if (data?.user?.id) {
        const authUserId = data.user.id;
        const profile = {
          auth_uid: authUserId,
          email: data.user.email,
          full_name: fullName,
          cargo: cargo ?? 'Analista de Inventário',
        };

        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .insert(profile)
          .select('id')
          .single();

        if (profileError || !profileData) {
          console.error('Supabase profile insert error', profileError);
          return { error: 'Erro ao salvar perfil do usuário no banco de dados.' };
        }

        const createdUser: AuthUser = {
          id: profileData.id,
          authId: authUserId,
          fullName,
          email,
          cargo: cargo ?? 'Analista de Inventário',
          avatarUrl: '',
        };

        setUser(createdUser);
        return { user: createdUser };
      }

      return {};
    } catch (err: any) {
      return { error: err?.message ?? 'Erro ao cadastrar usuário.' };
    }
  };

  const signIn = async ({ email, password }: LoginPayload): Promise<AuthResult> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };

      const sessionUser = data?.user;
      if (!sessionUser) return { error: 'Falha ao autenticar usuário.' };

      const loadedUser = await loadUserProfile(sessionUser);
      if (!loadedUser) {
        return { error: 'Falha ao carregar o perfil do usuário.' };
      }

      setUser(loadedUser);
      return { user: loadedUser };
    } catch (err: any) {
      return { error: err?.message ?? 'Erro ao autenticar.' };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      // ignore
    }
    setUser(null);
  };

  const updateUserProfile = async (
    updates: Partial<AuthUser> & { currentPassword?: string; newPassword?: string },
  ): Promise<AuthResult> => {
    if (!user) return { error: 'Usuário não autenticado.' };

    try {
      const updatePayload: any = { data: {} };
      if (updates.fullName) updatePayload.data.full_name = updates.fullName;
      if (updates.cargo) updatePayload.data.cargo = updates.cargo;
      if (updates.avatarUrl) updatePayload.data.avatar_url = updates.avatarUrl;
      if (updates.email) updatePayload.email = updates.email;
      if (updates.newPassword) updatePayload.password = updates.newPassword;

      const { data, error } = await supabase.auth.updateUser(updatePayload);
      if (error) return { error: error.message };

      const updated = data.user
        ? {
            id: user.id,
            fullName: (data.user.user_metadata as any)?.full_name ?? updates.fullName ?? user.fullName,
            email: data.user.email ?? updates.email ?? user.email,
            cargo: (data.user.user_metadata as any)?.cargo ?? updates.cargo ?? user.cargo,
            avatarUrl: (data.user.user_metadata as any)?.avatar_url ?? updates.avatarUrl ?? user.avatarUrl,
          }
        : { ...user, ...updates };

      setUser(updated);
      return { user: updated };
    } catch (err: any) {
      return { error: err?.message ?? 'Erro ao atualizar perfil.' };
    }
  };

  const value = useMemo<AuthContextValue>(() => ({ user, isInitializing, signUp, signIn, signOut, updateUserProfile }), [user, isInitializing]);

  useEffect(() => {
    void restoreSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        void loadUserProfile(session.user).then((loadedUser) => {
          if (loadedUser) setUser(loadedUser);
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
