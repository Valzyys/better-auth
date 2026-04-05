"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";
import { startTransition, useEffect, useRef, useState } from "react";
import { DynamicCodeBlock } from "@/components/ui/dynamic-code-block";

// ============================================================
// SOCIAL / PLATFORM ICONS  (tidak diubah — hanya teks di bawah)
// ============================================================
export const providerIcons: Record<string, () => ReactNode> = {
	Instagram: () => (
		<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
			<path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
		</svg>
	),
	Twitter: () => (
		<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 448 512">
			<path fill="currentColor" d="M64 32C28.7 32 0 60.7 0 96v320c0 35.3 28.7 64 64 64h320c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64zm297.1 84L257.3 234.6L379.4 396h-95.6L209 298.1L123.3 396H75.8l111-126.9L69.7 116h98l67.7 89.5l78.2-89.5zm-37.8 251.6L153.4 142.9h-28.3l171.8 224.7h26.3z"/>
		</svg>
	),
	YouTube: () => (
		<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 576 512">
			<path fill="currentColor" d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/>
		</svg>
	),
	TikTok: () => (
		<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
			<path fill="currentColor" d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"/>
		</svg>
	),
	Showroom: () => (
		<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
			<path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
		</svg>
	),
	IDNLive: () => (
		<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
			<path fill="currentColor" d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z"/>
		</svg>
	),
	GitHub: () => (
		<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 15 15">
			<path fill="currentColor" fillRule="evenodd" d="M7.5.25a7.25 7.25 0 0 0-2.292 14.13c.363.066.495-.158.495-.35c0-.172-.006-.628-.01-1.233c-2.016.438-2.442-.972-2.442-.972c-.33-.838-.805-1.06-.805-1.06c-.658-.45.05-.441.05-.441c.728.051 1.11.747 1.11.747c.647 1.108 1.697.788 2.11.602c.066-.468.254-.788.46-.969c-1.61-.183-3.302-.805-3.302-3.583a2.8 2.8 0 0 1 .747-1.945c-.075-.184-.324-.92.07-1.92c0 0 .61-.194 1.994.744A6.963 6.963 0 0 1 7.5 3.756A6.97 6.97 0 0 1 9.315 4c1.384-.938 1.992-.743 1.992-.743c.396.998.147 1.735.072 1.919c.465.507.745 1.153.745 1.945c0 2.785-1.695 3.398-3.31 3.577c.26.224.492.667.492 1.343c0 .97-.009 1.751-.009 1.989c0 .194.131.42.499.349A7.25 7.25 0 0 0 7.499.25" clipRule="evenodd"/>
		</svg>
	),
	Discord: () => (
		<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
			<path fill="currentColor" d="M18.59 5.89c-1.23-.57-2.54-.99-3.92-1.23c-.17.3-.37.71-.5 1.04c-1.46-.22-2.91-.22-4.34 0c-.14-.33-.34-.74-.51-1.04c-1.38.24-2.69.66-3.92 1.23c-2.48 3.74-3.15 7.39-2.82 10.98c1.65 1.23 3.24 1.97 4.81 2.46c.39-.53.73-1.1 1.03-1.69c-.57-.21-1.11-.48-1.62-.79c.14-.1.27-.21.4-.31c3.13 1.46 6.52 1.46 9.61 0c.13.11.26.21.4.31c-.51.31-1.06.57-1.62.79c.3.59.64 1.16 1.03 1.69c1.57-.49 3.17-1.23 4.81-2.46c.39-4.17-.67-7.78-2.82-10.98Z"/>
		</svg>
	),
	npm: () => (
		<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
			<path fill="currentColor" d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331z"/>
		</svg>
	),
};

// Platform tempat data JKT48 tersedia
export const dataSources = [
	"Instagram",
	"Twitter",
	"YouTube",
	"TikTok",
	"Showroom",
	"IDNLive",
	"GitHub",
	"Discord",
	"npm",
];

