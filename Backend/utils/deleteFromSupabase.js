import { getSupabase } from "../config/supabaseClient.js";

export const deleteFromSupabase = async (filePath) => {
  if (
    !filePath ||
    !process.env.SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY ||
    !process.env.SUPABASE_BUCKET
  ) {
    return;
  }

  const supabase = getSupabase();

  await supabase.storage
    .from(process.env.SUPABASE_BUCKET)
    .remove([filePath]);
};

export default deleteFromSupabase;
