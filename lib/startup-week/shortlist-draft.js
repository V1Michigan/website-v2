// A Save click sends one snapshot; edits made during the request remain unsaved.
export function createShortlistDraft(save) {
  let picks = [], saved = "[]", version = null, status = "idle", error = "", inFlight, uncertain = false;
  const listeners = new Set();
  const snapshot = () => ({picks, dirty: uncertain || JSON.stringify(picks) !== saved, status, error});
  const emit = () => listeners.forEach(listener => listener(snapshot()));
  return {
    snapshot,
    subscribe(listener) { listeners.add(listener); listener(snapshot()); return () => listeners.delete(listener); },
    initialize(initial, revision) { picks = initial; saved = JSON.stringify(initial); version = revision; status = "idle"; error = ""; uncertain = false; emit(); },
    edit(updater) {
      picks = updater(picks);
      if (!["saving", "conflict", "error"].includes(status)) status = "pending";
      emit();
    },
    save() {
      if (inFlight) return inFlight;
      if (status === "conflict" || !version) return Promise.resolve(false);
      const sending = picks.map(pick => ({...pick}));
      const sendingKey = JSON.stringify(sending);
      status = "saving"; error = ""; emit();
      inFlight = Promise.resolve().then(() => save(sending, version)).then(nextVersion => {
        version = nextVersion; saved = sendingKey; uncertain = false;
        status = JSON.stringify(picks) === saved ? "saved" : "pending"; emit(); return true;
      }).catch(cause => {
        uncertain = true;
        status = cause?.response?.status === 409 ? "conflict" : "error";
        error = cause?.response?.data?.error || "Could not confirm the save. Your edits are still here. Retry to check again.";
        emit(); return false;
      }).finally(() => { inFlight = undefined; });
      return inFlight;
    },
  };
}
