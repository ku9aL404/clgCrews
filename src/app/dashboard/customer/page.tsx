"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, CheckCircle2, Clock3, FileUp, GraduationCap, Package, Search, UploadCloud } from "lucide-react";

const orders = [
	{ id: "CC-1048", title: "Data Structures assignment", worker: "Aarav Mehta", status: "In progress", date: "Today, 10:30 AM", tone: "text-violet-700 bg-violet-50" },
	{ id: "CC-1039", title: "Startup pitch deck", worker: "Sneha Rao", status: "Delivered", date: "Yesterday", tone: "text-emerald-700 bg-emerald-50" },
	{ id: "CC-1026", title: "Python practical formatting", worker: "Kabir Shah", status: "Payment review", date: "18 Nov", tone: "text-amber-700 bg-amber-50" },
];

export default function CustomerDashboard() {
	const [active, setActive] = useState("Overview");
	return (
		<main className="min-h-screen bg-[#f7f8fb] text-slate-950">
			<aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-200 bg-white p-5 md:flex md:flex-col">
				<Link href="/" className="flex items-center gap-2 px-2 font-bold">
					<span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white">
						<GraduationCap size={20} />
					</span>
					<span>
						Campus<span className="text-indigo-600">Crew</span>
					</span>
				</Link>
				<nav className="mt-10 space-y-1">
					{[["Overview", Package], ["Place order", UploadCloud], ["My orders", Clock3], ["Messages", Bell]].map(([label, Icon]) => (
						<button
							key={String(label)}
							onClick={() => setActive(String(label))}
							className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${
								active === label ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50"
							}`}
						>
							<Icon size={18} />
							{String(label)}
						</button>
					))}
				</nav>
				<div className="mt-auto rounded-2xl bg-slate-950 p-4 text-white">
					<p className="text-xs text-slate-400">Campus balance</p>
					<p className="mt-1 text-2xl font-bold">₹1,240</p>
					<button className="mt-4 w-full rounded-lg bg-white/10 py-2 text-xs font-bold">Add money</button>
				</div>
			</aside>
			<section className="md:ml-64">
				<header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 lg:px-8">
					<div>
						<p className="text-xs text-slate-400">Customer dashboard</p>
						<h1 className="text-xl font-bold">Good morning, Ananya</h1>
					</div>
					<div className="flex items-center gap-3">
						<button className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200">
							<Bell size={18} />
						</button>
						<div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-400" />
					</div>
				</header>
				<div className="p-5 lg:p-8">
					<div className="grid gap-4 sm:grid-cols-3">
						<div className="rounded-2xl border border-slate-200 bg-white p-5">
							<p className="text-sm text-slate-500">Active orders</p>
							<p className="mt-2 text-3xl font-black">3</p>
						</div>
						<div className="rounded-2xl border border-slate-200 bg-white p-5">
							<p className="text-sm text-slate-500">Completed</p>
							<p className="mt-2 text-3xl font-black">12</p>
						</div>
						<div className="rounded-2xl border border-slate-200 bg-white p-5">
							<p className="text-sm text-slate-500">Total spend</p>
							<p className="mt-2 text-3xl font-black">₹4,820</p>
						</div>
					</div>
					<div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
						<div className="rounded-2xl border border-slate-200 bg-white">
							<div className="flex items-center justify-between border-b border-slate-100 p-5">
								<h2 className="font-bold">Recent orders</h2>
								<button className="text-sm font-bold text-indigo-600">View all</button>
							</div>
							<div className="divide-y divide-slate-100">
								{orders.map((order) => (
									<div key={order.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
										<div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100">
											<Package size={20} />
										</div>
										<div className="min-w-0 flex-1">
											<p className="font-bold">{order.title}</p>
											<p className="mt-1 text-xs text-slate-400">
												{order.id} · {order.worker} · {order.date}
											</p>
										</div>
										<span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${order.tone}`}>{order.status}</span>
									</div>
								))}
							</div>
						</div>
						<div className="rounded-2xl bg-indigo-600 p-6 text-white">
							<div className="grid h-11 w-11 place-items-center rounded-xl bg-white/15">
								<FileUp size={21} />
							</div>
							<h2 className="mt-8 text-xl font-bold">Need help now?</h2>
							<p className="mt-2 text-sm leading-6 text-indigo-100">
								Upload your requirements and get matched with the right crew member.
							</p>
							<button className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-bold text-indigo-700">
								<UploadCloud size={17} />
								Place a new order
							</button>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
