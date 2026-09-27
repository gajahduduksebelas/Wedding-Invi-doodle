import { useEffect, useRef } from 'react';

/**
 * Lets a CMS editor tell the dashboard about unsaved edits: reports the draft
 * while it differs from the saved value, and null once they match again
 * (after a save, or when the edit is undone). The dashboard uses this to
 * autosave on tab switch and to power the global save button.
 */
export function useDraftReporter<T>(
  draft: T,
  saved: T,
  onDraftChange?: (draft: T | null) => void
) {
  const callbackRef = useRef(onDraftChange);
  callbackRef.current = onDraftChange;
  const draftRef = useRef(draft);
  draftRef.current = draft;

  const draftJson = JSON.stringify(draft);
  const savedJson = JSON.stringify(saved);

  useEffect(() => {
    callbackRef.current?.(draftJson === savedJson ? null : draftRef.current);
  }, [draftJson, savedJson]);
}
