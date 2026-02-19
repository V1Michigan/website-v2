import type { FlagsState } from "@/constants/flags";

const CACHE_KEY = "v1_flags_cache";
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours

interface CachedFlags {
  data: FlagsState;
  timestamp: number;
}

export function getCachedFlags(): FlagsState | null {
  if (typeof window === "undefined") return null;
  
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return null;
  
  try {
    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();
    
    if (now - timestamp > CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error parsing cached flags:", error);
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
}

export function setCachedFlags(data: FlagsState): void {
  if (typeof window === "undefined") return;
  
  const cached: CachedFlags = {
    data,
    timestamp: Date.now(),
  };
  
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
  } catch (error) {
    console.error("Error saving cached flags:", error);
  }
}
