"use client";

import { ChevronDown, FileText, Github, Globe, Linkedin, Star } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { DndContext, KeyboardSensor, MouseSensor, TouchSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useReducedMotion } from "framer-motion";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { profileFields, profileValue, fieldSelections, safeProfileUrl, compareTier, compareCandidates } from "@/lib/startup-week/student-profile-fields";

function projectFieldOrder(field) {
  return field.key === "project_url" ? 1 : field.key === "project_description" ? 2 : 0;
}

const tableFields = [
  ["tier", "Tier"], ["links", "Links"], ["roles", "Interest"],
  ["expertise", "Expertise"], ["full_time_seasons", "Full-time availability"],
  ["part_time_seasons", "Part-time availability"],
].map(([key, label]) => ({...profileFields.find(field => field.key === key), key, label}));

function tableColumnWidth(field, expanded) {
  if (field.key === "tier") return "w-16 min-w-16 max-w-16";
  if (field.key === "links" || !expanded) return "w-44 min-w-44 max-w-44";
  return "";
}

const candidateLinks = [
  {key: "linkedin_url", label: "LinkedIn", icon: Linkedin},
  {key: "resume_url", label: "Resume", icon: FileText},
  {key: "website_url", label: "Website", icon: Globe},
  {key: "github_url", label: "GitHub", icon: Github},
];

function CandidateLinks({student, large = false}) {
  return <div className={`flex w-max items-center ${large ? "gap-2" : "gap-1"}`}>{candidateLinks.map(({key, label, icon: Icon}) => {
    const field = profileFields.find(item => item.key === key);
    const url = safeProfileUrl(profileValue(student, field));
    return url ? <a key={key} href={url} target="_blank" rel="noopener noreferrer" aria-label={`${student.name}: ${label} (opens in a new tab)`} onClick={event => event.stopPropagation()} className={`inline-flex ${large ? "h-11 w-11" : "h-8 w-8"} shrink-0 items-center justify-center rounded-md text-gray-600 hover:bg-[#E5AC61]/15 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E5AC61]`}><Icon aria-hidden="true" size={large ? 24 : 17} /></a> : <span key={key} role="img" aria-label={`${label} not provided`} className={`inline-flex ${large ? "h-11 w-11" : "h-8 w-8"} shrink-0 items-center justify-center text-gray-300`}><Icon aria-hidden="true" size={large ? 24 : 17} /></span>;
  })}</div>;
}

function CandidateRow({student, rank, reorderable, onOpen, children}) {
  const reduceMotion = useReducedMotion();
  const {attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging} = useSortable({
    id: student.id,
    disabled: !reorderable,
    transition: reduceMotion ? null : {duration: 260, easing: "cubic-bezier(0.22, 1, 0.36, 1)"},
  });
  const handle = reorderable ? <button type="button" ref={setActivatorNodeRef} {...attributes} onKeyDown={listeners?.onKeyDown} data-row-drag-handle
    aria-label={`Rank ${rank}: drag to reorder ${student.name}`} onClick={event => {event.stopPropagation(); if (!isDragging) onOpen(student);}}
    className="inline-flex h-8 w-8 shrink-0 touch-none text-xs tabular-nums items-center justify-center rounded-md text-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E5AC61] cursor-grab active:cursor-grabbing">
    <span>#{rank}</span>
  </button> : null;
  const startRowDrag = event => {
    const control = event.target instanceof Element ? event.target.closest("a, button, input, textarea, select, [contenteditable='true']") : null;
    if (control && !control.matches('[data-row-drag-handle], [data-tour="candidate-profile-open"]')) return;
    if (event.type === "mousedown") listeners?.onMouseDown?.(event);
    else listeners?.onTouchStart?.(event);
  };
  return <tr ref={setNodeRef} onMouseDown={reorderable ? startRowDrag : undefined} onTouchStart={reorderable ? startRowDrag : undefined} onClick={() => {if (!isDragging) onOpen(student);}}
    style={{transform: CSS.Transform.toString(transform ? {...transform, x: 0, scaleX: 1, scaleY: 1} : null), transition: reduceMotion ? undefined : transition, position: "relative", zIndex: isDragging ? 20 : undefined, boxShadow: isDragging ? "0 8px 22px #00000018" : undefined}}
    className={`group ${reorderable ? "cursor-grab active:cursor-grabbing select-none" : "cursor-pointer"} hover:bg-white/70 focus-within:bg-white/70 ${isDragging ? "bg-[#FAF7F2] [&>td]:!bg-[#FAF7F2] [&>th]:!bg-[#FAF7F2]" : ""}`}>
    {children(handle)}
  </tr>;
}

