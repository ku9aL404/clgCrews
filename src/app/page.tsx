"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Check, Code2, FileText, GraduationCap, Presentation, Printer, Star, Video } from "lucide-react";

const defaultServices = [
	{ name: "Coding Help", title: "Coding Help", description: "Fix code or understand a concept", price: 299, image: "", samples: [], icon: Code2, tiers: { quick: 299, decent: 499, topper: 799 } },
	{ name: "Assignment Guidance", title: "Assignment Guidance", description: "Structure and improve your assignment", price: 249, image: "", samples: [], icon: FileText, tiers: { quick: 249, decent: 399, topper: 649 } },
	{ name: "PPT Design", title: "PPT Design", description: "A clean presentation for your project", price: 199, image: "", samples: [], icon: Presentation, tiers: { quick: 199, decent: 349, topper: 599 } },
	{ name: "Resume Creation", title: "Resume Creation", description: "A simple, professional student resume", price: 349, image: "", samples: [], icon: GraduationCap, tiers: { quick: 349, decent: 549, topper: 899 } },
	{ name: "Video Editing", title: "Video Editing", description: "Edit your project or presentation video", price: 399, image: "", samples: [], icon: Video, tiers: { quick: 399, decent: 649, topper: 999 } },
	{ name: "Printing", title: "Printing", description: "Print and format campus documents", price: 49, image: "", samples: [], icon: Printer, tiers: { quick: 49, decent: 99, topper: 149 } },
];

