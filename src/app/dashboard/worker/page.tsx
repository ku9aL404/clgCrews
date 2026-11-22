"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, CheckCircle2, CircleDollarSign, Clock3, GraduationCap, PackageCheck, Upload } from "lucide-react";

export default function WorkerDashboard() {
  const [available, setAvailable] = useState(true);
  const jobs = [
    ["CC-1048", "Data Structures assignment", "₹480", "Due today", "Review"],
    ["CC-1031", "GFG explanation · Linked Lists", "₹320", "Due tomorrow", "Open"],
  ];
  return (
    <main className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-200 bg-white p-5 md:block">
        <Link href="/" className="flex items-center gap-2 px-2 font-bold"><span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white"><GraduationCap size={20}/></span><span>Campus<span className="text-indigo-600">Crew</span></span></Link>
        <nav className="mt-10 space-y-1">{[["Assigned work", PackageCheck],["Deliverables", Upload],["Earnings", CircleDollarSign],["Activity", Clock3]].map(([label,Icon],i) => <button key={String(label)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${i===0?"bg-indigo-50 text-indigo-700":"text-slate-500"}`}><Icon size={18}/>{String(label)}</button>)}</nav>
      </aside>
      <section className="md:ml-64"><header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 lg:px-8"><div><p className="text-xs text-slate-400">Worker workspace</p><h1 className="text-xl font-bold">Aarav Mehta</h1></div><div className="flex items-center gap-3"><button onClick={() => setAvailable(!available)} className={`rounded-full border px-3 py-2 text-xs font-bold ${available ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-500"}`}><span className={`mr-2 inline-block h-2 w-2 rounded-full ${available?"bg-emerald-500":"bg-slate-400"}`}/>{available?"Available":"Unavailable"}</button><button className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200"><Bell size={18}/></button></div></header>
      <div className="p-5 lg:p-8"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["This month","₹8,640","+18%"],["Pending","₹1,280","2 payouts"],["Orders done","38","This semester"],["Rating","4.9","From 29 reviews"]].map(([label,value,note]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-black">{value}</p><p className="mt-1 text-xs font-bold text-emerald-600">{note}</p></div>)}</div>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white"><div className="flex items-center justify-between border-b border-slate-100 p-5"><h2 className="font-bold">Assigned work</h2><span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">2 active</span></div>{jobs.map(job => <div key={job[0]} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center"><div className="grid h-11 w-11 place-items-center rounded-xl bg-violet-50 text-violet-700"><PackageCheck size={20}/></div><div className="flex-1"><p className="font-bold">{job[1]}</p><p className="mt-1 text-xs text-slate-400">{job[0]} · 80% commission share · {job[3]}</p></div><p className="font-bold">{job[2]}</p><button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold hover:border-indigo-300">{job[4]}</button></div>)}</div>
      </div></section>
    </main>
  );
}