export function CandidateBrowser({profileSchemaReady = true, students, recommended, pickedIds = new Set(), onAdd, onRemove, onOpen, renderShortlist, view = "all", onBrowseAll, hideHeading = false, shortlistOrder = [], fillHeight = false, expanded = false, onReorder}) {
  const sensors = useSensors(useSensor(MouseSensor, {activationConstraint: {distance: 6}}), useSensor(TouchSensor, {activationConstraint: {delay: 200, tolerance: 8}}), useSensor(KeyboardSensor, {coordinateGetter: sortableKeyboardCoordinates}));
  const reorderable = view === "shortlist" && !!onReorder;
  const shortlistWidth = reorderable ? 68 : 56;
  const tableWidth = 1120 + shortlistWidth;
  const [sort, setSort] = useState({key: "tier", direction: "asc"});
  const toggleSort = key => setSort(current => ({key, direction: current.key === key && current.direction === "asc" ? "desc" : "asc"}));
  const sortDirection = key => view !== "shortlist" && sort.key === key ? (sort.direction === "asc" ? "ascending" : "descending") : "none";
  const sortArrow = key => sort.key === key ? (sort.direction === "asc" ? "↑" : "↓") : "↕";
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  // Hide fields that the current API does not support, rather than imply missing answers.
  const fields = useMemo(() => [
    ...profileFields.filter(field => profileSchemaReady || students.some(student => field.key in student)),
  ].sort((a, b) => projectFieldOrder(a) - projectFieldOrder(b)), [students, profileSchemaReady]);
  const options = useMemo(() => fields.filter(field => field.filter).map(field => {
    const values = new Map();
    students.forEach(student => fieldSelections(student, field).forEach(value => values.set(value.toLowerCase(), value)));
    return {...field, options: [...values.values()].sort(field.key === "tier" ? compareTier : (a, b) => a.localeCompare(b))};
  }).filter(field => field.options.length), [students, fields]);
  const recommendedIds = useMemo(() => new Set((recommended || []).map(student => student.id)), [recommended]);
  const visible = students.filter(student => {
    if (view === "recommended" && !recommendedIds.has(student.id)) return false;
    if (view === "shortlist") return pickedIds.has(student.id);
    const q = search.trim().toLowerCase();
    if (q && ![student.name, ...fields.map(field => profileValue(student, field))].some(value => String(value ?? "").toLowerCase().includes(q))) return false;
    return options.every(field => {
      if (!filters[field.key]?.length) return true;
      const values = fieldSelections(student, field);
      return (field.filterFirstChoice ? values.slice(0, 1) : values).some(value => filters[field.key].includes(value.toLowerCase()));
    });
  });
  if (view === "shortlist") {
    const ranks = new Map(shortlistOrder.map((id, index) => [id, index]));
    visible.sort((a, b) => (ranks.get(a.id) ?? Infinity) - (ranks.get(b.id) ?? Infinity));
  } else {
    visible.sort((a, b) => compareCandidates(a, b, sort.key, sort.direction));
  }
  const activeCount = Object.values(filters).reduce((count, values) => count + values.length, 0);
  function toggle(key, value, single = false) {
    const normalized = value.toLowerCase();
    setFilters(current => ({...current, [key]: current[key]?.includes(normalized) ? current[key].filter(v => v !== normalized) : single ? [normalized] : [...(current[key] || []), normalized]}));
  }
  return <section className={fillHeight ? "flex min-h-0 min-w-0 flex-1 flex-col" : "min-w-0"} aria-label="Candidate discovery">
    {!hideHeading && <div className="mb-3 flex items-center justify-between gap-2"><h2 className="text-base font-semibold">Candidates</h2><span aria-live="polite" className="text-xs text-gray-500">{visible.length} candidate{visible.length === 1 ? "" : "s"}</span></div>}
    {!profileSchemaReady && <p role="status" className="mb-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">Expanded profiles are not available yet. Existing candidate information remains available.</p>}
    {view !== "shortlist" && <>
    <input data-tour="candidate-search" type="search" value={search} onChange={event => setSearch(event.target.value)} aria-label="Search candidates" placeholder="Search candidates, interests, or expertise…" className="mb-3 w-full shrink-0 rounded-md border border-gray-300 bg-white/70 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#E5AC61]/40 sm:text-sm" />
    <div className={fillHeight ? "mb-3 flex shrink-0 gap-2 overflow-x-auto pb-1" : "mb-3 flex flex-wrap gap-2"}>{options.map(field => <Popover key={field.key}><PopoverTrigger asChild><button type="button" className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs leading-4 ${filters[field.key]?.length ? "border-[#E5AC61] bg-[#E5AC61]/10" : "border-gray-300"}`}>{field.filterLabel || field.label}{filters[field.key]?.length ? ` (${filters[field.key].length})` : ""} <ChevronDown aria-hidden="true" size={14} className="shrink-0" /></button></PopoverTrigger><PopoverContent align="start" className="max-h-72 overflow-y-auto bg-[#FAF7F2] text-[#444444]"><fieldset><legend className="mb-2 text-sm font-semibold">{field.filterLabel || field.label}</legend>{field.options.map(value => field.filterFirstChoice ? <button key={value} type="button" aria-pressed={!!filters[field.key]?.includes(value.toLowerCase())} onClick={() => toggle(field.key, value, true)} className="flex w-full items-center gap-2 rounded-md px-1 py-2 text-left text-sm hover:bg-[#E5AC61]/10"><span aria-hidden="true" className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${filters[field.key]?.includes(value.toLowerCase()) ? "border-[#444444]" : "border-gray-400"}`}>{filters[field.key]?.includes(value.toLowerCase()) && <span className="h-2 w-2 rounded-full bg-[#444444]" />}</span><span>{value}</span></button> : <label key={value} className="flex cursor-pointer items-start gap-2 py-1.5 text-sm"><input type="checkbox" checked={!!filters[field.key]?.includes(value.toLowerCase())} onChange={() => toggle(field.key, value)} className="mt-1 accent-[#444444]" /><span>{value}</span></label>)}</fieldset></PopoverContent></Popover>)}
      {(search || activeCount > 0) && <button type="button" onClick={() => {setSearch(""); setFilters({});}} className="shrink-0 px-1 text-xs underline underline-offset-4">Clear filters</button>}
    </div>
    </>}
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={({active, over}) => {
      if (reorderable && over && active.id !== over.id) onReorder(active.id, over.id);
    }} accessibility={{screenReaderInstructions: {draggable: "Press Space to pick up a candidate, use the up and down arrow keys to change rank, then Space to drop or Escape to cancel."}}}>
    <div data-tour="candidate-table" tabIndex={0} role="region" aria-label="Candidate table, scroll horizontally for all columns" className={`${fillHeight ? "min-h-0 flex-1" : "max-h-[65vh]"} overflow-auto overscroll-contain rounded-sm border-y border-gray-200 focus-visible:outline-[#E5AC61]`}>
      <table style={{width: expanded ? "100%" : tableWidth, minWidth: tableWidth}} className="table-fixed border-separate border-spacing-0 text-left text-sm">
        <caption className="sr-only">Candidates. Select a name or row to view the complete profile. Shortlist and Name stay visible while scrolling.</caption>
        <colgroup>
          <col style={{width: shortlistWidth}} /><col style={{width: 176}} />
          {tableFields.map(field => <col key={field.key} style={{width: field.key === "tier" ? 64 : field.key === "links" || !expanded ? 176 : undefined}} />)}
        </colgroup>
        <thead className="text-xs text-gray-500"><tr>
          <th data-tour="shortlist-column" scope="col" style={{width: shortlistWidth}} className="sticky left-0 top-0 z-30 border-b border-gray-200 bg-[#FAF7F2] px-3 py-3 font-medium"><span className="sr-only">Shortlist</span></th>
          <th scope="col" aria-sort={sortDirection("name")} style={{left: shortlistWidth}} className="sticky top-0 z-30 w-44 min-w-44 max-w-44 border-b border-r border-gray-200 bg-[#FAF7F2] px-3 py-3 font-medium">{view === "shortlist" ? "Name" : <button type="button" onClick={() => toggleSort("name")} className="inline-flex items-center gap-1" aria-label="Sort by name: A–Z or Z–A">Name <span aria-hidden="true">{sortArrow("name")}</span></button>}</th>
          {tableFields.map(field => <th scope="col" key={field.key} aria-sort={field.key === "tier" ? sortDirection("tier") : undefined} className={`sticky top-0 z-20 ${tableColumnWidth(field, expanded)} border-b border-gray-200 bg-[#FAF7F2] px-3 py-3 font-medium`}>{field.key === "tier" && view !== "shortlist" ? <button type="button" onClick={() => toggleSort("tier")} className="inline-flex items-center gap-1" aria-label="Sort by tier: S–C or C–S">Tier <span aria-hidden="true">{sortArrow("tier")}</span></button> : <span className="block truncate" title={field.label}>{field.label}</span>}</th>)}
        </tr></thead>
        <SortableContext items={visible.map(student => student.id)} strategy={verticalListSortingStrategy}><tbody>{visible.map(student => <CandidateRow key={student.id} student={student} rank={shortlistOrder.indexOf(student.id) + 1} reorderable={reorderable} onOpen={onOpen}>{handle => <>
          <td onClick={event => {if (!reorderable) event.stopPropagation();}} style={{width: shortlistWidth}} className={`sticky left-0 z-10 border-b border-gray-200 bg-[#FAF7F2] ${reorderable ? "pl-0 pr-1" : "px-3"} py-3 align-top group-hover:bg-[#FDFBF8]`}><div className="flex items-center">{handle}{renderShortlist ? renderShortlist(student) : <button data-tour="shortlist-star" type="button" aria-pressed={pickedIds.has(student.id)} aria-label={`${pickedIds.has(student.id) ? "Remove" : "Add"} ${student.name} ${pickedIds.has(student.id) ? "from" : "to"} shortlist`} onClick={event => {event.stopPropagation(); if (pickedIds.has(student.id)) onRemove?.(student.id); else onAdd(student.id);}} className="flex h-8 w-8 items-center justify-center rounded-md text-[#B57D30] hover:bg-[#E5AC61]/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E5AC61]"><Star aria-hidden="true" size={18} fill={pickedIds.has(student.id) ? "currentColor" : "none"} /></button>}</div></td>
          <th scope="row" style={{left: shortlistWidth}} className="sticky z-10 w-44 min-w-44 max-w-44 border-b border-r border-gray-200 bg-[#FAF7F2] px-3 py-3 align-middle font-medium group-hover:bg-[#FDFBF8]"><button type="button" onClick={event => {event.stopPropagation(); onOpen(student);}} data-tour="candidate-profile-open" className="break-words text-left underline decoration-[#E5AC61] underline-offset-4" aria-label={`View profile for ${student.name}`}>{student.name}</button></th>
          {tableFields.map(field => <td key={field.key} className={`${tableColumnWidth(field, expanded)} overflow-hidden border-b border-gray-200 px-3 py-3 align-top text-xs text-gray-600`}>{field.key === "links" ? <CandidateLinks student={student} /> : <ProfileValue student={student} field={field} compact />}</td>)}
        </>}</CandidateRow>)}</tbody></SortableContext>
      </table>
      {!visible.length && <p className="px-3 py-6 text-sm text-gray-500">{!students.length ? "No candidates have been imported yet." : view === "shortlist" && !pickedIds.size ? "Your shortlist is empty. Star candidates in Recommended or All Candidates to add them." : view === "recommended" && !recommended?.length ? <>No recommendations yet. {onBrowseAll && <button type="button" onClick={onBrowseAll} className="underline underline-offset-4">Browse all candidates</button>}</> : "No candidates match these filters. Try clearing a filter or changing your search."}</p>}
    </div>
    </DndContext>
  </section>;
}