// Fitur / endpoint yang tersedia di JKT48Connect
export const features = [
	{ name: "Member Profiles", category: "member" },
	{ name: "Generation Data", category: "member" },
	{ name: "Social Links", category: "member" },
	{ name: "Birthday Info", category: "member" },
	{ name: "Theater Schedule", category: "theater" },
	{ name: "Setlist Data", category: "theater" },
	{ name: "Senbatsu Info", category: "theater" },
	{ name: "Team Info", category: "theater" },
	{ name: "IDN Live Stream", category: "live" },
	{ name: "Showroom Stream", category: "live" },
	{ name: "Viewer Count", category: "live" },
	{ name: "Live Notifications", category: "live" },
	{ name: "News Feed", category: "news" },
	{ name: "Announcements", category: "news" },
	{ name: "Handshake Events", category: "events" },
	{ name: "Off-Air Shows", category: "events" },
	{ name: "Event Alerts", category: "events" },
	{ name: "REST API", category: "sdk" },
	{ name: "Node.js SDK", category: "sdk" },
	{ name: "TypeScript Types", category: "sdk" },
	{ name: "Priority Token", category: "sdk" },
	{ name: "Rate Limiting", category: "security" },
	{ name: "API Key Auth", category: "security" },
	{ name: "Webhook", category: "integration" },
	{ name: "Open API Spec", category: "integration" },
	{ name: "Community SDK", category: "integration" },
];

export const categoryLabels: Record<string, string> = {
	member: "Member",
	theater: "Theater",
	live: "Live",
	news: "News",
	events: "Events",
	sdk: "SDK",
	security: "Security",
	integration: "Integration",
};

// ============================================================
// SDK / Language adapters
// ============================================================
const sdkAdapters = [
	{
		name: "Node.js",
		icon: () => (
			<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
				<path fill="currentColor" d="M11.998 24c-.321 0-.641-.084-.922-.247l-2.936-1.737c-.438-.245-.224-.332-.08-.382c.585-.203.703-.25 1.328-.604c.065-.037.151-.023.218.017l2.256 1.339c.082.045.198.045.275 0l8.795-5.076c.082-.047.134-.141.134-.238V6.921c0-.099-.051-.19-.137-.242l-8.791-5.072c-.081-.047-.189-.047-.271 0L3.075 6.68c-.087.05-.139.143-.139.241v10.15c0 .097.051.189.136.235l2.409 1.392c1.307.654 2.108-.116 2.108-.891V7.787c0-.142.114-.253.256-.253h1.115c.139 0 .255.111.255.253v10.021c0 1.745-.95 2.745-2.604 2.745c-.508 0-.909 0-2.026-.551L2.28 18.675a1.85 1.85 0 0 1-.919-1.604V6.921c0-.661.354-1.278.922-1.608l8.795-5.079a1.916 1.916 0 0 1 1.845 0l8.794 5.079c.568.33.921.947.921 1.608v10.15c0 .66-.353 1.275-.921 1.604l-8.794 5.078a1.86 1.86 0 0 1-.925.247"/>
			</svg>
		),
	},
	{
		name: "TypeScript",
		icon: () => (
			<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
				<path fill="currentColor" d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0H1.125zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"/>
			</svg>
		),
	},
	{
		name: "Python",
		icon: () => (
			<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
				<path fill="currentColor" d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.83l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.23l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05L0 11.97l.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.24l.01-2.75-.02-.28.03-.25.09-.22.15-.18.18-.16.22-.11.24-.08.25-.04.26-.02.27-.01h5.57l.28.01.27.01.26.03.24.05.22.09.2.12.18.17.17.2.13.24.1.27.07.3.04.33.01.36v5.3l-.04.35-.07.31-.1.27-.14.22-.17.18-.2.14-.22.1-.24.07-.25.04-.27.01H6.5l-.27.01-.24.04-.2.07-.18.12-.16.17-.13.23-.1.29-.06.36L5.14 14l.01.36.04.32.07.28.1.24.13.2.16.16.19.12.21.09.23.06.24.04.26.02.27.01h8.02l.27-.01.26-.02.24-.04.23-.06.21-.09.2-.12.17-.16.14-.2.11-.24.07-.28.04-.32.01-.36v-4.8l-.01-.27-.04-.24-.06-.2-.09-.18-.12-.16-.15-.13-.18-.1-.2-.08-.22-.05-.24-.03-.25-.01H8.31l-.26-.01-.25-.04-.22-.07-.2-.11-.18-.16-.16-.2-.13-.25-.1-.29-.07-.34-.04-.38-.01-.43v-5.3l.01-.43.04-.38.07-.34.1-.29.13-.25.16-.2.18-.16.2-.11.22-.07.25-.04.26-.01.27.01h5.57z"/>
			</svg>
		),
	},
	{
		name: "REST API",
		icon: () => (
			<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
				<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
				<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
			</svg>
		),
	},
];

