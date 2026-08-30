import type { SupabaseClient } from "@supabase/supabase-js";

export const JOIN_V1_SIGNUPS_TABLE = "join_v1_signups";

export function normalizeUniqname(value: string) {
  return value.trim().toLowerCase();
}

export async function saveJoinV1Signup(
  client: SupabaseClient,
  value: string,
) {
  const uniqname = normalizeUniqname(value);

  if (!uniqname) {
    throw new Error("Please enter your uniqname.");
  }

  const { error } = await client
    .from(JOIN_V1_SIGNUPS_TABLE)
    .insert({ uniqname });

  if (error) {
    throw new Error("We couldn’t save your uniqname. Please try again.", {
      cause: error,
    });
  }

  return uniqname;
}
