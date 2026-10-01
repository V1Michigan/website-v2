"use client";

import { useMemo, useRef, useState } from "react";
import { Joyride, EVENTS } from "react-joyride";
import { CircleHelp, Star } from "lucide-react";

/** @param {import("react").SyntheticEvent} event */
function suppressButtonHint(event) {
  // Portal events bubble through React, so this also covers Joyride's tooltip.
  if (event.target instanceof Element) {
    event.target.closest('.react-joyride__tooltip button')?.removeAttribute("title");
  }
}

export default function CompanyPortalHelp({companyName, view, setView, closeProfile, openFirstProfile, hasCandidates, onRunChange}) {
  const [run, setRun] = useState(false);
  const [session, setSession] = useState(0);
  const previousView = useRef(view);
  const activate = useMemo(() => async (nextView, scrollToTop = false) => {
    closeProfile();
    setView(nextView);
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    document.querySelector(`[data-tour="portal-tab-${nextView}"]`)?.scrollIntoView({block: "nearest", inline: "nearest"});
    const table = document.querySelector('[data-tour="candidate-table"]');
    if (table) {
      table.scrollLeft = 0;
      if (scrollToTop) table.scrollTop = 0;
    }
    await new Promise(resolve => requestAnimationFrame(resolve));
  }, [setView, closeProfile]);
  const steps = useMemo(/** @returns {import("react-joyride").Step[]} */ () => [
    {target: "body", placement: "center", skipScroll: true, title: `Welcome${companyName ? ` ${companyName}` : ""}!`, content: "We’re so glad you could join us for Startup Week 2026! Let’s help you find the top Michigan talent.", locale: {next: "Let’s get started", nextWithProgress: "Let’s get started"}},
    {target: '[data-tour="portal-tab-recommended"]', title: "Recommended", content: "Start with candidates the V1 team has recommended for your company.", before: () => activate("recommended")},
    {target: '[data-tour="portal-tab-all"]', title: "All Candidates", content: "Browse every candidate. Use search and filters to narrow by interest, expertise, and availability.", before: () => activate("all")},
    {target: '[data-tour="portal-tab-shortlist"]', title: "Your shortlist", content: "Click and drag anywhere on a candidate’s row to reorder your shortlist. A regular click opens their profile.", before: () => activate("shortlist")},
    {target: '[data-tour="portal-tab-profile"]', title: "Company Profile", content: "View your company’s name, description, and optional question for students here.", before: () => activate("profile")},
    {target: '[data-tour="candidate-search"]', title: "Find the right candidates", content: "Search names, interests, or expertise. Filters support multiple selections, and stay with you as you switch candidate tabs.", before: () => activate("all")},
    {target: '[data-tour="candidate-table"]', title: "Scroll down to see more", content: "Scroll down inside the table to browse more candidates. Click a name or row to open their full profile.", before: () => activate("all"), blockTargetInteraction: false},
    {target: () => {
      const target = document.querySelector('[data-tour="shortlist-star"]') || document.querySelector('[data-tour="shortlist-column"]');
      return target instanceof HTMLElement ? target : null;
    }, title: "Star a candidate", content: <div><Star aria-hidden="true" size={24} className="mx-auto mb-3 text-[#B57D30]" />Click an outlined star to add a candidate. A filled star means they’re shortlisted; click it again to remove them. No save button needed.</div>, skipScroll: true, before: () => activate("all", true)},
    ...(hasCandidates ? [{target: '[data-tour="candidate-profile"]', title: "Get to know a candidate", content: "Click any candidate’s name or row to open this profile. Review their interests, expertise, availability, and project. The icons beside their name open LinkedIn, their resume, website, and GitHub. At the bottom, add or remove them from your shortlist and write a note once they’re shortlisted. Notes save automatically.", placement: /** @type {const} */ ("right"), skipScroll: true, before: async () => {
      await activate("all", true);
      const firstRow = document.querySelector('[data-tour="candidate-profile-open"]');
      if (firstRow instanceof HTMLElement) firstRow.click();
      else openFirstProfile();
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const profile = document.querySelector('[data-tour="candidate-profile"]');
      if (profile) {
        profile.scrollTop = 0;
        await Promise.all(profile.getAnimations().map(animation => animation.finished.catch(() => {})));
      }
    }}] : []),
    {target: '[data-tour="expand-view"]', title: "More room to explore", content: "Expand the current tab to fill the screen. The table gets more room, and Interest, Expertise, and availability columns widen evenly. Use Collapse or press Esc to return. You can expand Company Profile too.", before: () => activate("all")},
    {target: '[data-tour="autosave-status"]', title: "Saved automatically", content: "Stars, rankings, and notes save automatically. This status confirms when they’re saved. If a save fails, your edits stay on screen and you can retry here.", before: () => activate("all")},
  ], [activate, companyName, hasCandidates, openFirstProfile]);
  return <div className="contents" onMouseOverCapture={suppressButtonHint} onFocusCapture={suppressButtonHint}>
    <button type="button" disabled={run} onClick={() => {previousView.current = view; closeProfile(); setSession(value => value + 1); onRunChange(true); setRun(true);}} className="inline-flex shrink-0 items-center gap-2 rounded-md border border-yellow-400 bg-yellow-400 px-4 py-2 text-sm font-medium text-[#191919] hover:border-yellow-300 hover:bg-yellow-300 disabled:opacity-50"><CircleHelp aria-hidden="true" size={16} />Tutorial</button>
    <Joyride key={session} run={run} continuous scrollToFirstStep steps={steps} options={{skipBeacon: true, showProgress: true, buttons: ["back", "close", "primary", "skip"], closeButtonAction: "skip", overlayClickAction: false, blockTargetInteraction: true, backgroundColor: "#FAF7F2", primaryColor: "#FACC15", textColor: "#444444", zIndex: 1000, targetWaitTimeout: 2000}} styles={{tooltip: {borderRadius: 12}, tooltipTitle: {fontSize: 24, lineHeight: 1.3}, tooltipContent: {fontSize: 17, lineHeight: 1.65}, buttonPrimary: {backgroundColor: "#FACC15", color: "#191919", fontSize: 16, fontWeight: 600, padding: "12px 18px", borderRadius: 6}, buttonBack: {color: "#444444", fontSize: 15}, buttonSkip: {color: "#666666", fontSize: 15}}} locale={{last: "Done", skip: "Skip tour"}} onEvent={event => {
      if (event.type === EVENTS.TOUR_END || event.type === EVENTS.ERROR) {
        closeProfile();
        onRunChange(false);
        setRun(false);
        setView(previousView.current);
      }
    }} />
  </div>;
}
