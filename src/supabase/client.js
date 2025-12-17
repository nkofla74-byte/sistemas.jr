import { createClient } from '@supabase/supabase-js';

const projectURL = import.meta.env.VITE_SUPABASE_URL;
const projectKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!projectURL || !projectKey) {
  throw new Error("Faltan las variables de entorno VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY");
}

export const supabase = createClient(projectURL, projectKey);