"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { createShortlistDraft } from "./shortlist-draft";

export function useShortlistDraft(slug, token) {
  const tokenRef = useRef(token);
  tokenRef.current = token;
  const controllerRef = useRef(null);
  if (!controllerRef.current) controllerRef.current = createShortlistDraft(async (picks, version) => {
    const {data} = await axios.post(`/api/startup-week/companies/${slug}/preferences`,
      {version, preferences: picks.map((pick, index) => ({...pick, rank: index + 1, note: pick.note || null}))},
      {headers: {Authorization: `Bearer ${tokenRef.current}`}});
    return data.version;
  });
  const controller = controllerRef.current;
  const [state, setState] = useState(controller.snapshot);
  useEffect(() => {
    const unsubscribe = controller.subscribe(setState);
    const warn = event => {
      if (!controller.snapshot().dirty && controller.snapshot().status !== "saving") return;
      event.preventDefault(); event.returnValue = "";
    };
    const confirmNavigation = event => {
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!link || link.target === "_blank" || link.hasAttribute("download") || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = new URL(link.href, window.location.href);
      if (target.origin === window.location.origin && target.pathname === window.location.pathname && target.search === window.location.search) return;
      if (controller.snapshot().dirty || controller.snapshot().status === "saving") {
        if (!window.confirm("Leave this page and discard unsaved shortlist changes?")) { event.preventDefault(); event.stopPropagation(); }
      }
    };
    document.addEventListener("click", confirmNavigation, true);
    window.addEventListener("beforeunload", warn);
    return () => { unsubscribe(); window.removeEventListener("beforeunload", warn); document.removeEventListener("click", confirmNavigation, true); };
  }, [controller]);
  return {...state, initialize: controller.initialize, edit: controller.edit, save: controller.save};
}
