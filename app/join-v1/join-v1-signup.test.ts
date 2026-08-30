import assert from "node:assert/strict";
import test from "node:test";

import type { SupabaseClient } from "@supabase/supabase-js";

import {
  JOIN_V1_SIGNUPS_TABLE,
  normalizeUniqname,
  saveJoinV1Signup,
} from "./join-v1-signup";

function createSupabaseClient(error: Error | null = null) {
  const inserts: Array<{ table: string; row: { uniqname: string } }> = [];

  const client = {
    from(table: string) {
      return {
        async insert(row: { uniqname: string }) {
          inserts.push({ table, row });
          return { error };
        },
      };
    },
  } as unknown as SupabaseClient;

  return { client, inserts };
}

test("normalizeUniqname trims whitespace and lowercases the value", () => {
  assert.equal(normalizeUniqname("  DylanLi  "), "dylanli");
});

test("saveJoinV1Signup inserts the normalized uniqname", async () => {
  const { client, inserts } = createSupabaseClient();

  const uniqname = await saveJoinV1Signup(client, "  DylanLi  ");

  assert.equal(uniqname, "dylanli");
  assert.deepEqual(inserts, [
    {
      table: JOIN_V1_SIGNUPS_TABLE,
      row: { uniqname: "dylanli" },
    },
  ]);
});

test("saveJoinV1Signup rejects an empty uniqname without writing", async () => {
  const { client, inserts } = createSupabaseClient();

  await assert.rejects(
    saveJoinV1Signup(client, "   "),
    /Please enter your uniqname/,
  );
  assert.deepEqual(inserts, []);
});

test("saveJoinV1Signup surfaces a useful error when Supabase fails", async () => {
  const { client } = createSupabaseClient(new Error("database unavailable"));

  await assert.rejects(
    saveJoinV1Signup(client, "dylanli"),
    /We couldn’t save your uniqname/,
  );
});
