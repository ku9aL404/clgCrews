"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GraduationCap, ImagePlus, Pencil, Plus, Trash2 } from "lucide-react";

const initialServices = [
	{
		name: "Coding Help",
		price: 299,
		active: true,
		image: "",
		samples: [],
		tiers: { quick: 299, decent: 499, topper: 799 },
	},
	{
		name: "Assignment Guidance",
		price: 249,
		active: true,
		image: "",
		samples: [],
		tiers: { quick: 249, decent: 399, topper: 649 },
	},
	{
		name: "PPT Design",
		price: 199,
		active: true,
		image: "",
		samples: [],
		tiers: { quick: 199, decent: 349, topper: 599 },
	},
	{
		name: "Resume Creation",
		price: 349,
		active: false,
		image: "",
		samples: [],
		tiers: { quick: 349, decent: 549, topper: 899 },
	},
];

export default function AdminDashboard() {
	const [services, setServices] = useState(initialServices);
	const [showForm, setShowForm] = useState(false);
	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [image, setImage] = useState("");
	const [samples, setSamples] = useState<string[]>([]);
	const [quickPrice, setQuickPrice] = useState("");
	const [decentPrice, setDecentPrice] = useState("");
	const [topperPrice, setTopperPrice] = useState("");
	const [hydrated, setHydrated] = useState(false);

	useEffect(() => {
		const saved = localStorage.getItem("campuscrew-services");
		if (saved) setServices(JSON.parse(saved));
		setHydrated(true);
	}, []);

	useEffect(() => {
		if (hydrated)
			localStorage.setItem("campuscrew-services", JSON.stringify(services));
	}, [services, hydrated]);

	function addService() {
		if (!name.trim() || !price) return;
		const basePrice = Number(price);
		setServices([
			...services,
			{
				name: name.trim(),
				price: basePrice,
				active: true,
				image,
				samples,
				tiers: {
					quick: Number(quickPrice) || basePrice,
					decent: Number(decentPrice) || Math.round(basePrice * 1.5),
					topper: Number(topperPrice) || Math.round(basePrice * 2),
				},
			},
		]);
		setName("");
		setPrice("");
		setQuickPrice("");
		setDecentPrice("");
		setTopperPrice("");
		setImage("");
		setSamples([]);
		setShowForm(false);
	}

	function handleImage(file?: File) {
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => setImage(String(reader.result));
		reader.readAsDataURL(file);
	}

	function handleSamples(files: FileList | null) {
		if (!files) return;
		Array.from(files).slice(0, 6).forEach((file) => {
			const reader = new FileReader();
			reader.onload = () => setSamples((current) => [...current, String(reader.result)]);
			reader.readAsDataURL(file);
		});
	}

	return (
		<main className="min-h-screen bg-slate-50 text-slate-950">
			<nav className="border-b border-slate-200 bg-white px-5 py-4">
				<div className="mx-auto flex max-w-5xl items-center justify-between">
					<Link
						href="/"
						className="flex items-center gap-2 font-bold"
					>
						<span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white">
							<GraduationCap size={20} />
						</span>
						<span>CampusCrew</span>
					</Link>
					<Link
						href="/"
						className="text-sm font-semibold text-slate-500"
					>
						View website
					</Link>
				</div>
			</nav>
			<section className="mx-auto max-w-5xl px-5 py-8">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm text-slate-500">Admin panel</p>
						<h1 className="mt-1 text-3xl font-black">
							Manage services
						</h1>
					</div>
					<button
						onClick={() => setShowForm(true)}
						className="flex h-11 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-bold text-white"
					>
						<Plus size={17} />
						Add service
					</button>
				</div>

				{showForm && (
					<div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
						<h2 className="font-bold">New service</h2>
						<div className="mt-4 grid gap-3 sm:grid-cols-[1fr_160px_auto]">
							<input
								value={name}
								onChange={(event) =>
									setName(event.target.value)
								}
								placeholder="Service name"
								className="h-11 rounded-xl border border-slate-200 bg-white px-4 outline-none"
							/>
							<input
								value={price}
								onChange={(event) =>
									setPrice(event.target.value)
								}
								type="number"
								placeholder="Price in ₹"
								className="h-11 rounded-xl border border-slate-200 bg-white px-4 outline-none"
							/>
							<label className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold">
								<ImagePlus size={17} />
								{image ? "Image added" : "Add image"}
								<input
									type="file"
									accept="image/*"
									onChange={(event) =>
										handleImage(event.target.files?.[0])
									}
									className="hidden"
								/>
							</label>
							<div className="grid grid-cols-3 gap-3">
								<input
									value={quickPrice}
									onChange={(event) =>
										setQuickPrice(event.target.value)
									}
									type="number"
									placeholder="Quick tier price"
									className="h-11 rounded-xl border border-slate-200 bg-white px-4 outline-none"
								/>
								<input
									value={decentPrice}
									onChange={(event) =>
										setDecentPrice(event.target.value)
									}
									type="number"
									placeholder="Decent tier price"
									className="h-11 rounded-xl border border-slate-200 bg-white px-4 outline-none"
								/>
								<input
									value={topperPrice}
									onChange={(event) =>
										setTopperPrice(event.target.value)
									}
									type="number"
									placeholder="Topper tier price"
									className="h-11 rounded-xl border border-slate-200 bg-white px-4 outline-none"
								/>
							</div>
							<div className="flex flex-col gap-4">
								<button
									onClick={addService}
									className="h-11 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white sm:col-start-3"
								>
									Save service
								</button>
								<div className="flex flex-col gap-2">
									<label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold">
										<span>Add sample images</span>
										<ImagePlus size={17} />
										<input
											type="file"
											accept="image/*"
											onChange={(event) =>
												handleSamples(event.target.files)
											}
											className="hidden"
											multiple
										/>
									</label>
									<div className="grid grid-cols-3 gap-2">
										{samples.map((sample, index) => (
											<div
												key={sample}
												className="relative h-20 overflow-hidden rounded-lg"
											>
												<img
													src={sample}
													alt={`Sample ${index + 1}`}
													className="absolute inset-0 h-full w-full rounded-lg object-cover"
												/>
												<button
													onClick={() =>
														setSamples(
															samples.filter(
																(_, i) => i !== index
															)
														)
													}
													className="absolute right-1 top-1 rounded-full bg-white p-1 text-slate-400 transition hover:bg-slate-100"
												>
													<Trash2 size={16} />
												</button>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				)}

				<div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
					<div className="grid grid-cols-[1fr_100px_120px] border-b border-slate-100 px-5 py-3 text-xs font-bold uppercase text-slate-400">
						<span>Service</span>
						<span>Price</span>
						<span>Status</span>
					</div>
					{services.map((service, index) => (
						<div
							key={service.name}
							className="grid grid-cols-[1fr_100px_120px] items-center border-b border-slate-100 px-5 py-4 last:border-0"
						>
							<div className="flex items-center gap-3">
								{service.image ? (
									<img
										src={service.image}
										alt=""
										className="h-10 w-10 rounded-lg object-cover"
									/>
								) : (
									<span className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100">
										<Pencil size={16} />
									</span>
								)}
								<b>{service.name}</b>
							</div>
							<b>₹{service.price}</b>
							<div className="flex items-center justify-between">
								<button
									onClick={() =>
										setServices(
											services.map((item, itemIndex) =>
												itemIndex === index
													? { ...item, active: !item.active }
													: item
											)
										)
									}
									className={`rounded-full px-2.5 py-1 text-xs font-bold ${
										service.active
											? "bg-emerald-50 text-emerald-700"
											: "bg-slate-100 text-slate-500"
									}`}
								>
									{service.active ? "Active" : "Hidden"}
								</button>
								<button
									aria-label={`Delete ${service.name}`}
									onClick={() =>
										setServices(
											services.filter(
												(_, itemIndex) => itemIndex !== index
											)
										)
									}
									className="text-slate-400 hover:text-red-500"
								>
									<Trash2 size={16} />
								</button>
							</div>
						</div>
					))}
				</div>
			</section>
		</main>
	);
}
