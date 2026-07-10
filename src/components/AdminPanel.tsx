import { useEffect, useMemo, useState } from "react";
import {
  CATEGORIES,
  SITE_LINKS,
  STORES,
  validateConfig,
  validateLink,
  setLinkOverride,
  clearLinkOverride,
  buildConfigExport,
  ALLOWED_LINK_HOSTS,
  type CategoryIssue,
  type StoreId,
} from "@/config/categories";
import { useLinkOverrides } from "@/hooks/use-link-overrides";
import {
  ShieldCheck,
  AlertTriangle,
  CircleHelp,
  CheckCircle2,
  X,
  Copy,
  ExternalLink,
  Settings2,
  Pencil,
  Save,
  RotateCcw,
  Download,
} from "lucide-react";

/**
 * Painel de administração visível apenas em modo de edição.
 *
 * Como ativar:
 *  - Adicione `?admin=1` na URL  →  ativa e fica salvo (localStorage)
 *  - Adicione `?admin=0`         →  desativa
 *
 * Permite editar cada link, salvar no localStorage (com validação),
 * restaurar o link padrão e exportar a configuração atual em JSON.
 */
export function AdminPanel() {
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(true);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const flag = params.get("admin");
    if (flag === "1") {
      localStorage.setItem("tc_admin", "1");
      setEnabled(true);
    } else if (flag === "0") {
      localStorage.removeItem("tc_admin");
      setEnabled(false);
    } else {
      setEnabled(localStorage.getItem("tc_admin") === "1");
    }
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  if (!enabled) return null;

  return (
    <>
      <Panel
        open={open}
        setOpen={setOpen}
        onToast={setToast}
        toast={toast}
      />
    </>
  );
}

