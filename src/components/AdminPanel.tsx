import { useEffect, useState } from "react";
import {
  CATEGORIES,
  SITE_LINKS,
  validateConfig,
  validateLink,
  type CategoryIssue,
} from "@/config/categories";
import {
  ShieldCheck,
  AlertTriangle,
  CircleHelp,
  CheckCircle2,
  X,
  Copy,
  ExternalLink,
  Settings2,
} from "lucide-react";

/**
 * Painel de administração visível apenas em modo de edição.
 *
 * Como ativar:
 *  - Adicione `?admin=1` na URL  →  ativa e fica salvo (localStorage)
 *  - Adicione `?admin=0`         →  desativa
 *
 * Mostra todos os links (categorias + globais), valida cada um e
 * permite testar abrindo em nova aba.
 */
export function AdminPanel() {
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(true);

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

  if (!enabled) return null;

  const issues = validateConfig();
  const issuesById = issues.reduce<Record<string, CategoryIssue[]>>((acc, i) => {
    (acc[i.id] ||= []).push(i);
    return acc;
  }, {});

  const rows = [
    ...Object.entries(SITE_LINKS).map(([key, link]) => ({
      id: `SITE_LINKS.${key}`,
      name: key === "mainVideo" ? "Botão: Ver produto do vídeo" : "Botão: Ver todos os achadinhos",
      link,
      isGlobal: true,
    })),
    ...CATEGORIES.map((c) => ({
      id: c.id,
      name: c.name,
      link: c.link,
      isGlobal: false,
    })),
  ];

  const valid = rows.filter((r) => validateLink(r.link).status === "valid").length;
  const placeholder = rows.filter((r) => validateLink(r.link).status === "placeholder").length;
  const invalid = rows.filter((r) => validateLink(r.link).status === "invalid").length;

  return (
    <>
      {/* Floating trigger */}
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
        <div className="fixed inset-x-0 bottom-0 md:inset-auto md:bottom-6 md:right-6 md:w-[460px] z-[60] max-h-[85vh] flex flex-col bg-background border border-border rounded-t-2xl md:rounded-2xl shadow-2xl">
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
                  Visível apenas com ?admin=1
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
            <StatPill
              icon={CheckCircle2}
              count={valid}
              label="Válidos"
              tone="ok"
            />
            <StatPill
              icon={CircleHelp}
              count={placeholder}
              label="Pendentes"
              tone="warn"
            />
            <StatPill
              icon={AlertTriangle}
              count={invalid}
              label="Inválidos"
              tone="error"
            />
          </div>

          {/* Issues banner */}
          {issues.length > 0 && (
            <div className="px-4 py-2 bg-red-500/10 border-b border-red-500/20 text-[11px] text-red-600 dark:text-red-400 font-medium">
              {issues.length} problema(s) de validação detectado(s) — revise abaixo.
            </div>
          )}

          {/* List */}
          <div className="overflow-y-auto flex-1 divide-y divide-border">
            {rows.map((r) => {
              const v = validateLink(r.link);
              const rowIssues = issuesById[r.id] ?? [];
              return (
                <div key={r.id} className="p-4 text-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground truncate">{r.name}</span>
                        {r.isGlobal && (
                          <span className="text-[9px] uppercase tracking-wider bg-muted px-1.5 py-0.5 rounded">
                            global
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                        {r.id}
                      </p>
                    </div>
                    <StatusBadge status={v.status} />
                  </div>

                  <div className="mt-2 flex items-center gap-1.5">
                    <code className="flex-1 min-w-0 truncate text-[11px] bg-muted/60 px-2 py-1.5 rounded font-mono text-muted-foreground">
                      {r.link}
                    </code>
                    <button
                      onClick={() => navigator.clipboard?.writeText(r.link)}
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

                  {rowIssues.length > 0 && (
                    <ul className="mt-1.5 space-y-0.5">
                      {rowIssues.map((it, i) => (
                        <li
                          key={i}
                          className="text-[11px] text-red-600 dark:text-red-400"
                        >
                          • {it.field}: {it.message}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-3 border-t border-border text-[10px] text-muted-foreground text-center">
            Para desativar adicione <code>?admin=0</code> na URL.
          </div>
        </div>
      )}
    </>
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
