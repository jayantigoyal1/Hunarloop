"use client";

import { useState, type ReactNode } from "react";
import { Pencil, Plus, X } from "lucide-react";
import { Button } from "@/components/ui";
import { useT } from "@/lib/i18n";
import { uniqueItems } from "@/lib/passport";

const inputClass = "min-h-12 w-full min-w-0 rounded-xl border border-teal-100 bg-white px-3 text-base text-ink focus:outline-teal-700";
const iconClass = "grid min-h-12 min-w-12 shrink-0 place-items-center rounded-xl text-teal-700 hover:bg-teal-100";

export function InlineField({ label, value, onSave }: { label: string; value: string; onSave: (value: string) => void }) {
  const t = useT();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  return <div className="min-w-0">
    <p className="text-xs font-bold text-teal-700">{label}</p>
    {editing ? <form className="mt-2 space-y-2" onSubmit={(event) => { event.preventDefault(); onSave(draft.trim()); setEditing(false); }}>
      <input className={inputClass} aria-label={label} value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={120} autoFocus />
      <div className="flex flex-wrap gap-2"><Button type="submit">{t("passport.save")}</Button><Button type="button" variant="quiet" onClick={() => setEditing(false)}>{t("passport.cancel")}</Button></div>
    </form> : <div className="flex items-center justify-between gap-2"><span className="break-words text-base font-semibold [overflow-wrap:anywhere]">{value || "—"}</span><button type="button" className={iconClass} onClick={() => { setDraft(value); setEditing(true); }} aria-label={`${t("passport.edit")}: ${label}`}><Pencil size={17} aria-hidden="true" /></button></div>}
  </div>;
}

export function EditableList({ label, items, onChange, tag, displayItem = (item) => item }: { label: string; items: string[]; onChange: (items: string[]) => void; tag?: (item: string) => ReactNode; displayItem?: (item: string) => string }) {
  const t = useT();
  const [editor, setEditor] = useState<{ index: number | null; value: string } | null>(null);
  return <div className="space-y-3">
    {items.length === 0 ? <p className="text-sm leading-6 text-ink/75">{t("passport.empty")}</p> : <ul className="space-y-2">
      {items.map((item, index) => <li key={`${index}-${item}`} className="flex items-center gap-1 rounded-xl bg-teal-50 p-2">
        <div className="min-w-0 flex-1 space-y-1"><span className="block break-words text-sm font-semibold [overflow-wrap:anywhere]">{displayItem(item)}</span>{tag?.(item)}</div>
        <button type="button" className={iconClass} aria-label={`${t("passport.edit")}: ${item}`} onClick={() => setEditor({ index, value: item })}><Pencil size={17} aria-hidden="true" /></button>
        <button type="button" className={iconClass} aria-label={`${t("passport.remove")}: ${item}`} onClick={() => { onChange(items.filter((_, i) => i !== index)); setEditor(null); }}><X size={18} aria-hidden="true" /></button>
      </li>)}
    </ul>}
    {editor ? <form className="space-y-2" onSubmit={(event) => {
      event.preventDefault();
      const value = editor.value.trim();
      if (!value) return;
      onChange(uniqueItems(editor.index === null ? [...items, value] : items.map((item, index) => index === editor.index ? value : item)));
      setEditor(null);
    }}>
      <input className={inputClass} value={editor.value} onChange={(event) => setEditor({ ...editor, value: event.target.value })} aria-label={`${label}: ${t("passport.newItem")}`} maxLength={120} required autoFocus />
      <div className="flex flex-wrap gap-2"><Button type="submit" disabled={!editor.value.trim()}>{t("passport.save")}</Button><Button type="button" variant="quiet" onClick={() => setEditor(null)}>{t("passport.cancel")}</Button></div>
    </form> : <Button type="button" variant="secondary" onClick={() => setEditor({ index: null, value: "" })} aria-label={`${t("passport.add")}: ${label}`}><Plus size={18} aria-hidden="true" />{t("passport.add")}</Button>}
  </div>;
}
