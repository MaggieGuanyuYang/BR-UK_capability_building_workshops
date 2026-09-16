import { useEffect, useState } from "react";
import {
  relevantStrategies,
  roles,
  strategies,
  type RoleId,
} from "../data/strategies";

const STORAGE_KEY = "research-into-action:plan:v1";

export function validIds(values: unknown): number[] {
  if (!Array.isArray(values)) return [];
  return [
    ...new Set(
      values.filter(
        (id): id is number => Number.isInteger(id) && id >= 1 && id <= 10,
      ),
    ),
  ];
}

function readLocation() {
  const params = new URLSearchParams(window.location.search);
  const role = roles.find((item) => item.id === params.get("role")) ?? roles[0];
  const strategy =
    strategies.find((item) => item.id === Number(params.get("strategy"))) ??
    relevantStrategies(role.id)[0];
  return { role: role.id, strategy: strategy.id };
}

function readSaved() {
  const params = new URLSearchParams(window.location.search);
  if (params.has("plan"))
    return validIds(params.get("plan")!.split(",").map(Number));
  try {
    return validIds(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"));
  } catch {
    return [];
  }
}

export function useExplorer() {
  const [selection, setSelection] = useState(readLocation);
  const [saved, setSaved] = useState<number[]>(readSaved);
  const [storageAvailable, setStorageAvailable] = useState(true);

  useEffect(() => {
    const onBack = () => {
      setSelection(readLocation());
      if (new URLSearchParams(window.location.search).has("plan"))
        setSaved(readSaved());
    };
    window.addEventListener("popstate", onBack);
    return () => window.removeEventListener("popstate", onBack);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch {
      setStorageAvailable(false);
    }
    // Keep an edited shared plan in sync without side effects in a state updater.
    const url = new URL(window.location.href);
    if (url.searchParams.has("plan")) {
      url.searchParams.set("plan", saved.join(","));
      window.history.replaceState(null, "", url);
    }
  }, [saved]);

  function select(role: RoleId, strategy: number) {
    setSelection({ role, strategy });
    const url = new URL(window.location.href);
    url.searchParams.set("role", role);
    url.searchParams.set("strategy", String(strategy));
    window.history.pushState(null, "", url);
  }

  function toggleSaved(id: number) {
    setSaved((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );
  }

  return {
    role: roles.find((item) => item.id === selection.role)!,
    strategy: strategies.find((item) => item.id === selection.strategy)!,
    saved,
    storageAvailable,
    selectRole: (role: RoleId) => select(role, relevantStrategies(role)[0].id),
    selectStrategy: (id: number) => select(selection.role, id),
    toggleSaved,
  };
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Clipboard API may be unavailable in an embedded browser or an HTTP preview.
    const previousFocus = document.activeElement as HTMLElement | null;
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    const host = document.querySelector("dialog[open]") ?? document.body;
    host.appendChild(field);
    field.select();
    try {
      return document.execCommand("copy");
    } catch {
      return false;
    } finally {
      field.remove();
      previousFocus?.focus({ preventScroll: true });
    }
  }
}

export function makeShareUrl(saved: number[]) {
  const url = new URL(window.location.href);
  url.searchParams.delete("export");
  if (saved.length) url.searchParams.set("plan", saved.join(","));
  else url.searchParams.delete("plan");
  return url.toString();
}