// ============================================================
// Code examples per endpoint
// ============================================================
const endpointCodeExamples: Record<string, string> = {
	Members: `const { JKT48Connect } = require('@jkt48connect-corp/sdk')

const client = new JKT48Connect({
  apiKey: process.env.JKT48_API_KEY,
})

// Ambil semua data member JKT48
const members = await client.members.getAll()
console.log(members)
// [{ name: 'Freya Jayawardana', generation: '7', ... }]`,

	Theater: `const { JKT48Connect } = require('@jkt48connect-corp/sdk')

const client = new JKT48Connect({
  apiKey: process.env.JKT48_API_KEY,
})

// Jadwal teater bulan ini
const schedule = await client.theater.getSchedule({
  month: new Date().getMonth() + 1,
})
console.log(schedule)`,

	Live: `const { JKT48Connect } = require('@jkt48connect-corp/sdk')

const client = new JKT48Connect({
  apiKey: process.env.JKT48_API_KEY,
})

// Cek live stream yang sedang berjalan
const streams = await client.live.getCurrent()
// [{ member: 'Delynn', platform: 'IDN', viewers: 4821 }]

// Subscribe notifikasi ketika oshi live
client.live.onStart('Freya', (stream) => {
  console.log('Freya mulai live!', stream)
})`,

	News: `const { JKT48Connect } = require('@jkt48connect-corp/sdk')

const client = new JKT48Connect({
  apiKey: process.env.JKT48_API_KEY,
})

// Berita & pengumuman terbaru
const news = await client.news.getLatest({ limit: 10 })

// Event handshake mendatang
const events = await client.events.getUpcoming({
  type: 'handshake',
})`,
};

export const serverCode = `import { JKT48Connect } from '@jkt48connect-corp/sdk'

export const client = new JKT48Connect({
  apiKey: process.env.JKT48_API_KEY,

  // Endpoint data yang ingin diakses
  endpoints: {
    members: true,
    theater: true,
    live: true,
    news: true,
    events: true,
  },
})

// Contoh: ambil jadwal teater hari ini
const schedule = await client.theater.getToday()
`

export const clientCode = `import { createJKT48Client } from '@jkt48connect-corp/sdk/browser'

export const jkt48 = createJKT48Client({
  apiKey: process.env.NEXT_PUBLIC_JKT48_API_KEY,

  // Fitur real-time (browser)
  realtime: {
    liveNotifications: true,
    theaterUpdates: true,
  },
})

// Subscribe update live stream
jkt48.live.subscribe((event) => {
  console.log(event.member, 'mulai live!')
})
`