function Panel({
  open,
  setOpen,
  onToast,
  toast,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  onToast: (t: { type: "ok" | "err"; msg: string } | null) => void;
  toast: { type: "ok" | "err"; msg: string } | null;
}) {
  const overrides = useLinkOverrides();

  const rows = useMemo(
    () => [
      ...Object.entries(SITE_LINKS).map(([key, defaultLink]) => {
        const id = `SITE_LINKS.${key}`;
        return {
          id,
          name:
            key === "mainVideo"
              ? "Botão: Ver produto do vídeo"
              : key === "whatsappGroup"
                ? "Botão: Grupo do WhatsApp"
                : "Botão: Ver todos os achadinhos",
          store: undefined as StoreId | undefined,
          defaultLink,
          currentLink: overrides[id] ?? defaultLink,
          isOverridden: id in overrides,
          isGlobal: true,
        };
      }),
      ...CATEGORIES.map((c) => ({
        id: c.id,
        name: c.name,
        store: c.store,
        defaultLink: c.link,
        currentLink: overrides[c.id] ?? c.link,
        isOverridden: c.id in overrides,
        isGlobal: false,
      })),
    ],
    [overrides],
  );

  const issues = validateConfig();
  const issuesById = issues.reduce<Record<string, CategoryIssue[]>>((acc, i) => {
    (acc[i.id] ||= []).push(i);
    return acc;
  }, {});

  const valid = rows.filter((r) => validateLink(r.currentLink, r.store).status === "valid").length;
  const placeholder = rows.filter(
    (r) => validateLink(r.currentLink, r.store).status === "placeholder",
  ).length;
  const invalid = rows.filter((r) => validateLink(r.currentLink, r.store).status === "invalid").length;

  const handleExport = async () => {
    const json = buildConfigExport();
    try {
      await navigator.clipboard.writeText(json);
      onToast({ type: "ok", msg: "Configuração copiada para a área de transferência" });
    } catch {
      onToast({ type: "err", msg: "Não foi possível copiar — abra o console" });
      console.log("[Techno Cheap] Configuração:\n" + json);
    }
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-24 md:bottom-6 right-4 z-[60] flex items-center gap-2 px-4 py-3 rounded-full bg-foreground text-background text-xs font-bold shadow-lg hover:scale-105 transition-transform"
        >
          <Settings2 size={14} />
          Admin
          {invalid > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] rounded-full bg-red-500 text-white">
              {invalid}
            </span>
          )}
        </button>
      )}

      {open && (
        <div className="fixed inset-x-0 bottom-0 md:inset-auto md:bottom-6 md:right-6 md:w-[480px] z-[60] max-h-[88vh] flex flex-col bg-background border border-border rounded-t-2xl md:rounded-2xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-foreground text-background flex items-center justify-center">
                <ShieldCheck size={16} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground leading-tight">
                  Painel de edição
                </h3>
                <p className="text-[10px] text-muted-foreground">
                  Edite e salve os links (apenas no seu navegador)
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-md hover:bg-muted text-muted-foreground"
              aria-label="Fechar"
            >
              <X size={16} />
            </button>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-3 gap-2 p-4 border-b border-border">
            <StatPill icon={CheckCircle2} count={valid} label="Válidos" tone="ok" />
            <StatPill icon={CircleHelp} count={placeholder} label="Pendentes" tone="warn" />
            <StatPill icon={AlertTriangle} count={invalid} label="Inválidos" tone="error" />
          </div>

          {/* Export */}
          <div className="p-3 border-b border-border flex items-center gap-2">
            <button
              onClick={handleExport}
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-foreground text-background text-xs font-bold hover:opacity-90"
            >
              <Download size={13} />
              Exportar configuração (JSON)
            </button>
          </div>

          {/* Toast */}
          {toast && (
            <div
              className={`px-4 py-2 text-[11px] font-semibold border-b border-border ${
                toast.type === "ok"
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  : "bg-red-500/10 text-red-700 dark:text-red-400"
              }`}
            >
              {toast.msg}
            </div>
          )}

          {/* Allowed hosts hint */}
          <div className="px-4 py-2 bg-muted/40 border-b border-border text-[10px] text-muted-foreground">
            Domínios aceitos:{" "}
            <span className="font-mono">{ALLOWED_LINK_HOSTS.join(", ")}</span>
          </div>

          {/* List */}
          <div className="overflow-y-auto flex-1 divide-y divide-border">
            {rows.map((r) => (
              <Row
                key={r.id}
                id={r.id}
                name={r.name}
                store={r.store}
                isGlobal={r.isGlobal}
                currentLink={r.currentLink}
                defaultLink={r.defaultLink}
                isOverridden={r.isOverridden}
                rowIssues={issuesById[r.id] ?? []}
                onToast={onToast}
              />
            ))}
          </div>

          <div className="p-3 border-t border-border text-[10px] text-muted-foreground text-center">
            Para desativar adicione <code>?admin=0</code> na URL.
          </div>
        </div>
      )}
    </>
  );
}