export function StudentProfile({student, onClose, onAdd, onRemove, picked, saving, children, touring = false}) {
  const returnFocus = useRef(null);
  const fields = student ? profileFields.filter(field => !candidateLinks.some(link => link.key === field.key) && (field.key in student || field.headers?.some(header => header in student))).sort((a, b) => projectFieldOrder(a) - projectFieldOrder(b)) : [];
  return <Dialog modal={!touring} open={!!student} onOpenChange={open => {if (!open) onClose();}}><DialogContent data-tour="candidate-profile" onInteractOutside={event => {if (touring) event.preventDefault();}} onEscapeKeyDown={event => {if (touring) event.preventDefault();}} aria-describedby={undefined} onOpenAutoFocus={() => {returnFocus.current = document.activeElement;}} onCloseAutoFocus={event => {event.preventDefault(); if (touring) return; if (returnFocus.current?.isConnected) returnFocus.current.focus();}} className="max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-3xl overflow-y-auto rounded-lg border-gray-200 bg-[#FAF7F2] text-[#444444]">
    <div data-tour="candidate-profile-header" className="border-b border-gray-200 pb-4 pr-6"><p className="mb-2 text-xs uppercase tracking-[0.16em] text-gray-500">Candidate profile</p><div className="flex flex-wrap items-center justify-between gap-3"><DialogTitle className="min-w-0 flex-1 break-words font-sans text-3xl font-semibold leading-tight">{student?.name}</DialogTitle>{student && <div role="group" aria-label="Candidate links" className="shrink-0"><CandidateLinks student={student} large /></div>}</div></div>
    <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2">{fields.map(field => <div key={field.key} className={field.key === "project_description" ? "sm:col-span-2" : "min-w-0"}><dt className="mb-1.5 text-xs font-medium text-gray-500">{field.label}</dt><dd className="break-words text-sm leading-relaxed"><ProfileValue student={student} field={field} /></dd></div>)}</dl>
    {children}
    <div className="flex items-center justify-between gap-3 border-t border-gray-200 pt-4"><button type="button" onClick={onClose} className="text-sm underline underline-offset-4">Back to candidates</button>{onAdd && <button type="button" disabled={saving || (picked && !onRemove)} onClick={() => picked ? onRemove?.(student.id) : onAdd(student.id)} className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40">{picked ? "Remove from shortlist" : "Add to shortlist"}</button>}</div>
  </DialogContent></Dialog>;
}

function ProfileValue({student, field, compact = false}) {
  const value = profileValue(student, field);
  if (!value || Array.isArray(value) && !value.length) return <span className="text-gray-400">{compact ? "—" : "Not provided"}</span>;
  if (field.link) {
    const url = safeProfileUrl(value);
    return url ? <a href={url} target="_blank" rel="noopener noreferrer" onClick={event => event.stopPropagation()} className="underline decoration-[#E5AC61] underline-offset-4">{field.label} ↗</a> : <span className="text-gray-400">Link unavailable</span>;
  }
  if (field.multi && compact) {
    const summary = fieldSelections(student, field).join(", ");
    return <span className="block truncate leading-8" title={summary}>{summary}</span>;
  }
  if (field.multi) return <ol className={compact ? "flex w-max flex-nowrap gap-1.5 whitespace-nowrap" : "flex flex-wrap gap-1.5"}>{fieldSelections(student, field).map((item, index) => <li key={item} className="shrink-0 rounded bg-[#E5AC61]/10 px-2 py-0.5 text-xs">{field.ranked && <span className="mr-1 text-gray-500">{index + 1}.</span>}{item}</li>)}</ol>;
  return <span className={compact ? "block truncate leading-8" : "whitespace-pre-wrap"}>{Array.isArray(value) ? value.join(", ") : String(value)}</span>;
}
