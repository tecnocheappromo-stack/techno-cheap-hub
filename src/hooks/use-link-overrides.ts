import { useEffect, useState } from "react";
import {
  getLinkOverrides,
  LINKS_UPDATED_EVENT,
  type LinkOverrides,
} from "@/config/categories";

/** Reativo: re-renderiza quando um link é salvo no painel admin. */
export function useLinkOverrides(): LinkOverrides {
  const [overrides, setOverrides] = useState<LinkOverrides>(() => getLinkOverrides());

  useEffect(() => {
    const sync = () => setOverrides(getLinkOverrides());
    sync();
    window.addEventListener(LINKS_UPDATED_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(LINKS_UPDATED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return overrides;
}

export function useEffectiveLink(id: string, fallback: string): string {
  const overrides = useLinkOverrides();
  return overrides[id] ?? fallback;
}
