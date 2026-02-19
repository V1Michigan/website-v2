"use client";

import React, { useState, useEffect } from "react";
import { useFlags } from "@/components/flags-provider";
import { type FlagName } from "@/constants/flags";

interface ScheduledToggleProps {
  flag: FlagName;
  children: React.ReactNode;
}

export default function ScheduledToggle({ flag, children }: ScheduledToggleProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { flags } = useFlags();
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return null;
  }
  
  const isEnabled = flags[flag];
  
  if (!isEnabled) {
    return null;
  }
  
  return <>{children}</>;
}
