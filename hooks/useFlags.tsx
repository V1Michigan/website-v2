"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import supabase from "@/utils/supabaseClient";
import { FLAG_NAMES, type FlagsState } from "@/constants/flags";

async function fetchAllFlags(): Promise<FlagsState> {
  const { data, error } = await supabase
    .from("flags")
    .select("flag_name, is_active");

  if (error) {
    console.error("Error fetching flags:", error.message);
    throw error;
  }

  // Transform array to object with typed flag names
  const flags = data?.reduce((acc, flag) => {
    acc[flag.flag_name as keyof FlagsState] = flag.is_active;
    return acc;
  }, {} as FlagsState) || {};

  // Ensure all known flags are present with false as default
  Object.keys(FLAG_NAMES).forEach(flagName => {
    if (flags[flagName as keyof FlagsState] === undefined) {
      flags[flagName as keyof FlagsState] = false;
    }
  });

  return flags;
}

export function useFlags() {
  const queryClient = useQueryClient();

  const {
    data: flags = {} as FlagsState,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["allFlags"],
    queryFn: fetchAllFlags,
    initialData: {},
    refetchInterval: 30000, // Fallback polling every 30s if subscription fails
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    const channel = supabase
      .channel("flags_all_changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "flags",
        },
        (payload) => {
          if (payload.new?.flag_name) {
            console.log("hello world!");
            queryClient.setQueryData(["allFlags"], (old: FlagsState) => ({
              ...old,
              [payload.new.flag_name as keyof FlagsState]: payload.new.is_active
            }));
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("Subscribed to all flag changes");
        } else if (status === "CHANNEL_ERROR") {
          console.error("Failed to subscribe to flag changes, falling back to polling");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return { ...flags, isLoading, error };
}
