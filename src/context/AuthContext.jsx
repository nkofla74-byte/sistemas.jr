import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabase/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para obtener perfil
  const fetchProfile = useCallback(async (userId) => {
    try {
      console.log("📥 Descargando perfil para:", userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn("⚠️ Error obteniendo perfil:", error.message);
        return null;
      }
      console.log("✅ Perfil descargado:", data?.role || "Sin rol");
      return data;
    } catch (err) {
      console.error("❌ Error inesperado fetchProfile:", err);
      return null;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const initSession = async () => {
      try {
        console.log("🔄 Iniciando sesión de Supabase...");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user && mounted) {
          console.log("👤 Usuario detectado:", session.user.email);
          setUser(session.user);
          const userProfile = await fetchProfile(session.user.id);
          if (mounted) setProfile(userProfile);
        } else {
          console.log("⚪ No hay sesión activa.");
        }
      } catch (error) {
        console.error("❌ Error crítico en initSession:", error);
      } finally {
        if (mounted) {
          setLoading(false);
          console.log("🏁 Carga inicial finalizada.");
        }
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      console.log("🔔 Cambio en estado Auth:", _event);

      if (session?.user) {
        setUser(session.user);
        const userProfile = await fetchProfile(session.user.id);
        if (mounted) setProfile(userProfile);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  // --- SOLUCIÓN PANTALLA BLANCA ---
  // Si está cargando, mostramos un spinner en lugar de "nada"
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-zinc-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-600 mb-4"></div>
        <p className="text-gray-500 font-medium animate-pulse">Cargando sistema...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);