export default function Home() {
	const [services, setServices] = useState(defaultServices);
	const [selected, setSelected] = useState<(typeof defaultServices)[0] | null>(null);
	const [slot, setSlot] = useState("Today, 4:00 PM");
	const [rating, setRating] = useState(5);
	const [review, setReview] = useState("");
	const [showReview, setShowReview] = useState(false);
	const [tier, setTier] = useState<"quick" | "decent" | "topper">("quick");
	const [purchased, setPurchased] = useState(false);

	useEffect(() => {
		const saved = localStorage.getItem("campuscrew-services");
		if (saved) {
			const adminServices = JSON.parse(saved)
				.filter((service: { active: boolean }) => service.active)
				.map((service: { name: string; price: number; image: string; samples?: string[]; tiers?: { quick: number; decent: number; topper: number } }) => ({
					name: service.name,
					title: service.name,
					description: "Available student service",
					price: service.price,
					image: service.image,
					samples: service.samples ?? [],
					tiers: service.tiers ?? { quick: service.price, decent: Math.round(service.price * 1.5), topper: Math.round(service.price * 2) },
					icon: GraduationCap,
				}));
			setServices(adminServices);
		}
	}, []);

	return (
		<main className="min-h-screen bg-[#f8fafc] text-slate-950">
			<nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
				<Link href="/" className="flex items-center gap-2 font-bold">
					<span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white">
						<GraduationCap size={20} />
					</span>
					<span className="text-xl">CampusCrew</span>
				</Link>
				<div className="flex items-center gap-2">
					{purchased && <button onClick={() => setShowReview(true)} className="rounded-lg px-3 py-2 text-sm font-semibold">Write review</button>}
					<Link href="/auth/login" className="px-3 py-2 text-sm font-semibold">
						Login
					</Link>
					<Link href="/dashboard/admin" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold">
						Admin
					</Link>
				</div>
			</nav>

			<section className="mx-auto max-w-6xl px-5 pb-10 pt-10 text-center sm:pt-16">
				<p className="text-sm font-bold text-indigo-600">Simple help for every student</p>
				<h1 className="mx-auto mt-3 max-w-2xl text-4xl font-black tracking-tight sm:text-6xl">
					Choose a service. Pick a time. Done.
				</h1>
				<p className="mx-auto mt-4 max-w-xl text-slate-500">
					Get practical student support for assignments, coding, presentations and more.
				</p>
			</section>

			<section className="mx-auto max-w-6xl px-5 pb-16">
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{services.map((service) => {
						const Icon = service.icon;
						return (
							<article key={service.title} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
								{service.image ? <img src={service.image} alt={service.title} className="h-36 w-full object-cover"/> : <div className="h-36 bg-gradient-to-br from-indigo-50 to-violet-100 grid place-items-center"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-indigo-600 shadow-sm"><Icon size={26}/></span></div>}
								<div className="p-5">
									<div className="flex items-start justify-between"><h2 className="font-bold">{service.title}</h2><span className="text-lg font-black">From ₹{service.tiers?.quick ?? service.price}</span></div>
									<p className="mt-1 min-h-10 text-sm text-slate-500">{service.description}</p>
									<div className="mt-4 grid grid-cols-3 gap-2">
										<div className="rounded-lg bg-slate-50 p-2"><span className="block text-[10px] uppercase text-slate-400">Quick</span><b className="text-sm">₹{service.tiers.quick}</b></div>
										<div className="rounded-lg bg-sky-50 p-2"><span className="block text-[10px] uppercase text-sky-500">Decent</span><b className="text-sm">₹{service.tiers.decent}</b></div>
										<div className="rounded-lg bg-violet-50 p-2"><span className="block text-[10px] uppercase text-violet-500">Topper</span><b className="text-sm">₹{service.tiers.topper}</b></div>
									</div>
									<div className="mt-4 grid grid-cols-3 gap-2">
										{service.samples.length > 0 ? service.samples.map((sample, index) => (
											<img key={index} src={sample} alt={`Sample work for ${service.title}`} className="rounded-lg border border-slate-200" />
										)) : <p className="col-span-3 text-center text-sm text-slate-400">No samples available</p>}
									</div>
									<button onClick={() => setSelected(service)} className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 text-sm font-bold text-white">Select <ArrowRight size={16}/></button>
								</div>
							</article>
						);
					})}
				</div>
			</section>

			{selected && (
				<div
					className="fixed inset-0 z-50 grid place-items-end bg-slate-950/40 p-0 sm:place-items-center sm:p-5"
					onClick={() => setSelected(null)}
				>
					<div
						className="w-full max-w-md rounded-t-3xl bg-white p-6 sm:rounded-3xl"
						onClick={(event) => event.stopPropagation()}
					>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs font-bold text-indigo-600">Selected service</p>
								<h2 className="mt-1 text-xl font-black">{selected.title}</h2>
							</div>
							<button
								onClick={() => setSelected(null)}
								className="grid h-9 w-9 place-items-center rounded-full bg-slate-100"
							>
								×
							</button>
						</div>
						<p className="mt-6 text-sm font-bold">Choose a time slot</p>
						<div className="mt-3 grid grid-cols-2 gap-2">
							{["Today, 4:00 PM", "Tomorrow, 10:00 AM", "Tomorrow, 4:00 PM", "Friday, 11:00 AM"].map((time) => (
								<button
									key={time}
									onClick={() => setSlot(time)}
									className={`rounded-xl border px-3 py-3 text-sm ${
										slot === time ? "border-indigo-600 bg-indigo-50 font-bold text-indigo-700" : "border-slate-200"
									}`}
								>
									{time}
								</button>
							))}
						</div>
						<div className="mt-4">
							<p className="text-sm font-bold">Select a tier</p>
							<div className="mt-2 flex gap-2">
								{Object.entries(selected.tiers).map(([key, value]) => (
									<button
										key={key}
										onClick={() => setTier(key as "quick" | "decent" | "topper")}
										className={`flex-1 rounded-xl border px-3 py-2 text-sm font-bold transition-all ${
											tier === (key as "quick" | "decent" | "topper")
												? "border-indigo-600 bg-indigo-50 text-indigo-700"
												: "border-slate-200 text-slate-950"
										}`}
									>
										{key} (₹{value})
									</button>
								))}
							</div>
						</div>
						<div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
							<div>
								<p className="text-xs text-slate-400">Amount to pay</p>
								<p className="text-2xl font-black">₹{selected.tiers[tier]}</p>
							</div>
							<button
								onClick={() => {
									setPurchased(true);
									setSelected(null);
									setShowReview(true);
								}}
								className="flex h-12 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white"
							>
								<Check size={17} />
								Pay now
							</button>
						</div>
					</div>
				</div>
			)}

			{showReview && (
				<div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-5">
					<div className="w-full max-w-md rounded-3xl bg-white p-6">
						<div className="flex items-center justify-between">
							<h2 className="text-xl font-black">Service Review</h2>
							<button
								onClick={() => setShowReview(false)}
								className="grid h-9 w-9 place-items-center rounded-full bg-slate-100"
							>
								×
							</button>
						</div>
						<p className="mt-4 text-sm text-slate-500">
							We value your feedback! Please rate the service and leave a review.
						</p>
						<div className="mt-4 flex gap-2">
							{[5, 4, 3, 2, 1].map((num) => (
								<button
									key={num}
									onClick={() => setRating(num)}
									className={`flex h-10 w-10 items-center justify-center rounded-full text-white ${
										rating === num ? "bg-indigo-600" : "bg-slate-300"
									}`}
								>
									<Star size={16} />
								</button>
							))}
						</div>
						<textarea
							value={review}
							onChange={(e) => setReview(e.target.value)}
							className="mt-4 w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
							placeholder="Write your review here..."
							rows={3}
						/>
						<div className="mt-4 flex justify-end gap-2">
							<button
								onClick={() => {
									// Submit review logic here
									alert("Review submitted! Thank you.");
									setRating(5);
									setReview("");
									setShowReview(false);
								}}
								className="flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-bold text-white"
							>
								<Check size={16} />
								Submit Review
							</button>
							<button
								onClick={() => setShowReview(false)}
								className="flex h-10 items-center gap-2 rounded-xl bg-slate-200 px-4 text-sm font-semibold text-slate-950"
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</main>
	);
}
