import { createClient } from "@supabase/supabase-js";

let supabaseClient = null;

export const getSupabase = () => {
  if (supabaseClient) {
    return supabaseClient;
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const error = new Error("Supabase configuration is missing");
    error.statusCode = 500;
    throw error;
  }

  supabaseClient = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  return supabaseClient;
};