function Row({
  id,
  name,
  store,
  isGlobal,
  currentLink,
  defaultLink,
  isOverridden,
  rowIssues,
  onToast,
}: {
  id: string;
  name: string;
  store?: StoreId;
  isGlobal: boolean;
  currentLink: string;
  defaultLink: string;
  isOverridden: boolean;
  rowIssues: CategoryIssue[];
  onToast: (t: { type: "ok" | "err"; msg: string } | null) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(currentLink);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!editing) {
      setDraft(currentLink);
      setLocalError(null);
    }
  }, [currentLink, editing]);

  const v = validateLink(currentLink, store);
  const draftValidation = validateLink(draft, store);
  const rowHosts = store ? STORES[store].hosts : ALLOWED_LINK_HOSTS;

  const handleSave = () => {
    const trimmed = draft.trim();
    const r = validateLink(trimmed, store);
    if (r.status === "invalid") {
      setLocalError(r.message);
      onToast({ type: "err", msg: `Link inválido: ${r.message}` });
      return;
    }
    setLinkOverride(id, trimmed);
    setLocalError(null);
    setEditing(false);
    onToast({ type: "ok", msg: `Link salvo: ${name}` });
  };

  const handleCancel = () => {
    setDraft(currentLink);
    setLocalError(null);
    setEditing(false);
  };

  const handleReset = () => {
    clearLinkOverride(id);
    setEditing(false);
    onToast({ type: "ok", msg: `Link restaurado: ${name}` });
  };

  return (
    <div className="p-4 text-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-foreground truncate">{name}</span>
            {store && (
              <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded ${STORES[store].badgeClass}`}>
                {STORES[store].label}
              </span>
            )}
            {isGlobal && (
              <span className="text-[9px] uppercase tracking-wider bg-muted px-1.5 py-0.5 rounded">
                global
              </span>
            )}
            {isOverridden && (
              <span className="text-[9px] uppercase tracking-wider bg-blue-500/15 text-blue-700 dark:text-blue-400 px-1.5 py-0.5 rounded">
                editado
              </span>
            )}
          </div>
          <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{id}</p>
        </div>
        <StatusBadge status={v.status} />
      </div>

      {!editing ? (
        <>
          <div className="mt-2 flex items-center gap-1.5">
            <code className="flex-1 min-w-0 truncate text-[11px] bg-muted/60 px-2 py-1.5 rounded font-mono text-muted-foreground">
              {currentLink}
            </code>
            <button
              onClick={() => navigator.clipboard?.writeText(currentLink)}
              className="p-1.5 rounded-md hover:bg-muted text-muted-foreground"
              title="Copiar"
            >
              <Copy size={13} />
            </button>
            {v.status === "valid" && (
              <a
                href={v.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground"
                title="Testar link"
              >
                <ExternalLink size={13} />
              </a>
            )}
            <button
              onClick={() => setEditing(true)}
              className="p-1.5 rounded-md hover:bg-muted text-foreground"
              title="Editar link"
            >
              <Pencil size={13} />
            </button>
          </div>

          {v.status !== "valid" && (
            <p
              className={`mt-2 text-[11px] ${
                v.status === "invalid"
                  ? "text-red-600 dark:text-red-400"
                  : "text-amber-600 dark:text-amber-400"
              }`}
            >
              {v.message}
            </p>
          )}
        </>
      ) : (
        <div className="mt-2 space-y-2">
          <input
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              setLocalError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
            }}
            placeholder={store ? `https://${STORES[store].hosts[0]}/...` : "https://..."}
            className="w-full px-3 py-2 text-[12px] font-mono rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            autoFocus
          />
          <p className="text-[10px] text-muted-foreground">
            Domínios aceitos: <span className="font-mono">{rowHosts.join(", ")}</span>
          </p>
          {localError && (
            <p className="text-[11px] text-red-600 dark:text-red-400">{localError}</p>
          )}
          {!localError && draftValidation.status === "placeholder" && (
            <p className="text-[11px] text-amber-600 dark:text-amber-400">
              {draftValidation.message}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSave}
              disabled={draftValidation.status === "invalid"}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-bold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Save size={12} /> Salvar link
            </button>
            <button
              onClick={handleCancel}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-foreground text-xs font-semibold hover:bg-muted/70"
            >
              <X size={12} /> Cancelar
            </button>
            {isOverridden && (
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:bg-muted ml-auto"
                title={`Restaurar padrão: ${defaultLink}`}
              >
                <RotateCcw size={12} /> Restaurar padrão
              </button>
            )}
          </div>
        </div>
      )}

      {rowIssues.length > 0 && (
        <ul className="mt-1.5 space-y-0.5">
          {rowIssues.map((it, i) => (
            <li key={i} className="text-[11px] text-red-600 dark:text-red-400">
              • {it.field}: {it.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StatPill({
  icon: Icon,
  count,
  label,
  tone,
}: {
  icon: typeof CheckCircle2;
  count: number;
  label: string;
  tone: "ok" | "warn" | "error";
}) {
  const colors = {
    ok: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    warn: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    error: "bg-red-500/10 text-red-600 dark:text-red-400",
  }[tone];
  return (
    <div className={`flex flex-col items-center gap-1 py-2 rounded-lg ${colors}`}>
      <Icon size={16} />
      <span className="text-lg font-black leading-none">{count}</span>
      <span className="text-[10px] font-semibold uppercase tracking-wider">{label}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: "valid" | "placeholder" | "invalid" }) {
  if (status === "valid") {
    return (
      <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
        <CheckCircle2 size={11} /> OK
      </span>
    );
  }
  if (status === "placeholder") {
    return (
      <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400">
        <CircleHelp size={11} /> Pendente
      </span>
    );
  }
  return (
    <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-700 dark:text-red-400">
      <AlertTriangle size={11} /> Inválido
    </span>
  );
}
