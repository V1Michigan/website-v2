
"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import supabase from "@/utils/supabaseClient";

const FLAG_NAME = "SHOW_YC_BANNER";

async function fetchYcBannerFlag() {
  const { data, error } = await supabase
    .from("flags")
    .select("is_active")
    .eq("flag_name", FLAG_NAME)
    .single();

  if (error) {
    console.error("Error fetching YC banner flag:", error.message);
    throw error;
  }

  return data?.is_active ?? false;
}

export function useShowYcBannerFlag() {
  const queryClient = useQueryClient();

  const {
    data: ycFlagEnabled = false,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["ycBannerFlag"],
    queryFn: fetchYcBannerFlag,
    initialData: false,
    refetchInterval: 30000, // Fallback polling every 30s if subscription fails
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    const channel = supabase
      .channel("flags_show_yc_banner")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "flags",
          filter: `flag_name=eq.${FLAG_NAME}`,
        },
        (payload) => {
          if (payload.new && "is_active" in payload.new) {
            queryClient.invalidateQueries({ queryKey: ["ycBannerFlag"] });
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("Subscribed to YC banner flag changes");
        } else if (status === "CHANNEL_ERROR") {
          console.error("Failed to subscribe to YC banner flag changes, falling back to polling");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return { ycFlagEnabled, isLoading, error };
}
