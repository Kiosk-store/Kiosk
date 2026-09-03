/** @format */

"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
	Receipt,
	Search,
	Clock,
	Loader2,
	ArrowLeft,
	DollarSign,
} from "lucide-react";

import { CURRENCIES, formatPrice } from "@/lib/currency";
import { useCurrency } from "@/context/CurrencyContext";

interface InvoiceItem {
	id: string;
	invoiceNumber: string;
	plan: string;
	billingCycle: string;
	amount: number;
	currency: string;
	status: string;
	dueDate: string;
	paidAt?: string;
	paymentMethod?: string;
	tenantName: string;
	tenantSlug: string;
	userName: string;
	userEmail: string;
	createdAt: string;
}

export default function AdminBillingPage() {
	const { currency, isLoading: isCurrencyLoading } = useCurrency();
	const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<"ALL" | "PAID" | "PENDING" | "PAST_DUE">("ALL");

	useEffect(() => {
		async function fetchBilling() {
			try {
				setIsLoading(true);
				const res = await fetch("/api/admin/billing");
				if (res.ok) {
					const data = await res.json();
					setInvoices(data.invoices || []);
				}
			} catch (err) {
				console.error("[FETCH_ADMIN_BILLING_ERROR]", err);
			} finally {
				setIsLoading(false);
			}
		}

		fetchBilling();
	}, []);

	const filteredInvoices = useMemo(() => {
		return invoices.filter((inv) => {
			if (statusFilter !== "ALL" && inv.status !== statusFilter) return false;
			if (searchQuery.trim()) {
				const q = searchQuery.toLowerCase().trim();
				return (
					inv.invoiceNumber.toLowerCase().includes(q) ||
					inv.userName.toLowerCase().includes(q) ||
					inv.userEmail.toLowerCase().includes(q) ||
					inv.tenantSlug.toLowerCase().includes(q)
				);
			}
			return true;
		});
	}, [invoices, statusFilter, searchQuery]);

	const revenueStats = useMemo(() => {
		const paid = invoices.filter((i) => i.status === "PAID");
		const totalPaidUsd = paid.reduce((acc, curr) => {
			const code = curr.currency?.toUpperCase() || "USD";
			const rate = CURRENCIES[code]?.rateFromUSD || 1;
			return acc + (curr.amount || 0) / rate;
		}, 0);

		const pending = invoices.filter((i) => i.status === "PENDING");
		const totalPendingUsd = pending.reduce((acc, curr) => {
			const code = curr.currency?.toUpperCase() || "USD";
			const rate = CURRENCIES[code]?.rateFromUSD || 1;
			return acc + (curr.amount || 0) / rate;
		}, 0);

		return {
			totalPaid: Math.round(totalPaidUsd),
			paidCount: paid.length,
			totalPending: Math.round(totalPendingUsd),
			pendingCount: pending.length,
		};
	}, [invoices]);

	const formatInvoiceAmount = (amount: number, currencyCode?: string) => {
		const code = (currencyCode || "USD").toUpperCase();
		const config = CURRENCIES[code] || CURRENCIES.USD;
		const symbol = config.symbol || "$";
		return `${symbol}${amount.toLocaleString()}`;
	};

	return (
		<div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200">
			{/* Header Navigation */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
				<div>
					<div className="flex items-center gap-2">
						<Link
							href="/admin"
							className="text-xs font-bold text-gray-500 hover:text-gray-900 inline-flex items-center gap-1">
							<ArrowLeft className="w-3.5 h-3.5" />
							<span>Admin Dashboard</span>
						</Link>
						<span className="text-gray-300">/</span>
						<span className="text-xs font-bold text-blue-600">Billing & Invoices</span>
					</div>
					<h1 className="text-xl sm:text-2xl font-bold font-nohemi text-gray-900 mt-1 leading-snug">
						Master Billing Transactions & Invoices
					</h1>
					<p className="text-xs text-gray-500 font-medium">
						Track customer subscription invoices, payment settlements, and transaction histories.
					</p>
				</div>
			</div>

			{/* Revenue Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
				<div className="p-4 sm:p-5 rounded-2xl bg-white border border-emerald-200/90 shadow-2xs space-y-1.5 sm:space-y-2">
					<div className="flex items-center justify-between">
						<span className="text-[11px] sm:text-xs font-bold text-gray-500 uppercase">Paid Revenue</span>
						<div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
							<DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
						</div>
					</div>
					<div className="flex items-baseline gap-2 flex-wrap">
						<h3 className="text-xl sm:text-2xl font-extrabold font-nohemi text-emerald-700">
							{isCurrencyLoading
								? "…"
								: formatPrice(revenueStats.totalPaid, currency)}
						</h3>
						{!isCurrencyLoading && (
							<span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-200 uppercase">
								{currency.code}
							</span>
						)}
					</div>
					<p className="text-[10px] sm:text-[11px] text-gray-500 font-medium">
						Across {revenueStats.paidCount} successfully paid invoices
					</p>
				</div>

				<div className="p-4 sm:p-5 rounded-2xl bg-white border border-amber-200/90 shadow-2xs space-y-1.5 sm:space-y-2">
					<div className="flex items-center justify-between">
						<span className="text-[11px] sm:text-xs font-bold text-gray-500 uppercase">Pending Invoices</span>
						<div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
							<Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
						</div>
					</div>
					<div className="flex items-baseline gap-2 flex-wrap">
						<h3 className="text-xl sm:text-2xl font-extrabold font-nohemi text-amber-700">
							{isCurrencyLoading
								? "…"
								: formatPrice(revenueStats.totalPending, currency)}
						</h3>
						{!isCurrencyLoading && (
							<span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full border border-amber-200 uppercase">
								{currency.code}
							</span>
						)}
					</div>
					<p className="text-[10px] sm:text-[11px] text-gray-500 font-medium">
						{revenueStats.pendingCount} invoices awaiting client payment
					</p>
				</div>

				<div className="p-4 sm:p-5 rounded-2xl bg-white border border-blue-200/90 shadow-2xs space-y-1.5 sm:space-y-2">
					<div className="flex items-center justify-between">
						<span className="text-[11px] sm:text-xs font-bold text-gray-500 uppercase">Total Invoices</span>
						<div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
							<Receipt className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
						</div>
					</div>
					<h3 className="text-xl sm:text-2xl font-extrabold font-nohemi text-blue-700">
						{invoices.length}
					</h3>
					<p className="text-[10px] sm:text-[11px] text-gray-500 font-medium">
						Recorded in master ledger
					</p>
				</div>
			</div>

			{/* Filters & Search */}
			<div className="p-3 sm:p-4 bg-white border border-gray-200/90 rounded-2xl sm:rounded-3xl shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
				<div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl sm:rounded-2xl overflow-x-auto scrollbar-none">
					{(
						[
							{ id: "ALL", label: "All Invoices" },
							{ id: "PAID", label: "Paid" },
							{ id: "PENDING", label: "Pending" },
							{ id: "PAST_DUE", label: "Past Due" },
						] as const
					).map((tab) => (
						<button
							key={tab.id}
							type="button"
							onClick={() => setStatusFilter(tab.id)}
							className={`px-3 py-1.5 rounded-lg sm:rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
								statusFilter === tab.id
									? "bg-white text-blue-600 shadow-xs"
									: "text-gray-600 hover:text-gray-900"
							}`}>
							{tab.label}
						</button>
					))}
				</div>

				<div className="relative w-full sm:w-72">
					<Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
					<input
						type="text"
						placeholder="Search customer, invoice, slug..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 focus:outline-none focus:border-blue-600 bg-gray-50/50"
					/>
				</div>
			</div>

			{/* Invoices List / Table */}
			<div className="bg-white border border-gray-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xs">
				{isLoading ? (
					<div className="p-12 sm:p-16 flex flex-col items-center justify-center gap-3">
						<Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
						<p className="text-xs font-bold text-gray-500">Loading invoices...</p>
					</div>
				) : filteredInvoices.length === 0 ? (
					<div className="p-12 sm:p-16 text-center space-y-2">
						<Receipt className="w-10 h-10 text-gray-400 mx-auto" />
						<h4 className="text-sm font-bold text-gray-900">No invoices found</h4>
						<p className="text-xs text-gray-500">No invoices match your selected filter.</p>
					</div>
				) : (
					<>
						{/* MOBILE CARD VIEW: Visible only on small/phone screens */}
						<div className="block md:hidden space-y-3">
							{filteredInvoices.map((inv) => {
								const isPaid = inv.status === "PAID";
								const isPending = inv.status === "PENDING";

								return (
									<div
										key={inv.id}
										className="p-4 rounded-xl bg-gray-50/70 border border-gray-150 space-y-2.5">
										<div className="flex items-center justify-between gap-2">
											<span className="font-mono font-bold text-xs text-gray-900">
												{inv.invoiceNumber}
											</span>
											<span
												className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
													isPaid
														? "bg-emerald-100 text-emerald-800"
														: isPending
														? "bg-amber-100 text-amber-800"
														: "bg-red-100 text-red-800"
												}`}>
												{inv.status}
											</span>
										</div>

										<div>
											<p className="font-bold text-xs text-gray-900">{inv.userName || "Customer"}</p>
											<p className="text-[11px] text-gray-500 truncate mt-0.5">
												{inv.userEmail} • <span className="font-mono text-gray-700">{inv.tenantSlug || "workspace"}</span>
											</p>
										</div>

										<div className="pt-2 border-t border-gray-200/60 flex items-center justify-between text-xs">
											<div className="flex items-center gap-2">
												<span className="px-2 py-0.5 rounded-md bg-white border border-gray-200 text-gray-700 text-[10px] font-bold">
													{inv.plan.replace(/_/g, " ")} ({inv.billingCycle})
												</span>
											</div>
											<div className="text-right">
												<span className="font-extrabold text-sm text-gray-900 block">
													{formatInvoiceAmount(inv.amount, inv.currency)}
												</span>
												<span className="text-[10px] text-gray-400 block font-medium">
													{new Date(inv.createdAt).toLocaleDateString("en-US", {
														month: "short",
														day: "numeric",
														year: "numeric",
													})}
												</span>
											</div>
										</div>
									</div>
								);
							})}
						</div>

						{/* DESKTOP TABLE VIEW: Visible on medium+ screens */}
						<div className="hidden md:block overflow-x-auto">
							<table className="w-full text-left text-xs">
								<thead>
									<tr className="border-b border-gray-100 text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">
										<th className="pb-3">Invoice #</th>
										<th className="pb-3">Customer & Workspace</th>
										<th className="pb-3">Plan / Cycle</th>
										<th className="pb-3">Amount</th>
										<th className="pb-3">Status</th>
										<th className="pb-3 text-right">Date</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-50 font-medium">
									{filteredInvoices.map((inv) => {
										const isPaid = inv.status === "PAID";
										const isPending = inv.status === "PENDING";

										return (
											<tr key={inv.id} className="hover:bg-gray-50/80 transition-colors">
												<td className="py-4 pr-4">
													<span className="font-mono font-bold text-gray-900">
														{inv.invoiceNumber}
													</span>
												</td>

												<td className="py-4 pr-4">
													<div>
														<p className="font-bold text-gray-900">{inv.userName}</p>
														<p className="text-[10px] text-gray-400">
															{inv.userEmail} • {inv.tenantSlug || "workspace"}
														</p>
													</div>
												</td>

												<td className="py-4 pr-4">
													<span className="px-2 py-0.5 rounded-lg bg-gray-100 text-gray-800 text-[10px] font-bold">
														{inv.plan.replace(/_/g, " ")} ({inv.billingCycle})
													</span>
												</td>

												<td className="py-4 pr-4">
													<span className="font-extrabold text-gray-900">
														{formatInvoiceAmount(inv.amount, inv.currency)}
													</span>
												</td>

												<td className="py-4 pr-4">
													<span
														className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
															isPaid
																? "bg-emerald-100 text-emerald-800"
																: isPending
																? "bg-amber-100 text-amber-800"
																: "bg-red-100 text-red-800"
														}`}>
														{inv.status}
													</span>
												</td>

												<td className="py-4 text-right text-gray-500 text-[11px]">
													{new Date(inv.createdAt).toLocaleDateString("en-US", {
														month: "short",
														day: "numeric",
														year: "numeric",
													})}
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
