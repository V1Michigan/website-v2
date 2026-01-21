"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import supabase from "@/utils/supabaseClient";

const FLAG_NAME = "SHOW_PS_BANNER";

async function fetchPsBannerFlag() {
  const { data, error } = await supabase
    .from("flags")
    .select("is_active")
    .eq("flag_name", FLAG_NAME)
    .single();

  if (error) {
    console.error("Error fetching PS banner flag:", error.message);
    throw error;
  }

  return data?.is_active ?? false;
}

export function useShowPsBannerFlag() {
  const queryClient = useQueryClient();

  const {
    data: isEnabled = false,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["psBannerFlag"],
    queryFn: fetchPsBannerFlag,
    initialData: false,
    refetchInterval: 30000, // Fallback polling every 30s if subscription fails
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    const channel = supabase
      .channel("flags_show_ps_banner")
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
            queryClient.invalidateQueries({ queryKey: ["psBannerFlag"] });
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("Subscribed to PS banner flag changes");
        } else if (status === "CHANNEL_ERROR") {
          console.error("Failed to subscribe to PS banner flag changes, falling back to polling");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return { isEnabled, isLoading, error };
}
