"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { createShortlistAutosave } from "./shortlist-autosave";

export function useShortlistAutosave(slug, token) {
  const tokenRef = useRef(token);
  tokenRef.current = token;
  const controllerRef = useRef(null);
  if (!controllerRef.current) controllerRef.current = createShortlistAutosave(picks => axios.post(
    `/api/startup-week/companies/${slug}/preferences`,
    {preferences: picks.map((pick, index) => ({...pick, rank: index + 1, note: pick.note || null}))},
    {headers: {Authorization: `Bearer ${tokenRef.current}`}},
  ));
  const controller = controllerRef.current;
  const [state, setState] = useState(controller.snapshot);
  useEffect(() => {
    const unsubscribe = controller.subscribe(setState);
    const retry = () => { if (controller.snapshot().dirty) void controller.flush(); };
    const warn = event => {
      if (!controller.snapshot().dirty) return;
      void controller.flush();
      event.preventDefault(); event.returnValue = "";
    };
    window.addEventListener("online", retry);
    window.addEventListener("beforeunload", warn);
    return () => {
      unsubscribe();
      window.removeEventListener("online", retry);
      window.removeEventListener("beforeunload", warn);
      // Client-side navigation should also flush a pending debounce.
      if (controller.snapshot().dirty) void controller.flush();
    };
  }, [controller]);
  return {...state, initialize: controller.initialize, edit: controller.edit, flush: controller.flush};
}
