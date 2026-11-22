import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-5">
      <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50">
        <Link href="/" className="flex items-center gap-2 font-bold"><span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white"><GraduationCap size={20}/></span><span>CampusCrew</span></Link>
        <h1 className="mt-8 text-3xl font-black">Student login</h1>
        <p className="mt-2 text-sm text-slate-500">Enter your details to view and book services.</p>
        <form className="mt-7 space-y-4"><label className="block text-sm font-bold">Email<input type="email" placeholder="name@college.edu" className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 font-normal outline-none focus:border-indigo-500"/></label><label className="block text-sm font-bold">Password<input type="password" placeholder="••••••••" className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 font-normal outline-none focus:border-indigo-500"/></label><Link href="/" className="flex h-12 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">Login</Link></form>
        <p className="mt-5 text-center text-sm text-slate-500">Need an account? <Link href="/auth/signup" className="font-bold text-indigo-600">Sign up</Link></p>
      </div>
    </main>
  );
}