export function ServerClientTabs() {
	const [activeTab, setActiveTab] = useState<"server" | "client">("server");

	return (
		<div className="relative">
			<div className="absolute -inset-4 bg-gradient-to-br from-foreground/[0.02] via-transparent to-foreground/[0.02] rounded-2xl blur-xl pointer-events-none dark:from-foreground/[0.03] dark:to-foreground/[0.03]" />

			<div className="relative overflow-hidden bg-neutral-50 dark:bg-black">
				<div className="flex border border-foreground/[0.08] rounded-t-lg bg-neutral-100/50 dark:bg-[#0a0a0a]/50">
					<button
						type="button"
						onClick={() => startTransition(() => setActiveTab("server"))}
						className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-colors relative ${
							activeTab === "server"
								? "text-foreground/80"
								: "text-foreground/40 hover:text-foreground/60"
						}`}
					>
						server.ts
						{activeTab === "server" && (
							<span className="absolute bottom-0 left-2 right-2 h-[1.5px] bg-foreground/70" />
						)}
					</button>
					<button
						type="button"
						onClick={() => startTransition(() => setActiveTab("client"))}
						className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-colors relative ${
							activeTab === "client"
								? "text-foreground/80"
								: "text-foreground/40 hover:text-foreground/60"
						}`}
					>
						client.ts
						{activeTab === "client" && (
							<span className="absolute bottom-0 left-2 right-2 h-[1.5px] bg-foreground/70" />
						)}
					</button>
				</div>

				<div className="relative max-h-[320px] overflow-hidden">
					<DynamicCodeBlock
						lang="ts"
						code={activeTab === "server" ? serverCode : clientCode}
						codeblock={{
							className:
								"border-0 rounded-none my-0 shadow-none bg-neutral-50 dark:bg-black [&_div]:bg-neutral-50 [&_div]:dark:bg-black [&_div]:text-[12px]",
							"data-line-numbers": true,
						}}
					/>
					<div
						className="absolute inset-y-0 left-0 w-px pointer-events-none"
						style={{
							background:
								"linear-gradient(to bottom, var(--color-foreground) 0%, transparent 100%)",
							opacity: 0.08,
						}}
					/>
					<div
						className="absolute inset-y-0 right-0 w-px pointer-events-none"
						style={{
							background:
								"linear-gradient(to bottom, var(--color-foreground) 0%, transparent 100%)",
							opacity: 0.08,
						}}
					/>
					<div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none" />
				</div>
			</div>
		</div>
	);
}

function getEndpointIcon(name: string) {
	const icons: Record<string, () => ReactNode> = {
		Members: () => (
			<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
				<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
			</svg>
		),
		Theater: () => (
			<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
				<path d="M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z"/><path d="M10 12h4"/><path d="M7 9h.01M17 9h.01"/>
			</svg>
		),
		Live: () => (
			<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
				<circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/>
			</svg>
		),
		News: () => (
			<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
				<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/>
			</svg>
		),
	};
	return icons[name] ? icons[name]() : null;
}

