// One in-flight snapshot at a time. Edits made during a request are saved next.
export function createShortlistAutosave(save, delay = 450) {
  let picks = [], saved = "[]", status = "idle", error = "", timer, inFlight, uncertain = false;
  const listeners = new Set();
  const snapshot = () => ({picks, dirty: uncertain || status === "saving" || JSON.stringify(picks) !== saved, status, error});
  const emit = () => listeners.forEach(listener => listener(snapshot()));
  const flush = () => {
    clearTimeout(timer);
    if (inFlight) return inFlight;
    // Defer execution so inFlight is assigned even for an already-saved snapshot.
    inFlight = Promise.resolve().then(async () => {
      try {
        while (uncertain || JSON.stringify(picks) !== saved) {
          const sending = picks.map(pick => ({...pick}));
          const sendingKey = JSON.stringify(sending);
          status = "saving"; error = ""; emit();
          await save(sending);
          saved = sendingKey; uncertain = false;
        }
        status = "saved"; error = ""; emit();
        return true;
      } catch (cause) {
        uncertain = true;
        status = "error";
        error = cause?.response?.data?.error || "Could not save your shortlist. Your changes are still here. Check your connection and retry.";
        emit();
        return false;
      } finally { inFlight = undefined; }
    });
    return inFlight;
  };
  return {
    snapshot,
    subscribe(listener) { listeners.add(listener); listener(snapshot()); return () => listeners.delete(listener); },
    initialize(initial) { uncertain = false; picks = initial; saved = JSON.stringify(initial); status = "idle"; error = ""; emit(); },
    edit(updater) {
      const next = updater(picks);
      if (JSON.stringify(next) === JSON.stringify(picks)) return;
      picks = next;
      status = inFlight ? "saving" : "pending"; error = ""; emit();
      clearTimeout(timer);
      timer = setTimeout(flush, delay);
    },
    flush,
  };
}
