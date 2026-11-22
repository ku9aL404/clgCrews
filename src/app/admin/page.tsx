"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  BarChart3, Boxes, CircleDollarSign, ClipboardCheck, GraduationCap, LayoutDashboard,
  LogOut, Search, Settings, ShieldCheck, TicketCheck, Users, WalletCards
} from "lucide-react";

type OrderRow = {
  id: string; status: string; amount: number; created_at: string;
  customer?: { full_name: string } | null;
};

const nav = [
  ["Overview", LayoutDashboard], ["Orders", ClipboardCheck], ["Workers", Users],
  ["Customers", GraduationCap], ["Services", Boxes], ["Finance", WalletCards],
  ["Support", TicketCheck], ["Audit logs", BarChart3], ["Settings", Settings]
];

export default function AdminPage() {
  const [active, setActive] = useState("Overview");
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [workerCount, setWorkerCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function load() {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        setLoading(false);
        return;
      }
      const supabase = createClient();
      const [ordersResult, workersResult, customersResult] = await Promise.all([
        supabase.from("orders").select("id,status,amount,created_at,customer:profiles(full_name)").order("created_at", { ascending: false }).limit(100),
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "worker"),
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "customer"),
      ]);
      setOrders((ordersResult.data as unknown as OrderRow[]) ?? []);
      setWorkerCount(workersResult.count ?? 0);
      setCustomerCount(customersResult.count ?? 0);
      setLoading(false);
    }
    load();
  }, []);

  const stats = useMemo(() => {
    const paid = orders.filter((order) => !["cancelled", "pending_payment"].includes(order.status));
    const revenue = paid.reduce((sum, order) => sum + (order.amount || 0), 0);
    return {
      revenue,
      total: orders.length,
      pending: orders.filter((order) => ["pending_payment", "payment_review"].includes(order.status)).length,
      active: orders.filter((order) => ["confirmed", "assigned", "in_progress", "quality_check"].includes(order.status)).length,
      completed: orders.filter((order) => order.status === "completed").length,
    };
  }, [orders]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  const filteredOrders = orders.filter((order) => `${order.id} ${order.status} ${order.customer?.full_name ?? ""}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <main className="min-h-screen bg-[#f5f6fa] text-slate-950">
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 flex-col border-r border-slate-200 bg-white md:flex">
        <div className="flex h-20 items-center gap-2 border-b border-slate-100 px-6"><span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white"><GraduationCap size={20}/></span><div><b>CampusCrew</b><p className="text-[11px] font-bold text-indigo-600">SUPER ADMIN</p></div></div>
        <nav className="flex-1 space-y-1 p-4">{nav.map(([label, Icon]) => <button key={String(label)} onClick={() => setActive(String(label))} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${active === label ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50"}`}><Icon size={18}/>{String(label)}</button>)}</nav>
        <button onClick={logout} className="m-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600"><LogOut size={18}/>Log out</button>
      </aside>

      <section className="md:ml-64">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur lg:px-8">
          <div><p className="text-xs font-bold text-slate-400">ADMINISTRATION</p><h1 className="text-xl font-black">{active}</h1></div>
          <div className="flex items-center gap-3"><div className="relative hidden sm:block"><Search className="absolute left-3 top-2.5 text-slate-400" size={17}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search orders" className="h-10 w-64 rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-indigo-400"/></div><span className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-400"/></div>
        </header>

        <div className="p-5 lg:p-8">
          {active === "Overview" && <>
            {loading ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[1,2,3,4].map((n) => <div key={n} className="h-32 animate-pulse rounded-2xl bg-slate-200"/> )}</div> : <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[{label:"Total revenue",value:`₹${stats.revenue.toLocaleString("en-IN")}`,icon:CircleDollarSign},{label:"Total orders",value:stats.total,icon:ClipboardCheck},{label:"Customers",value:customerCount,icon:GraduationCap},{label:"Workers",value:workerCount,icon:Users}].map((card) => <article key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between"><span className="text-sm font-semibold text-slate-500">{card.label}</span><span className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-50 text-indigo-600"><card.icon size={18}/></span></div><p className="mt-5 text-3xl font-black">{card.value}</p></article>)}
              </div>
              <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_340px]">
                <div className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between"><h2 className="font-bold">Recent orders</h2><button onClick={() => setActive("Orders")} className="text-sm font-bold text-indigo-600">View all</button></div><div className="mt-4 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-slate-100 text-xs uppercase text-slate-400"><th className="pb-3">Order</th><th className="pb-3">Customer</th><th className="pb-3">Status</th><th className="pb-3 text-right">Amount</th></tr></thead><tbody>{filteredOrders.slice(0,8).map((order) => <tr key={order.id} className="border-b border-slate-50 last:border-0"><td className="py-3 font-bold">#{order.id.slice(0,8)}</td><td className="py-3 text-slate-500">{order.customer?.full_name ?? "—"}</td><td className="py-3"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold">{order.status.replaceAll("_"," ")}</span></td><td className="py-3 text-right font-bold">₹{order.amount}</td></tr>)}</tbody></table>{!filteredOrders.length && <div className="py-16 text-center text-sm text-slate-400">No orders found</div>}</div></div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="font-bold">Order health</h2><div className="mt-5 space-y-4">{[["Pending",stats.pending,"bg-amber-400"],["Active",stats.active,"bg-indigo-500"],["Completed",stats.completed,"bg-emerald-500"]].map(([label,value,color]) => <div key={String(label)}><div className="mb-2 flex justify-between text-sm"><span className="text-slate-500">{label}</span><b>{String(value)}</b></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full ${color}`} style={{width:`${stats.total ? Math.max(8,(Number(value)/stats.total)*100) : 0}%`}}/></div></div>)}</div></div>
              </div>
            </>}
          </>}

          {active !== "Overview" && <div className="rounded-2xl border border-slate-200 bg-white p-8"><div className="flex max-w-lg items-start gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600"><ShieldCheck size={23}/></span><div><h2 className="text-xl font-black">{active}</h2><p className="mt-2 text-sm leading-6 text-slate-500">Use the dedicated service routes to manage this area. Operational records are connected to the shared Supabase database and protected by server-side administrator authentication.</p></div></div></div>}
        </div>
      </section>
    </main>
  );
}