export function DatabaseSection() {
	const [activeEndpoint, setActiveEndpoint] = useState<string>("Members");
	const endpointOptions = Object.keys(endpointCodeExamples);
	const codeScrollRef = useRef<HTMLDivElement>(null);
	const sidebarRef = useRef<HTMLDivElement>(null);

	const isFirstRender = useRef(true);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}

		const el = codeScrollRef.current;
		if (el) el.scrollTop = 0;

		const sidebar = sidebarRef.current;
		if (sidebar) {
			const active = sidebar.querySelector(
				`[data-endpoint="${activeEndpoint}"]`,
			) as HTMLElement | null;
			if (active) active.scrollIntoView({ block: "nearest", behavior: "smooth" });
		}
	}, [activeEndpoint]);

	return (
		<div>
			<div className="flex items-center gap-3 mb-5">
				<span className="text-base text-foreground/85 dark:text-foreground/75">
					Akses Data{" "}
					<span className="text-amber-600 dark:text-amber-400">JKT48</span>
				</span>
				<div className="h-px flex-1 bg-foreground/10" />
			</div>

			<p className="text-[13px] text-foreground/55 dark:text-foreground/45 mb-5 max-w-xl leading-relaxed">
				Gunakan endpoint mana pun yang kamu butuhkan. Akses data member,
				jadwal teater, live stream, dan berita JKT48 — semuanya dalam satu
				API yang terpusat.
			</p>

			<div className="border border-foreground/[0.12] overflow-hidden bg-neutral-50/50 dark:bg-black/40">
				{/* Tabs */}
				<div className="flex border-b border-foreground/[0.09] bg-neutral-100/50 dark:bg-[#0a0a0a]/50 overflow-x-auto no-scrollbar">
					{endpointOptions.map((ep) => (
						<button
							key={ep}
							type="button"
							onClick={() => startTransition(() => setActiveEndpoint(ep))}
							className={`flex items-center gap-1.5 px-3 py-2 text-[11px] font-mono transition-colors relative border-r border-foreground/[0.08] last:border-r-0 shrink-0 ${
								activeEndpoint === ep
									? "text-foreground/90 bg-foreground/[0.03]"
									: "text-foreground/45 hover:text-foreground/70"
							}`}
						>
							<span className={activeEndpoint === ep ? "text-foreground/70" : "text-foreground/35"}>
								{getEndpointIcon(ep)}
							</span>
							{ep}
							{activeEndpoint === ep && (
								<span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-amber-500/70 dark:bg-amber-400/60" />
							)}
						</button>
					))}
				</div>

				<div className="flex h-[180px]">
					{/* Code snippet */}
					<div className="flex-1 min-w-0 relative">
						<div ref={codeScrollRef} className="h-full overflow-auto no-scrollbar">
							<DynamicCodeBlock
								lang="ts"
								code={endpointCodeExamples[activeEndpoint]}
								codeblock={{
									className:
										"border-0 rounded-none my-0 shadow-none bg-neutral-50 dark:bg-black [&_div]:bg-neutral-50 [&_div]:dark:bg-black [&_div]:text-[12px]",
									"data-line-numbers": true,
								}}
							/>
						</div>
						<div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-neutral-50 dark:from-black to-transparent pointer-events-none" />
					</div>

					{/* Sidebar */}
					<div
						ref={sidebarRef}
						className="hidden sm:block w-[180px] shrink-0 border-l border-foreground/[0.09] bg-foreground/[0.015] overflow-y-auto no-scrollbar"
					>
						<div className="px-3 pt-3 pb-2">
							<p className="text-[9px] font-mono uppercase tracking-widest text-amber-600/80 dark:text-amber-400/80 mb-2.5">
								Core Endpoints
							</p>
							<div className="space-y-1">
								{endpointOptions.map((ep) => (
									<button
										key={ep}
										type="button"
										data-endpoint={ep}
										onClick={() => startTransition(() => setActiveEndpoint(ep))}
										className={`group flex items-center gap-2 w-full text-left transition-colors py-1 px-1.5 ${
											activeEndpoint === ep
												? "text-foreground/90 dark:text-foreground/80"
												: "text-foreground/50 dark:text-foreground/35 hover:text-foreground/75 cursor-pointer"
										}`}
									>
										<span className="shrink-0">{getEndpointIcon(ep)}</span>
										<span className="text-[11px] font-mono">{ep}</span>
									</button>
								))}
							</div>
						</div>

						<div className="border-t border-foreground/[0.06] px-3 pt-2.5 pb-2">
							<p className="text-[9px] font-mono uppercase tracking-widest text-violet-600/80 dark:text-violet-400/80 mb-2.5">
								SDK
							</p>
							<div className="space-y-1">
								{sdkAdapters.map((sdk) => (
									<div key={sdk.name} className="flex items-center gap-2 py-1 px-1.5 text-foreground/45 dark:text-foreground/30">
										<span className="shrink-0">{sdk.icon()}</span>
										<span className="text-[11px] font-mono">{sdk.name}</span>
									</div>
								))}
							</div>
						</div>

						<div className="border-t border-foreground/[0.06] px-3 pt-2.5 pb-3">
							<p className="text-[9px] font-mono uppercase tracking-widest text-sky-600/80 dark:text-sky-400/80 mb-2">
								Trusted By
							</p>
							<div className="space-y-1">
								{["Cavallery", "FritzyForce", "Nayrakuen", "GISTREAM", "JKT48Connect APP"].map(
									(name) => (
										<div key={name} className="flex items-center gap-2 py-0.5 px-1.5">
											<span className="size-1.5 border border-foreground/20 bg-foreground/[0.05]" />
											<span className="text-[10px] font-mono text-foreground/35 dark:text-foreground/22">
												{name}
											</span>
										</div>
									),
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export function SocialProvidersSection() {
	const containerRef = useRef<HTMLDivElement>(null);
	const [scrollIndex, setScrollIndex] = useState(0);

	// Daftar member JKT48 aktif (sampel)
	const members = [
		"Freya", "Gracia", "Delynn", "Aralie", "Oline", "Erine",
		"Catherin", "Amel", "Fritzy", "Indah", "Shani", "Gita",
		"Jessica", "Marsha", "Mutiara", "Christy", "Shalza", "Beby",
		"Adel", "Fiony",
	];

	const visibleRows = 2;
	const perRow = 5;
	const rowHeight = 34;
	const totalRows = Math.ceil(members.length / perRow);
	const maxScroll = totalRows - visibleRows;

	useEffect(() => {
		const interval = setInterval(() => {
			setScrollIndex((prev) => (prev >= maxScroll ? 0 : prev + 1));
		}, 2500);
		return () => clearInterval(interval);
	}, [maxScroll]);

	const allRows = Array.from({ length: totalRows }, (_, rowIdx) =>
		members.slice(rowIdx * perRow, rowIdx * perRow + perRow),
	);

	return (
		<div ref={containerRef} className="flex gap-6 items-start">
			<div className="shrink-0">
				<span className="text-[24px] font-light text-foreground/80 dark:text-foreground/70 tabular-nums leading-none">
					47+
				</span>
				<p className="text-[14px] text-foreground/55 dark:text-foreground/45 mt-1">
					data member
				</p>
			</div>

			<div
				className="relative flex-1 overflow-hidden border border-dashed border-foreground/10"
				style={{ height: `${visibleRows * rowHeight}px` }}
			>
				<motion.div
					animate={{ y: -(scrollIndex * rowHeight) }}
					transition={{ duration: 0.6, ease: "easeInOut" }}
				>
					{allRows.map((row, rowIdx) => (
						<div key={rowIdx} className="flex" style={{ height: `${rowHeight}px` }}>
							{row.map((member) => (
								<span
									key={member}
									className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] font-mono text-foreground/65 dark:text-foreground/50 border-r border-b border-dashed border-foreground/[0.06] cursor-default"
								>
									{member}
								</span>
							))}
						</div>
					))}
				</motion.div>
				<div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-background to-transparent pointer-events-none" />
			</div>
		</div>
	);
}

export function PluginEcosystem() {
	const half = Math.ceil(features.length / 2);
	const row1 = features.slice(0, half);
	const row2 = features.slice(half);

	return (
		<div>
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2">
					<span className="text-base text-foreground/85 dark:text-foreground/75">
						Fitur & Endpoint
					</span>
					<span className="text-[11px] font-mono text-foreground/50">
						{features.length} tersedia
					</span>
				</div>
				<Link
					href="/docs"
					className="text-[10px] font-mono text-foreground/35 dark:text-foreground/50 hover:text-foreground/55 transition-colors uppercase tracking-wider"
				>
					lihat semua &rarr;
				</Link>
			</div>

			<div className="relative overflow-hidden">
				{/* Row 1 — scrolls left */}
				<div className="flex animate-[marquee_40s_linear_infinite] mb-1.5">
					{[...row1, ...row1].map((feature, i) => (
						<span
							key={`${feature.name}-${i}`}
							className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 mr-1.5 text-[11px] text-foreground dark:text-foreground/90 border border-foreground/[0.06] rounded-sm cursor-default whitespace-nowrap"
						>
							{feature.name}
							<span className="text-[7px] font-mono uppercase tracking-wider text-foreground/50">
								{categoryLabels[feature.category]}
							</span>
						</span>
					))}
				</div>

				{/* Row 2 — scrolls right */}
				<div className="flex animate-[marquee-reverse_45s_linear_infinite]">
					{[...row2, ...row2].map((feature, i) => (
						<span
							key={`${feature.name}-${i}`}
							className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 mr-1.5 text-[11px] text-foreground dark:text-foreground/90 border border-foreground/[0.06] rounded-sm cursor-default whitespace-nowrap"
						>
							{feature.name}
							<span className="text-[7px] font-mono uppercase tracking-wider text-foreground/50">
								{categoryLabels[feature.category]}
							</span>
						</span>
					))}
				</div>

				<div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent pointer-events-none" />
				<div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none" />
			</div>
		</div>
	);
}

const integrationClients = [
	{ name: "Claude Code", cmd: "claude mcp add jkt48connect" },
	{ name: "Cursor", cmd: "npx @jkt48connect/cli mcp --cursor" },
	{ name: "VS Code", cmd: "npx @jkt48connect/cli init" },
];

export function AiNativeSection() {
	const steps = [
		{ label: "fetch", text: "Terhubung ke JKT48Connect API" },
		{ label: "data", text: "members/get-all → 47 member aktif" },
		{ label: "data", text: "theater/schedule → Team J, 19:00" },
		{ label: "write", text: "pages/jadwal.tsx", lines: 18 },
		{ label: "done", text: "Halaman jadwal teater selesai" },
	];

	return (
		<div className="mt-8">
			<div className="flex items-center gap-3 mb-3">
				<div className="flex-1 border-t border-foreground/10" />
				<span className="text-[10px] text-foreground/50 dark:text-foreground/50 font-mono tracking-wider uppercase shrink-0">
					AI Native
				</span>
			</div>
			<p className="text-[14px] text-foreground/80 dark:text-foreground/70 leading-[1.9] mb-5">
				Data JKT48 ada di{" "}
				<span className="text-foreground/90 dark:text-foreground/80">
					kode kamu
				</span>{" "}
				&mdash; jadi AI bisa langsung pakai. Tersedia{" "}
				<span className="inline-flex items-center gap-1 text-foreground/90 dark:text-foreground/80">
					<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-75">
						<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
						<path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
					</svg>
					MCP server
				</span>
				,{" "}
				<span className="inline-flex items-center gap-1 text-foreground/90 dark:text-foreground/80">
					<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-75">
						<polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/>
					</svg>
					Claude Code skills
				</span>
				, dan{" "}
				<span className="inline-flex items-center gap-1 text-foreground/90 dark:text-foreground/80">
					<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-75">
						<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
						<polyline points="14 2 14 8 20 8"/>
					</svg>
					Cursor rules
				</span>
				.
			</p>

			<div className="border border-dashed border-foreground/[0.08] overflow-hidden">
				{/* Prompt line */}
				<div className="flex items-center gap-2 px-3 py-2 border-b border-foreground/[0.06] bg-foreground/[0.015]">
					<span className="text-foreground/50 font-mono text-xs select-none">&rsaquo;</span>
					<span className="text-[11px] font-mono text-foreground/80 dark:text-foreground/70">
						Buatkan halaman jadwal teater JKT48 bulan ini
					</span>
				</div>

				{/* Steps */}
				<div className="divide-y divide-foreground/[0.04]">
					{steps.map((step) => (
						<div key={step.text} className="flex items-center gap-2.5 px-3 py-1.5">
							<span className="text-[8px] font-mono uppercase tracking-wider text-foreground/60 dark:text-foreground/50 w-8 shrink-0">
								{step.label}
							</span>
							<span className="text-[10px] font-mono text-foreground/75 dark:text-foreground/65 truncate">
								{step.text}
							</span>
							{"lines" in step && typeof step.lines === "number" && (
								<span className="text-[9px] font-mono text-emerald-600/80 dark:text-emerald-400/70 ml-auto shrink-0">
									+{step.lines}
								</span>
							)}
							{step.label === "done" && (
								<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/60 ml-auto shrink-0">
									<polyline points="20 6 9 17 4 12"/>
								</svg>
							)}
						</div>
					))}
				</div>

				{/* Integration clients */}
				<div className="border-t border-foreground/[0.06] bg-foreground/[0.015]">
					<div className="flex divide-x divide-foreground/[0.06]">
						{integrationClients.map((mc) => (
							<div key={mc.name} className="flex-1 px-3 py-2">
								<p className="text-[8px] font-mono uppercase tracking-wider text-foreground/55 dark:text-foreground/45 mb-0.5">
									{mc.name}
								</p>
								<code className="text-[9px] font-mono text-foreground/70 dark:text-foreground/55 truncate block">
									{mc.cmd}
								</code>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
