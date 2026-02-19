"use client";

import React, { createContext, useContext } from "react";
import { useFlags as useFlagsQuery } from "@/hooks/useFlags";
import type { FlagsState } from "@/constants/flags";

interface FlagsContextType {
  flags: FlagsState;
  isLoading: boolean;
  error: unknown;
}

const FlagsContext = createContext<FlagsContextType | undefined>(undefined);

export function FlagsProvider({ children }: { children: React.ReactNode }) {
  const flagsData = useFlagsQuery();
  
  return (
    <FlagsContext.Provider value={flagsData}>
      {children}
    </FlagsContext.Provider>
  );
}

export function useFlags() {
  const context = useContext(FlagsContext);
  if (context === undefined) {
    throw new Error("useFlags must be used within a FlagsProvider");
  }
  return context;
}
