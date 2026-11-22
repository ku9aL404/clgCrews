"use client";

import { useState } from "react";
import { GraduationCap, LockKeyhole } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
    setLoading(true);
    setError("");
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    setLoading(false);
    if (!response.ok) {
      setError((await response.json()).error || "Login failed");
      return;
    }
    window.location.href = "/dashboard/admin";
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-5">
      <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-7 shadow-xl">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-950 text-white"><LockKeyhole size={20}/></div>
        <h1 className="mt-6 text-3xl font-black">Admin access</h1>
        <p className="mt-2 text-sm text-slate-500">This area is restricted to authorised administrators.</p>
        <div className="mt-6"><label className="text-sm font-bold">Admin password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} onKeyDown={(event) => event.key === "Enter" && login()} className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-indigo-500"/></label></div>
        {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p>}
        <button onClick={login} disabled={loading} className="mt-5 h-12 w-full rounded-xl bg-slate-950 text-sm font-bold text-white disabled:opacity-60">{loading ? "Checking..." : "Secure login"}</button>
      </div>
    </main>
  );
}
