"use client";

import React, { useEffect, useReducer } from "react";

interface TimelineRailProps {
  sectionRefs: React.RefObject<HTMLElement>[];
}

interface TimelineRailState {
  activeIndex: number;
  filledDotTop: number;
  railLeft: number;
  markerTops: number[];
}

type TimelineRailAction =
  | { type: "SET_ACTIVE_INDEX"; payload: number }
  | { type: "SET_FILLED_DOT_TOP"; payload: number }
  | { type: "SET_RAIL_LEFT"; payload: number }
  | { type: "SET_MARKER_TOPS"; payload: number[] }
  | { type: "UPDATE_LAYOUT"; payload: { railLeft: number; markerTops: number[] } }
  | { type: "UPDATE_POSITIONS"; payload: { activeIndex: number; filledDotTop: number } };

const initialState: TimelineRailState = {
  activeIndex: 0,
  filledDotTop: 0,
  railLeft: 64,
  markerTops: [],
};

function timelineRailReducer(
  state: TimelineRailState,
  action: TimelineRailAction
): TimelineRailState {
  switch (action.type) {
    case "SET_ACTIVE_INDEX":
      return { ...state, activeIndex: action.payload };
    case "SET_FILLED_DOT_TOP":
      return { ...state, filledDotTop: action.payload };
    case "SET_RAIL_LEFT":
      return { ...state, railLeft: action.payload };
    case "SET_MARKER_TOPS":
      return { ...state, markerTops: action.payload };
    case "UPDATE_LAYOUT":
      return {
        ...state,
        railLeft: action.payload.railLeft,
        markerTops: action.payload.markerTops,
      };
    case "UPDATE_POSITIONS":
      return {
        ...state,
        activeIndex: action.payload.activeIndex,
        filledDotTop: action.payload.filledDotTop,
      };
    default:
      return state;
  }
}

export default function TimelineRail({ sectionRefs }: TimelineRailProps) {
  const [state, dispatch] = useReducer(timelineRailReducer, initialState);

  const computeLayout = () => {
    const positions: number[] = [];
    const first = sectionRefs[0]?.current;
    if (first) {
      const left = first.getBoundingClientRect().left;
      dispatch({ type: "SET_RAIL_LEFT", payload: left });
    }

    sectionRefs.forEach((ref) => {
      const el = ref.current;
      if (!el) return;
      const titleEl = el.querySelector("h2");
      if (!titleEl) return;
      const titleRect = titleEl.getBoundingClientRect();
      positions.push(titleRect.top);
    });
    dispatch({ type: "SET_MARKER_TOPS", payload: positions });
  };

  useEffect(() => {
    const update = () => {
      if (sectionRefs.length === 0) return;

      const viewportTop = window.scrollY;
      const viewportBottom = viewportTop + window.innerHeight;

      let closestIdx = 0;
      let maxVisibility = 0;

      sectionRefs.forEach((ref, idx) => {
        const el = ref.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const sectionTop = rect.top + window.scrollY;
        const sectionBottom = sectionTop + rect.height;

        const visibleTop = Math.max(viewportTop, sectionTop);
        const visibleBottom = Math.min(viewportBottom, sectionBottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const visibility = visibleHeight / rect.height;

        if (visibility > maxVisibility) {
          maxVisibility = visibility;
          closestIdx = idx;
        }
      });

      const currentSection = sectionRefs[closestIdx]?.current;
      if (currentSection) {
        const titleEl = currentSection.querySelector("h2");
        if (titleEl) {
          const titleRect = titleEl.getBoundingClientRect();
          dispatch({
            type: "UPDATE_POSITIONS",
            payload: {
              activeIndex: closestIdx,
              filledDotTop: titleRect.top,
            },
          });
        }
      }
    };

    setTimeout(() => {
      computeLayout();
      update();
    }, 100);

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", () => {
      computeLayout();
      update();
    });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", () => {
        /* noop */
      });
    };
  }, [sectionRefs]);

  return (
    <div
      className="pointer-events-none fixed left-0 top-0 bottom-0 z-10"
      aria-hidden
    >
      {/* Continuous vertical line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-gray-200"
        style={{ left: state.railLeft }}
      />

      {/* Empty circles at each section title */}
      {state.markerTops.map((topPos) => (
        <div
          key={topPos}
          className="absolute -translate-x-1/2 h-4 w-4 rounded-full border-2 border-[#F5A623] bg-white"
          style={{ top: topPos - 8, left: state.railLeft }}
        />
      ))}

      {/* Moving filled circle */}
      <div
        className="absolute -translate-x-1/2 h-4 w-4 rounded-full bg-[#F5A623] transition-[top] duration-300 ease-out z-10"
        style={{ top: state.filledDotTop - 8, left: state.railLeft }}
      />
    </div>
  );
}
