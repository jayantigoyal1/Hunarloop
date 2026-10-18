"use client";

import { useState, type FormEvent } from "react";
import { BookOpen } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { useT } from "@/lib/i18n";
import { useAppStore, type TeacherModule } from "@/lib/store";

const inputClass = "min-h-12 w-full rounded-xl border border-teal-700 bg-white px-3 text-ink";

export function TeacherModuleCreator() {
  const t = useT();
  const modules = useAppStore((state) => state.teacherModules);
  const create = useAppStore((state) => state.createTeacherModule);
  const [title, setTitle] = useState("");
  const [format, setFormat] = useState<TeacherModule["format"]>("audio");
  const [paid, setPaid] = useState(false);
  const [price, setPrice] = useState("");
  const [error, setError] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const amount = paid ? Number(price) : 0;
    if (!title.trim() || title.trim().length > 80 || (paid && (!price.trim() || !Number.isInteger(amount) || amount < 1 || amount > 10000))) { setError(true); return; }
    create({ title, format, price: amount });
    setTitle(""); setPrice(""); setPaid(false); setError(false);
  };
  return <Card className="space-y-4"><div className="flex items-center gap-2"><BookOpen className="text-teal-700" aria-hidden="true" /><h2 className="text-xl font-extrabold">{t("teacher.module")}</h2></div><p className="text-sm leading-6">{t("teacher.moduleIntro")}</p><form onSubmit={submit} className="space-y-3"><label className="block space-y-1"><span className="font-bold">{t("teacher.moduleTitle")}</span><input value={title} maxLength={80} onChange={(event) => setTitle(event.target.value)} className={inputClass} /></label><label className="block space-y-1"><span className="font-bold">{t("teacher.moduleFormat")}</span><select value={format} onChange={(event) => setFormat(event.target.value as TeacherModule["format"])} className={inputClass}><option value="audio">{t("teacher.audio")}</option><option value="visual">{t("teacher.visual")}</option><option value="hands-on">{t("teacher.handsOn")}</option></select></label><div className="grid grid-cols-2 gap-2"><Button type="button" variant={paid ? "secondary" : "primary"} aria-pressed={!paid} onClick={() => setPaid(false)}>{t("teacher.moduleFree")}</Button><Button type="button" variant={paid ? "primary" : "secondary"} aria-pressed={paid} onClick={() => setPaid(true)}>{t("teacher.modulePaid")}</Button></div>{paid ? <label className="block space-y-1"><span className="font-bold">{t("teacher.modulePrice")}</span><input type="number" min={1} max={10000} step={1} value={price} onChange={(event) => setPrice(event.target.value)} className={inputClass} /></label> : null}{error ? <p role="alert" className="text-sm font-semibold text-red-800">{t("teacher.validation")}</p> : null}<Button type="submit" className="w-full">{t("teacher.create")}</Button></form><div className="space-y-2 border-t border-teal-100 pt-3"><h3 className="font-bold">{t("teacher.created")}</h3>{modules.length ? <ul className="space-y-2">{[...modules].reverse().map((module) => <li key={module.id} className="rounded-xl bg-paper p-3"><p className="font-bold">{module.title}</p><p className="text-sm">{t("teacher." + (module.format === "hands-on" ? "handsOn" : module.format))} · {module.price === 0 ? t("teacher.free") : t("teacher.price") + ": ₹" + module.price.toLocaleString("en-IN")}</p></li>)}</ul> : <p className="text-sm">{t("teacher.emptyModules")}</p>}</div></Card>;
}
