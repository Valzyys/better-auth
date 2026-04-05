"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { Icons } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import type { ContributorInfo } from "@/lib/community-stats";
import { cn } from "@/lib/utils";
import {
	AiNativeSection,
	DatabaseSection,
	PluginEcosystem,
	ServerClientTabs,
	SocialProvidersSection,
} from "./framework-sections";
import { TrustedBy } from "./trusted-by";

const cliCommands = [
	{ name: "npm", command: "npx jkt48connect init" },
	{ name: "yarn", command: "yarn dlx jkt48connect init" },
	{ name: "pnpm", command: "pnpm dlx jkt48connect init" },
	{ name: "bun", command: "bunx jkt48connect init" },
];

const mcpCommands = [
	{ name: "Cursor", command: "npx jkt48connect mcp --cursor" },
	{ name: "Claude Code", command: "claude mcp add jkt48connect" },
	{ name: "Open Code", command: "npx jkt48connect mcp --open-code" },
	{ name: "Manual", command: "npx jkt48connect mcp --manual" },
];

const aiPromptText = `Integrate JKT48Connect API into my project (@jkt48connect-corp/sdk).

1. Install @jkt48connect-corp/sdk. Use my existing project setup — don't change the stack.

2. Create lib/jkt48.ts — initialize JKT48Connect with:
   - API key from environment variable JKT48_API_KEY
   - Enable endpoints: members, theater, live, news, events

3. Create lib/jkt48-client.ts — use the correct framework import:
   - React/Next.js: "@jkt48connect-corp/sdk/react"
   - Vue: "@jkt48connect-corp/sdk/vue"
   - Vanilla: "@jkt48connect-corp/sdk/client"

4. Add the API route handler for my framework (e.g. app/api/jkt48/[...all]/route.ts for Next.js App Router).

5. Add JKT48_API_KEY to my .env if it doesn't exist. Get a free key at docs.jkt48connect.com.

6. Example: fetch today's theater schedule and display it on a page.

Refer to docs.jkt48connect.com for exact API and SDK syntax.`;

function ApiKeyFields() {
	const keyText = "jkt48_api_key_xxxx";
	const tokenDots = "••••••••••••";
	const [keyDisplay, setKeyDisplay] = useState(keyText);
	const [tokenDisplay, setTokenDisplay] = useState(tokenDots);
	const [isTyping, setIsTyping] = useState(false);
	const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
	const isTypingRef = useRef(false);

	const startTyping = useCallback(() => {
		if (isTypingRef.current) return;
		isTypingRef.current = true;
		setIsTyping(true);

		for (const t of timeoutsRef.current) clearTimeout(t);
		timeoutsRef.current = [];

		setKeyDisplay("");
		setTokenDisplay("");

		for (let i = 0; i <= keyText.length; i++) {
			const t = setTimeout(() => {
				setKeyDisplay(keyText.slice(0, i));
			}, i * 60);
			timeoutsRef.current.push(t);
		}

		const tokenStart = (keyText.length + 2) * 60;
		for (let i = 0; i <= tokenDots.length; i++) {
			const t = setTimeout(
				() => {
					setTokenDisplay(tokenDots.slice(0, i));
					if (i === tokenDots.length) {
						isTypingRef.current = false;
						setIsTyping(false);
					}
				},
				tokenStart + i * 50,
			);
			timeoutsRef.current.push(t);
		}
	}, []);

	useEffect(() => {
		return () => {
			for (const t of timeoutsRef.current) clearTimeout(t);
		};
	}, []);

	return (
		<div className="mt-3 flex items-center gap-1.5" onMouseEnter={startTyping}>
			<div className="flex items-center h-5 px-2 border border-foreground/[0.08] bg-foreground/[0.02] flex-1 min-w-0">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="8"
					height="8"
					viewBox="0 0 24 24"
					className="text-foreground/45 dark:text-foreground/30 shrink-0 mr-1.5"
				>
					<path
						fill="currentColor"
						d="M12.65 10A6 6 0 0 0 7 6a6 6 0 0 0-6 6 6 6 0 0 0 6 6 6 6 0 0 0 5.65-4H17v4h4v-4h2v-4H12.65zM7 14a2 2 0 0 1-2-2 2 2 0 0 1 2-2 2 2 0 0 1 2 2 2 2 0 0 1-2 2z"
					/>
				</svg>
				<span className="text-[9px] font-mono text-foreground/50 dark:text-foreground/35 truncate">
					{keyDisplay}
					{isTyping && keyDisplay.length < keyText.length && (
						<span className="inline-block w-px h-2.5 bg-foreground/50 ml-px animate-[blink_0.8s_step-end_infinite] align-middle" />
					)}
				</span>
			</div>
			<div className="flex items-center h-5 px-2 border border-foreground/[0.08] bg-foreground/[0.02] flex-1 min-w-0">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="8"
					height="8"
					viewBox="0 0 24 24"
					className="text-foreground/45 dark:text-foreground/30 shrink-0 mr-1.5"
				>
					<path
						fill="currentColor"
						d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2m-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2M9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2z"
					/>
				</svg>
				<span className="text-[9px] font-mono text-foreground/50 dark:text-foreground/35 tracking-[0.1em]">
					{tokenDisplay}
					{isTyping &&
						keyDisplay.length >= keyText.length &&
						tokenDisplay.length < tokenDots.length && (
							<span className="inline-block w-px h-2.5 bg-foreground/50 ml-px animate-[blink_0.8s_step-end_infinite] align-middle" />
						)}
				</span>
			</div>
		</div>
	);
}

function InstallBlock() {
	const [mode, setMode] = useState<"cli" | "prompt" | "mcp" | "sdk">("cli");
	const [copied, setCopied] = useState(false);
	const [pmOpen, setPmOpen] = useState(false);
	const [promptOpen, setPromptOpen] = useState(false);
	const contentRef = useRef<HTMLDivElement>(null);
	const [contentHeight, setContentHeight] = useState<number | "auto">("auto");
	const [overflow, setOverflow] = useState<"hidden" | "visible">("visible");

	useEffect(() => {
		const el = contentRef.current;
		if (!el) return;
		const ro = new ResizeObserver(() => {
			setContentHeight(el.offsetHeight);
		});
		ro.observe(el);
		return () => ro.disconnect();
	}, []);

	useLayoutEffect(() => {
		setOverflow("hidden");
	}, [mode]);

	useLayoutEffect(() => {
		if (pmOpen) {
			setOverflow("visible");
		}
	}, [pmOpen]);

	const copy = (text: string) => {
		navigator.clipboard.writeText(text);
		setCopied(true);
		setPmOpen(false);
		setTimeout(() => setCopied(false), 1500);
	};

	return (
		<div className="mb-6 rounded-md border border-foreground/[0.1] relative">
			{/* Tabs */}
			<div className="flex items-center border-b border-foreground/[0.1]">
				<button
					onClick={() => {
						setMode("cli");
						setCopied(false);
						setPmOpen(false);
					}}
					className={cn(
						"px-4 py-2 text-[12px] transition-colors duration-150 relative",
						mode === "cli"
							? "text-neutral-800 dark:text-neutral-200"
							: "text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-400",
					)}
				>
					CLI
					{mode === "cli" && (
						<div className="absolute bottom-0 left-4 right-4 h-[1.5px] bg-neutral-600 dark:bg-neutral-400" />
					)}
				</button>
				<button
					onClick={() => {
						setMode("prompt");
						setCopied(false);
						setPmOpen(false);
					}}
					className={cn(
						"px-4 py-2 text-[12px] transition-colors duration-150 relative",
						mode === "prompt"
							? "text-neutral-800 dark:text-neutral-200"
							: "text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-400",
					)}
				>
					Prompt
					{mode === "prompt" && (
						<div className="absolute bottom-0 left-4 right-4 h-[1.5px] bg-neutral-600 dark:bg-neutral-400" />
					)}
				</button>
				<button
					onClick={() => {
						setMode("mcp");
						setCopied(false);
						setPmOpen(false);
					}}
					className={cn(
						"px-4 py-2 text-[12px] transition-colors duration-150 relative",
						mode === "mcp"
							? "text-neutral-800 dark:text-neutral-200"
							: "text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-400",
					)}
				>
					MCP
					{mode === "mcp" && (
						<div className="absolute bottom-0 left-4 right-4 h-[1.5px] bg-neutral-600 dark:bg-neutral-400" />
					)}
				</button>
				<button
					onClick={() => {
						setMode("sdk");
						setCopied(false);
						setPmOpen(false);
					}}
					className={cn(
						"px-4 py-2 text-[12px] transition-colors duration-150 relative",
						mode === "sdk"
							? "text-neutral-800 dark:text-neutral-200"
							: "text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-400",
					)}
				>
					SDK
					{mode === "sdk" && (
						<div className="absolute bottom-0 left-4 right-4 h-[1.5px] bg-neutral-600 dark:bg-neutral-400" />
					)}
				</button>
			</div>

			{/* Content */}
			<motion.div
				animate={{ height: contentHeight }}
				initial={false}
				transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
				onAnimationComplete={() => setOverflow("visible")}
				style={{ overflow }}
			>
				<div ref={contentRef}>
					<AnimatePresence mode="wait" initial={false}>
						<div>
							{mode === "cli" || mode === "sdk" ? (
								<div className="flex items-center justify-between bg-neutral-100/50 dark:bg-[#050505] px-4 py-3">
									<code
										className="text-[13px]"
										style={{ fontFamily: "var(--font-geist-pixel-square)" }}
									>
										{mode === "sdk" ? (
											<>
												<span className="text-purple-600/90 dark:text-purple-400/90">
													npm
												</span>{" "}
												<span className="text-neutral-700 dark:text-neutral-300">
													install @jkt48connect-corp/sdk
												</span>
											</>
										) : (
											<>
												<span className="text-purple-600/90 dark:text-purple-400/90">
													npx
												</span>{" "}
												<span className="text-neutral-700 dark:text-neutral-300">
													jkt48connect init
												</span>
											</>
										)}
									</code>
									<div className="relative">
										{mode === "sdk" ? (
											<button
												onClick={() =>
													copy("npm install @jkt48connect-corp/sdk")
												}
												className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors p-1"
												aria-label="Copy command"
											>
												{copied ? (
													<svg
														xmlns="http://www.w3.org/2000/svg"
														viewBox="0 0 24 24"
														className="h-4 w-4"
													>
														<path
															fill="currentColor"
															d="M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41z"
														/>
													</svg>
												) : (
													<svg
														xmlns="http://www.w3.org/2000/svg"
														viewBox="0 0 24 24"
														className="h-4 w-4"
													>
														<path
															fill="currentColor"
															d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2m0 16H8V7h11z"
														/>
													</svg>
												)}
											</button>
										) : (
											<>
												<button
													onClick={() => {
														if (copied) return;
														setPmOpen(!pmOpen);
													}}
													className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors p-1"
													aria-label="Copy command"
												>
													{copied ? (
														<svg
															xmlns="http://www.w3.org/2000/svg"
															viewBox="0 0 24 24"
															className="h-4 w-4"
														>
															<path
																fill="currentColor"
																d="M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41z"
															/>
														</svg>
													) : (
														<svg
															xmlns="http://www.w3.org/2000/svg"
															viewBox="0 0 24 24"
															className="h-4 w-4"
														>
															<path
																fill="currentColor"
																d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2m0 16H8V7h11z"
															/>
														</svg>
													)}
												</button>
												{pmOpen && (
													<>
														<div
															className="fixed inset-0 z-40"
															role="button"
															tabIndex={-1}
															aria-label="Close dropdown"
															onClick={() => setPmOpen(false)}
															onKeyDown={(e) => {
																if (e.key === "Escape") setPmOpen(false);
															}}
														/>
														<div className="absolute right-0 top-full mt-2 w-[180px] bg-white dark:bg-[#050505] border border-neutral-200 dark:border-white/[0.07] shadow-2xl shadow-black/10 dark:shadow-black/80 z-50 rounded-sm">
															{cliCommands.map((pm, i) => (
																<button
																	key={pm.name}
																	onClick={() => copy(pm.command)}
																	className={cn(
																		"flex items-center gap-2.5 w-full px-3 py-2 text-[12px] text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.05] transition-all text-left",
																		i < cliCommands.length - 1 &&
																			"border-b border-neutral-100 dark:border-white/[0.06]",
																	)}
																>
																	<span className="font-mono text-[11px]">
																		{pm.name}
																	</span>
																	<span className="font-mono text-[10px] text-neutral-400 dark:text-neutral-500 ml-auto">
																		{pm.command}
																	</span>
																</button>
															))}
														</div>
													</>
												)}
											</>
										)}
									</div>
								</div>
							) : mode === "mcp" ? (
								<div className="flex items-center justify-between bg-neutral-100/50 dark:bg-[#050505] px-4 py-3">
									<code
										className="text-[13px] truncate"
										style={{ fontFamily: "var(--font-geist-pixel-square)" }}
									>
										<span className="text-purple-600/90 dark:text-purple-400/90">
											claude
										</span>{" "}
										<span className="text-neutral-700 dark:text-neutral-300">
											mcp add jkt48connect
										</span>
									</code>
									<div className="relative">
										<button
											onClick={() => {
												if (copied) return;
												setPmOpen(!pmOpen);
											}}
											className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors p-1"
											aria-label="Add MCP"
										>
											{copied ? (
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													className="h-4 w-4"
												>
													<path
														fill="currentColor"
														d="M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41z"
													/>
												</svg>
											) : (
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													className="h-4 w-4"
												>
													<path
														fill="currentColor"
														d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"
													/>
												</svg>
											)}
										</button>
										{pmOpen && (
											<>
												<div
													className="fixed inset-0 z-40"
													role="button"
													tabIndex={-1}
													aria-label="Close dropdown"
													onClick={() => setPmOpen(false)}
													onKeyDown={(e) => {
														if (e.key === "Escape") setPmOpen(false);
													}}
												/>
												<div className="absolute right-0 top-full mt-2 w-[180px] bg-white dark:bg-[#050505] border border-neutral-200 dark:border-white/[0.07] shadow-2xl shadow-black/10 dark:shadow-black/80 z-50 rounded-sm">
													{mcpCommands.map((mc, i) => (
														<button
															key={mc.name}
															onClick={() => copy(mc.command)}
															className={cn(
																"flex items-center gap-2.5 w-full px-3 py-2 text-[12px] text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.05] transition-all text-left",
																i < mcpCommands.length - 1 &&
																	"border-b border-neutral-100 dark:border-white/[0.06]",
															)}
														>
															<span className="font-mono text-[11px]">
																{mc.name}
															</span>
														</button>
													))}
												</div>
											</>
										)}
									</div>
								</div>
							) : (
								<div className="bg-neutral-100/50 dark:bg-[#050505] px-5 py-4">
									<p className="text-[13px] font-medium text-neutral-700 dark:text-neutral-200 leading-relaxed">
										Integrasikan JKT48Connect API ke dalam proyekmu.
									</p>
									<div className="relative mt-1.5">
										<p className="text-[11px] text-neutral-400 dark:text-neutral-500 leading-relaxed line-clamp-2">
											Install SDK, setup API key, akses data member, jadwal
											teater, live stream, dan berita JKT48 langsung dari
											kode kamu...
										</p>
										<div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-neutral-100/50 dark:from-[#050505] to-transparent pointer-events-none" />
									</div>
									<div className="flex items-center justify-between mt-3 pt-2 border-t border-foreground/[0.04]">
										<button
											onClick={() => setPromptOpen(true)}
											className="flex items-center gap-1 text-[11px] text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 24 24"
												className="h-3 w-3"
											>
												<path
													fill="currentColor"
													d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5s5 2.24 5 5s-2.24 5-5 5m0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3s3-1.34 3-3s-1.34-3-3-3"
												/>
											</svg>
											Lihat prompt lengkap
										</button>
										<button
											onClick={() => copy(aiPromptText)}
											className="flex items-center gap-1.5 text-[11px] text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
										>
											{copied ? (
												<>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														viewBox="0 0 24 24"
														className="h-3.5 w-3.5"
													>
														<path
															fill="currentColor"
															d="M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41z"
														/>
													</svg>
													Disalin
												</>
											) : (
												<>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														viewBox="0 0 24 24"
														className="h-3.5 w-3.5"
													>
														<path
															fill="currentColor"
															d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2m0 16H8V7h11z"
														/>
													</svg>
													Salin prompt
												</>
											)}
										</button>
									</div>
								</div>
							)}
						</div>
					</AnimatePresence>
				</div>
			</motion.div>

			{/* Prompt dialog */}
			<AnimatePresence>
				{promptOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-0 lg:left-[40%] z-50 flex items-center justify-center"
						onClick={() => setPromptOpen(false)}
					>
						<div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm" />

						<motion.div
							initial={{ opacity: 0, y: 8, scale: 0.98 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: 8, scale: 0.98 }}
							transition={{ duration: 0.2, ease: "easeOut" }}
							onClick={(e) => e.stopPropagation()}
							className="relative w-[calc(100%-2rem)] max-w-lg mx-4 bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-white/[0.06] rounded-sm shadow-2xl"
						>
							<button
								onClick={() => setPromptOpen(false)}
								className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors z-10"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									className="h-4 w-4"
								>
									<path
										fill="currentColor"
										d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"
									/>
								</svg>
							</button>

							<div className="px-5 py-5 max-h-[60vh] overflow-y-auto">
								<p className="text-[12px] font-mono text-neutral-600 dark:text-neutral-400 leading-[1.9] whitespace-pre-line">
									{aiPromptText}
								</p>
							</div>

							<div className="flex justify-end px-5 py-3 border-t border-neutral-200 dark:border-white/[0.06]">
								<button
									onClick={() => copy(aiPromptText)}
									className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] rounded-sm border border-neutral-200 dark:border-white/[0.08] text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/[0.04] transition-colors"
								>
									{copied ? (
										<>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 24 24"
												className="h-3.5 w-3.5"
											>
												<path
													fill="currentColor"
													d="M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41z"
												/>
											</svg>
											Disalin
										</>
									) : (
										<>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 24 24"
												className="h-3.5 w-3.5"
											>
												<path
													fill="currentColor"
													d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2m0 16H8V7h11z"
												/>
											</svg>
											Salin prompt
										</>
									)}
								</button>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

// ============================================================
// Live stream monitor — menggantikan SentinelSection
// ============================================================
const liveEvents = [
	{
		action: "Live",
		color: "bg-green-500",
		member: "Delynn",
		platform: "IDN Live",
		viewers: "4,821",
		duration: "1:24:07",
		time: "Sekarang",
	},
	{
		action: "Live",
		color: "bg-green-500",
		member: "Aralie Abigail",
		platform: "Showroom",
		viewers: "3,102",
		duration: "0:47:33",
		time: "Sekarang",
	},
	{
		action: "Selesai",
		color: "bg-neutral-400",
		member: "Freya Jayawardana",
		platform: "IDN Live",
		viewers: "12,450",
		duration: "2:10:00",
		time: "2 jam lalu",
	},
	{
		action: "Selesai",
		color: "bg-neutral-400",
		member: "Gracia",
		platform: "Showroom",
		viewers: "5,320",
		duration: "1:05:14",
		time: "4 jam lalu",
	},
	{
		action: "Jadwal",
		color: "bg-amber-400",
		member: "Team J",
		platform: "Teater fX Sudirman",
		viewers: "—",
		duration: "19:00 WIB",
		time: "Hari ini",
	},
];

function LiveMonitorSection() {
	return (
		<div className="mt-10 mb-4">
			<div className="flex items-center gap-3 mb-6">
				<span className="text-[10px] text-foreground/60 dark:text-foreground/40 font-mono tracking-wider uppercase shrink-0">
					Live Monitor
				</span>
				<div className="flex-1 border-t border-foreground/[0.06]" />
			</div>

			<div className="mb-5">
				<h3 className="text-base sm:text-lg text-neutral-800 dark:text-neutral-200 leading-snug mb-2">
					Pantau aktivitas JKT48 secara real-time.
				</h3>
				<p className="text-[14px] text-foreground/70 dark:text-foreground/55 leading-relaxed max-w-2xl">
					Track live stream IDN Live & Showroom, jadwal teater, jumlah penonton,
					dan notifikasi event — semua terupdate otomatis setiap saat.
				</p>
			</div>

			<div className="relative group/live">
				<div className="absolute -inset-2 sm:-inset-3 border-t border-dashed border-foreground/[0.08] pointer-events-none" />
				<div
					className="absolute -top-2 sm:-top-3 -bottom-2 sm:-bottom-3 -left-2 sm:-left-3 w-px border-l border-dashed border-foreground/[0.08] pointer-events-none"
					style={{
						maskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
						WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
					}}
				/>
				<div
					className="absolute -top-2 sm:-top-3 -bottom-2 sm:-bottom-3 -right-2 sm:-right-3 w-px border-r border-dashed border-foreground/[0.08] pointer-events-none"
					style={{
						maskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
						WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
					}}
				/>
				<span className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 text-[8px] font-mono text-foreground/20 select-none pointer-events-none -translate-x-0.5 -translate-y-0.5">
					&#x250C;
				</span>
				<span className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 text-[8px] font-mono text-foreground/20 select-none pointer-events-none translate-x-0.5 -translate-y-0.5">
					&#x2510;
				</span>

				<div
					className="relative overflow-hidden border-t border-x border-foreground/[0.1]"
					style={{
						maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
						WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
					}}
				>
					{/* Header bar */}
					<div className="flex items-center justify-between px-4 py-2.5 bg-foreground/[0.02] border-b border-foreground/[0.08]">
						<div className="flex items-center gap-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="text-foreground/50 dark:text-foreground/35"
							>
								<circle cx="12" cy="12" r="2" />
								<path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" />
							</svg>
							<span className="text-[11px] font-medium text-foreground/60 dark:text-foreground/45">
								Live Monitor
							</span>
							<span className="text-[10px] font-mono text-foreground/50 ml-1">
								Update otomatis setiap menit
							</span>
						</div>
						<div className="hidden sm:flex items-center gap-3">
							<span className="flex items-center gap-1.5 text-[9px] font-mono">
								<span className="size-1.5 rounded-full bg-green-500 animate-pulse" />
								<span className="text-foreground/50 dark:text-foreground/35">Live</span>
								<span className="text-foreground/70 dark:text-foreground/50">2</span>
							</span>
							<span className="flex items-center gap-1.5 text-[9px] font-mono">
								<span className="size-1.5 rounded-full bg-amber-400" />
								<span className="text-foreground/50 dark:text-foreground/35">Jadwal</span>
								<span className="text-foreground/70 dark:text-foreground/50">1</span>
							</span>
							<span className="flex items-center gap-1.5 text-[9px] font-mono">
								<span className="size-1.5 rounded-full bg-neutral-400" />
								<span className="text-foreground/50 dark:text-foreground/35">Selesai</span>
								<span className="text-foreground/70 dark:text-foreground/50">2</span>
							</span>
						</div>
					</div>

					{/* Table header */}
					<div className="grid grid-cols-[70px_1fr_100px_80px_80px] sm:grid-cols-[70px_1fr_120px_90px_70px_80px] gap-0 px-4 py-2 border-b border-foreground/[0.06] bg-foreground/[0.01]">
						<span className="text-[9px] font-mono uppercase tracking-wider text-foreground/35 dark:text-foreground/50">Status</span>
						<span className="text-[9px] font-mono uppercase tracking-wider text-foreground/35 dark:text-foreground/50">Member</span>
						<span className="text-[9px] font-mono uppercase tracking-wider text-foreground/35 dark:text-foreground/50">Platform</span>
						<span className="hidden sm:block text-[9px] font-mono uppercase tracking-wider text-foreground/35 dark:text-foreground/50">Penonton</span>
						<span className="text-[9px] font-mono uppercase tracking-wider text-foreground/35 dark:text-foreground/50">Durasi</span>
						<span className="text-[9px] font-mono uppercase tracking-wider text-foreground/35 dark:text-foreground/50 text-right">Waktu</span>
					</div>

					{/* Event rows */}
					{liveEvents.map((event) => (
						<div
							key={`${event.member}-${event.time}`}
							className="grid grid-cols-[70px_1fr_100px_80px_80px] sm:grid-cols-[70px_1fr_120px_90px_70px_80px] gap-0 px-4 py-2.5 border-b border-dashed border-foreground/[0.04] hover:bg-foreground/[0.02] transition-colors"
						>
							<span className="flex items-center gap-1.5">
								<span className={cn("size-1.5 rounded-full shrink-0", event.color)} />
								<span className={cn(
									"text-[10px] font-mono",
									event.action === "Live"
										? "text-green-500/80 dark:text-green-400/70"
										: event.action === "Jadwal"
										? "text-amber-500/80 dark:text-amber-400/70"
										: "text-foreground/40",
								)}>
									{event.action}
								</span>
							</span>
							<span className="text-[10px] font-mono text-foreground/60 dark:text-foreground/45 truncate pr-2">
								{event.member}
							</span>
							<span className="text-[10px] font-mono text-foreground/40 dark:text-foreground/30 truncate">
								{event.platform}
							</span>
							<span className="hidden sm:block text-[10px] font-mono text-foreground/35 dark:text-foreground/50 truncate">
								{event.viewers}
							</span>
							<span className="text-[10px] font-mono text-foreground/35 dark:text-foreground/50 truncate">
								{event.duration}
							</span>
							<span className="text-[10px] font-mono text-foreground/30 dark:text-foreground/20 text-right">
								{event.time}
							</span>
						</div>
					))}
				</div>
			</div>

			{/* Feature tags */}
			<div className="flex flex-wrap gap-1.5 mt-4">
				{(
					[
						{ tag: "IDN Live", icon: (<><path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z" /></>) },
						{ tag: "Showroom", icon: (<><circle cx="12" cy="12" r="10" /><path d="m10 8 6 4-6 4V8z" /></>) },
						{ tag: "Jadwal Teater", icon: (<><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></>) },
						{ tag: "Notifikasi Live", icon: (<><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>) },
						{ tag: "Jumlah Penonton", icon: (<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>) },
						{ tag: "Setlist Lagu", icon: (<><line x1="8" x2="21" y1="6" y2="6" /><line x1="8" x2="21" y1="12" y2="12" /><line x1="8" x2="21" y1="18" y2="18" /><line x1="3" x2="3.01" y1="6" y2="6" /><line x1="3" x2="3.01" y1="12" y2="12" /><line x1="3" x2="3.01" y1="18" y2="18" /></>) },
						{ tag: "Data Member", icon: (<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>) },
						{ tag: "Berita & Event", icon: (<><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" /><path d="M18 14h-8" /><path d="M15 18h-5" /><path d="M10 6h8v4h-8V6Z" /></>) },
						{ tag: "Generasi Member", icon: (<><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></>) },
						{ tag: "Handshake Event", icon: (<><path d="m11 17 2 2a1 1 0 1 0 3-3" /><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" /><path d="m21 3 1 11h-1" /><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" /></>) },
					] as const
				).map(({ tag, icon }) => (
					<span
						key={tag}
						className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-foreground/70 dark:text-foreground/55 border border-foreground/[0.14] bg-foreground/[0.03] hover:bg-foreground/[0.06] hover:text-foreground/85 dark:hover:text-foreground/75 transition-colors"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="10"
							height="10"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="opacity-80 shrink-0"
						>
							{icon}
						</svg>
						{tag}
					</span>
				))}
			</div>
		</div>
	);
}

const EMPTY_CONTRIBUTORS: ContributorInfo[] = [];

type CommunityHeroStats = {
	npmDownloads: number;
	githubStars: number;
	contributors: number;
};

function ContributorsSection({
	contributors = EMPTY_CONTRIBUTORS,
	contributorCount,
}: {
	contributors: ContributorInfo[];
	contributorCount: number;
}) {
	if (contributors.length === 0) return null;

	const colCount = 18;
	const columns = Array.from({ length: colCount }, (_, i) => {
		const perCol = Math.ceil(contributors.length / colCount);
		return contributors.slice(i * perCol, (i + 1) * perCol);
	});

	const speeds = [
		160, 190, 140, 176, 150, 184, 164, 144, 180, 156, 170, 136, 186, 152, 174,
		146, 182, 158,
	];

	return (
		<div className="mt-10 pt-8">
			<div className="flex items-center gap-3 mb-2">
				<span className="text-base text-foreground/85 dark:text-foreground/75">
					Contributors
				</span>
				<div className="h-px flex-1 bg-foreground/[0.08]" />
			</div>
			<p className="text-[13px] text-foreground/50 dark:text-foreground/40 mb-5 leading-relaxed">
				Dibangun oleh komunitas{" "}
				<span className="text-foreground/70 dark:text-foreground/60 font-medium tabular-nums">
					{contributorCount}+
				</span>{" "}
				kontributor.
			</p>

			{contributors.length > 0 && (
				<div
					className="relative overflow-hidden h-[220px] rounded-md"
					style={{
						perspective: "600px",
						maskImage:
							"linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
						WebkitMaskImage:
							"linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
					}}
				>
					<div
						className="absolute inset-0 pointer-events-none"
						style={{
							backgroundImage:
								"radial-gradient(circle, currentColor 0.5px, transparent 0.5px)",
							backgroundSize: "12px 12px",
							opacity: 0.04,
						}}
					/>
					<div
						className="grid h-full relative"
						style={{
							gridTemplateColumns: `repeat(${colCount}, 1fr)`,
							transform: "rotateX(18deg)",
							transformOrigin: "center center",
						}}
					>
						{columns.map((col, i) => (
							<div key={i} className="relative overflow-hidden h-full">
								<div
									className="flex flex-col gap-1 items-center"
									style={{
										animation: `vertical-marquee ${speeds[i]}s linear infinite`,
									}}
								>
									{[...col, ...col].map((c, j) => (
										<a
											key={`${c.login}-${j}`}
											href={c.html_url}
											target="_blank"
											rel="noopener noreferrer"
											title={c.login}
											className="relative group shrink-0"
										>
											<img
												src={`${c.avatar_url}&s=64`}
												alt={c.login}
												width={32}
												height={32}
												loading="lazy"
												className="rounded-sm grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-200 hover:scale-125 hover:z-10 relative"
											/>
											<div className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-foreground text-background text-[8px] font-mono rounded-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
												{c.login}
											</div>
										</a>
									))}
								</div>
							</div>
						))}
					</div>
					<div className="absolute inset-y-0 left-0 w-8 bg-linear-to-r from-background to-transparent pointer-events-none z-10" />
					<div className="absolute inset-y-0 right-0 w-8 bg-linear-to-l from-background to-transparent pointer-events-none z-10" />
				</div>
			)}
		</div>
	);
}

function formatCount(num: number | null | undefined): string {
	if (num == null) return "—";
	if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
	if (num >= 1_000) return `${(num / 1_000).toFixed(num >= 10_000 ? 0 : 1)}k`;
	return num.toString();
}

const footerLinks = [
	{ label: "Docs", href: "/docs" },
	{ label: "Pricing", href: "/pricing" },
	{ label: "Articles", href: "/articles" },
	{ label: "Community", href: "/community" },
	{ label: "Changelog", href: "/changelog" },
];

function ReadmeFooter({ stats }: { stats: CommunityHeroStats }) {
	return (
		<div className="relative mt-10 pt-8 pb-0 overflow-hidden">
			<div
				className="absolute -right-10 top-1/2 -translate-y-1/2 pointer-events-none select-none opacity-[0.03] dark:opacity-[0.04]"
				aria-hidden="true"
			>
				<svg
					width="300"
					height="225"
					viewBox="0 0 60 45"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M0 0H15V15H30V30H15V45H0V30V15V0ZM45 30V15H30V0H45H60V15V30V45H45H30V30H45Z"
						className="fill-foreground"
					/>
				</svg>
			</div>

			<div
				className="absolute inset-0 pointer-events-none select-none"
				aria-hidden="true"
				style={{
					backgroundImage:
						"radial-gradient(circle, currentColor 0.5px, transparent 0.5px)",
					backgroundSize: "24px 24px",
					opacity: 0.03,
				}}
			/>

			<div className="relative space-y-6">
				<p className="text-center text-lg text-balance text-foreground/60 dark:text-foreground/50 tracking-tight">
					Akses data JKT48 lengkap dalam hitungan menit.
				</p>

				<div className="flex items-center justify-center gap-2">
					{stats.npmDownloads > 0 && (
						<a
							href="https://www.npmjs.com/package/@jkt48connect-corp/sdk"
							target="_blank"
							rel="noopener noreferrer"
						>
							<div className="flex items-center gap-1.5 px-2.5 hover:bg-foreground/4 rounded-sm transition-colors text-foreground/50 dark:text-foreground/50">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="11"
									height="11"
									viewBox="0 0 24 24"
									fill="currentColor"
								>
									<path
										d="M0 0v24h24V0H0zm6.168 20.16H3.84V7.68h2.328v12.48zm6.168 0H6.168V7.68H16.5v12.48h-2.328V9.84h-1.836v10.32zm8.16 0h-6.168V7.68H20.16v12.48h-2.16V9.84h-1.836v10.32z"
										transform="scale(0.9) translate(1.3, 1.3)"
									/>
								</svg>
								<span className="text-xs font-mono">
									{formatCount(stats.npmDownloads)} / tahun
								</span>
							</div>
						</a>
					)}
					{stats.githubStars > 0 && (
						<a
							href="https://github.com/JKT48Connect"
							target="_blank"
							rel="noopener noreferrer"
						>
							<div className="flex items-center gap-1.5 px-2.5 hover:bg-foreground/4 rounded-sm transition-colors text-foreground/50 dark:text-foreground/50">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="11"
									height="11"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
								</svg>
								<span className="text-xs font-mono">
									{formatCount(stats.githubStars)} stars
								</span>
							</div>
						</a>
					)}
				</div>

				<div className="flex items-center justify-center gap-2">
					<Link
						href="/docs"
						className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 bg-neutral-900 text-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 text-xs sm:text-sm font-medium hover:opacity-90 transition-colors"
					>
						Mulai Sekarang
					</Link>
					<Link
						href="https://docs.jkt48connect.com"
						className="relative inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 text-neutral-600 dark:text-neutral-300 text-xs sm:text-sm font-medium transition-colors group"
					>
						<span
							className="absolute inset-0 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity"
							style={{
								backgroundImage: `repeating-linear-gradient(
                  -45deg,
                  transparent,
                  transparent 4px,
                  currentColor 4px,
                  currentColor 5px
                )`,
							}}
						/>
						<span className="absolute top-0 -left-[6px] -right-[6px] h-px bg-foreground/20 group-hover:bg-foreground/30 transition-colors" />
						<span className="absolute bottom-0 -left-[6px] -right-[6px] h-px bg-foreground/20 group-hover:bg-foreground/30 transition-colors" />
						<span className="absolute left-0 -top-[6px] -bottom-[6px] w-px bg-foreground/20 group-hover:bg-foreground/30 transition-colors" />
						<span className="absolute right-0 -top-[6px] -bottom-[6px] w-px bg-foreground/20 group-hover:bg-foreground/30 transition-colors" />
						<span className="absolute -bottom-[6px] -right-[6px] font-mono text-[8px] text-foreground/40 dark:text-foreground/50 leading-none select-none translate-x-1/2 translate-y-1/2">
							+
						</span>
						<span className="relative">Dokumentasi</span>
					</Link>
				</div>
			</div>

			{/* Footer */}
			<div className="relative mt-10 pt-14">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div className="flex flex-wrap items-center gap-x-1 gap-y-1.5">
						{footerLinks.map((link, i) => (
							<span key={link.label} className="flex items-center">
								<Link
									href={link.href}
									className="group inline-flex items-center gap-1 text-[11px] font-mono text-foreground/50 hover:text-foreground/80 transition-colors"
								>
									{link.label}
								</Link>
								{i < footerLinks.length - 1 && (
									<span className="text-foreground/10 mx-1 text-[10px] select-none">
										/
									</span>
								)}
							</span>
						))}
					</div>

					<div className="flex items-center justify-between w-full sm:w-auto sm:gap-4 shrink-0">
						<span className="text-[10px] text-foreground/50 font-mono">
							© {new Date().getFullYear()} JKT48Connect
						</span>
						<div className="flex items-center gap-3 sm:gap-4">
							<span className="text-foreground/10 select-none hidden sm:inline">·</span>
							<Link
								href="https://x.com/jkt48connect"
								aria-label="Twitter/X"
								className="text-foreground/50 hover:text-foreground/80 transition-colors"
							>
								<Icons.XIcon className="h-3.5 w-3.5" />
							</Link>
							<Link
								href="https://github.com/JKT48Connect"
								aria-label="GitHub"
								className="text-foreground/50 hover:text-foreground/80 transition-colors"
							>
								<Icons.gitHub className="h-3.5 w-3.5" />
							</Link>
							<div className="h-4 w-4 flex text-foreground/15 items-center justify-center select-none">|</div>
							<div className="-ml-4 sm:-ml-5">
								<ThemeToggle />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export function HeroReadMe({
	contributors,
	stats,
}: {
	contributors: ContributorInfo[];
	stats: CommunityHeroStats;
}) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
			className="flex flex-col w-full"
		>
			<div className="flex-1 overflow-x-hidden no-scrollbar">
				<div className="p-5 lg:px-8 lg:pt-20">
					<motion.article
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.4, delay: 0.3 }}
						className="overflow-x-hidden no-scrollbar pb-0"
					>
						<h1 className="flex items-center gap-3 text-sm sm:text-[15px] font-mono text-neutral-900 dark:text-neutral-100 mb-4 sm:mb-5">
							README
							<span className="flex-1 h-px bg-foreground/15" />
						</h1>

						<p className="text-sm sm:text-[15px] text-foreground/80 mb-6 sm:mb-8 leading-relaxed">
							JKT48Connect adalah platform data JKT48 all-in-one untuk developer.
							Akses profil member, jadwal teater, live stream, berita, dan event
							secara real-time — semuanya melalui satu API yang terpusat, aktif
							dikelola, dan tersedia gratis untuk memulai.
						</p>

						<InstallBlock />

						<div className="flex items-center gap-3 my-4">
							<div className="flex-1 border-t border-foreground/6"></div>
							<span className="text-[10px] text-foreground/50 dark:text-foreground/50 font-mono tracking-wider uppercase shrink-0">
								Trusted By
							</span>
						</div>

						{/* TrustedBy tidak diubah */}
						<TrustedBy />

						<div className="flex items-center gap-3 my-4">
							<span className="text-[10px] text-foreground/50 dark:text-foreground/50 font-mono tracking-wider uppercase shrink-0">
								Fitur
							</span>
							<div className="flex-1 border-t border-foreground/10"></div>
						</div>

						<div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mb-2 border border-foreground/[0.08] overflow-hidden">
							{[
								{
									label: "Member Data",
									headline: "Profil lengkap semua member.",
									desc: "Nama, generasi, tanggal lahir, media sosial, dan foto — semuanya dalam satu endpoint.",
									href: "/docs/members",
								},
								{
									label: "Jadwal Teater",
									headline: "Jadwal show real-time.",
									desc: "Tim, tanggal, setlist, dan senbatsu — selalu ter-update sesuai jadwal resmi.",
									apikey: true,
									href: "/docs/theater",
								},
								{
									label: "Live Streaming",
									headline: "IDN Live & Showroom.",
									desc: "Pantau stream aktif, jumlah penonton, dan dapatkan notifikasi ketika oshi kamu mulai live.",
									href: "/docs/live",
								},
								{
									label: "Berita & Event",
									headline: "Semua update JKT48.",
									desc: "Berita resmi, pengumuman, handshake event, dan off-air show dalam satu feed.",
									href: "/docs/news",
								},
								{
									label: "Node.js SDK",
									headline: "Siap pakai di proyek kamu.",
									desc: "Package npm dengan TypeScript support penuh. Dokumentasi lengkap, mudah diintegrasikan.",
									href: "/docs/sdk",
								},
								{
									label: "REST API",
									headline: "Gunakan bahasa apapun.",
									desc: "API key gratis, endpoint konsisten, response JSON bersih — kompatibel dengan semua stack.",
									href: "/docs/api",
								},
								{
									label: "Priority Token",
									headline: "Akses lebih cepat & stabil.",
									desc: "Token khusus untuk rate limit lebih tinggi, cocok untuk aplikasi produksi dan fanbase resmi.",
									href: "/pricing",
								},
								{
									label: "Community Driven",
									headline: "Open-source & aktif.",
									desc: "Dikelola oleh komunitas fans JKT48, tersedia di GitHub, dan terbuka untuk kontribusi.",
									href: "https://github.com/JKT48Connect",
								},
								{
									label: "Indonesia Hosted",
									headline: "Latensi rendah, lokal.",
									desc: "Server di Indonesia untuk performa terbaik bagi pengguna dan developer lokal.",
									href: "/docs",
								},
							].map((feature, i) => (
								<Link
									key={feature.label}
									href={"href" in feature ? feature.href : "#"}
									className="contents"
								>
									<motion.div
										whileHover={{
											y: -2,
											transition: { duration: 0.2, ease: "easeOut" },
										}}
										className={cn(
											"group/card relative p-4 lg:p-5 border-foreground/[0.08] min-h-[160px] transition-all duration-200 hover:bg-foreground/[0.02] hover:shadow-[inset_0_1px_0_0_rgba(128,128,128,0.1)] hover:z-10",
											i < 8 && "border-b",
											i >= 6 && "md:border-b-0",
											i % 2 === 0 && i < 8 && "sm:border-r",
											i % 3 === 2 && "md:border-r-0",
											i % 2 !== 0 && i % 3 !== 2 && "md:border-r",
										)}
									>
										<span className="absolute top-3 right-3 lg:top-4 lg:right-4 opacity-0 -translate-y-0.5 group-hover/card:opacity-100 group-hover/card:translate-y-0 transition-all duration-200">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="16"
												height="16"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												className="text-foreground/40 dark:text-foreground/50"
											>
												<line x1="7" y1="17" x2="17" y2="7" />
												<polyline points="7 7 17 7 17 17" />
											</svg>
										</span>
										<div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 mb-2 uppercase tracking-wider">
											<span className="text-foreground/45 dark:text-foreground/30 mr-1.5">
												{String(i + 1).padStart(2, "0")}
											</span>
											{feature.label}
										</div>
										<div className="text-[13px] font-semibold text-neutral-900 dark:text-neutral-100 leading-snug mb-1.5">
											{feature.headline}
										</div>
										<div className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
											{feature.desc}
										</div>
										{"apikey" in feature && feature.apikey && (
											<ApiKeyFields />
										)}
									</motion.div>
								</Link>
							))}
						</div>

						<div className="my-6">
							<div className="flex items-center gap-3 mb-5">
								<span className="text-[10px] text-foreground/50 dark:text-foreground/50 font-mono tracking-wider uppercase shrink-0">
									Konfigurasi
								</span>
								<div className="flex-1 border-t border-foreground/10" />
							</div>
							<ServerClientTabs />
						</div>

						{/* Endpoint */}
						<div className="my-8">
							<DatabaseSection />
						</div>

						<AiNativeSection />

						<div className="flex items-center gap-3 mt-8 mb-5">
							<span className="text-base text-foreground/85 dark:text-foreground/75">
								Data Member
							</span>
							<div className="h-px flex-1 bg-foreground/[0.08]" />
						</div>

						<SocialProvidersSection />

						<div className="mt-8">
							<PluginEcosystem />
						</div>

						{/* Platform section */}
						<div className="mt-16 mb-8">
							<div className="flex items-center gap-4">
								<span className="text-lg sm:text-xl font-medium text-foreground/90 dark:text-foreground/80 tracking-tight shrink-0">
									Platform
								</span>
								<div className="flex-1 border-t border-foreground/10" />
							</div>
							<p className="text-[12px] sm:text-[13px] text-neutral-500 dark:text-neutral-400 leading-relaxed mt-2 max-w-xl">
								Fitur tambahan di atas API gratis — untuk kebutuhan fanbase dan developer serius.
							</p>
						</div>

						{/* Dashboard */}
						<div className="mt-10 mb-4">
							<div className="mb-5">
								<h3 className="text-base sm:text-lg text-neutral-800 dark:text-neutral-200 leading-snug mb-2">
									Dashboard pemantauan data JKT48.
								</h3>
								<p className="text-[12px] sm:text-[13px] text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-2xl">
									Pantau aktivitas member, track live stream, lihat jadwal teater,
									dan kelola API key kamu — semua dalam satu dashboard yang mudah digunakan.
								</p>
							</div>

							{/* Feature callouts */}
							<div className="grid grid-cols-2 sm:grid-cols-4 mt-3">
								{[
									{ label: "Member Tracker", desc: "Aktivitas & jadwal" },
									{ label: "Live Monitor", desc: "Stream real-time" },
									{ label: "API Key Manager", desc: "Kelola akses" },
									{ label: "Usage Analytics", desc: "Statistik penggunaan" },
								].map((item, i) => (
									<div
										key={item.label}
										className={cn(
											"px-3 py-3 border border-dashed border-foreground/[0.06] bg-foreground/[0.02]",
											i > 0 && "-ml-px",
										)}
									>
										<div className="text-[11px] font-mono text-foreground/65 dark:text-foreground/50 uppercase tracking-wider mb-0.5">
											{item.label}
										</div>
										<div className="text-[11px] font-mono text-foreground/40 dark:text-foreground/28">
											{item.desc}
										</div>
									</div>
								))}
							</div>

							{/* Webhook & Notifikasi */}
							<div className="mt-10">
								<div className="mb-4">
									<h3 className="text-base sm:text-lg text-neutral-800 dark:text-neutral-200 leading-snug mb-2">
										Webhook & Notifikasi
									</h3>
									<p className="text-[12px] sm:text-[13px] text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-2xl">
										Terima notifikasi otomatis ketika member mulai live, jadwal
										teater diperbarui, atau event baru diumumkan. Kirim ke
										Discord, Telegram, atau endpoint kustom kamu.
									</p>
								</div>
								<div className="grid grid-cols-2 sm:grid-cols-4 gap-0">
									{[
										{ label: "Live Alert", desc: "Notif saat member live" },
										{ label: "Theater Update", desc: "Perubahan jadwal" },
										{ label: "Event Alert", desc: "Pengumuman & event" },
										{ label: "Custom Webhook", desc: "Endpoint bebas" },
									].map((item, i) => (
										<div
											key={item.label}
											className={cn(
												"px-3 py-3 border border-dashed border-foreground/[0.06] bg-foreground/[0.02]",
												i > 0 && "-ml-px",
											)}
										>
											<div className="text-[11px] font-mono text-foreground/65 dark:text-foreground/50 uppercase tracking-wider mb-0.5">
												{item.label}
											</div>
											<div className="text-[11px] font-mono text-foreground/40 dark:text-foreground/28">
												{item.desc}
											</div>
										</div>
									))}
								</div>
							</div>

							{/* Priority Access */}
							<div className="mt-10">
								<div className="mb-4">
									<h3 className="text-base sm:text-lg text-neutral-800 dark:text-neutral-200 leading-snug mb-2">
										Priority Token
									</h3>
									<p className="text-[12px] sm:text-[13px] text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-2xl">
										Dapatkan token khusus dengan rate limit lebih tinggi, akses
										prioritas ke endpoint eksklusif, dan dukungan langsung dari
										tim JKT48Connect — cocok untuk fanbase resmi dan aplikasi produksi.
									</p>
								</div>
								<div className="grid grid-cols-2 sm:grid-cols-4 gap-0">
									{[
										{ label: "Rate Limit Tinggi", desc: "Lebih banyak request" },
										{ label: "Endpoint Eksklusif", desc: "Data premium" },
										{ label: "Dukungan Langsung", desc: "Via WhatsApp/Discord" },
										{ label: "SLA Uptime", desc: "Jaminan ketersediaan" },
									].map((item, i) => (
										<div
											key={item.label}
											className={cn(
												"px-3 py-3 border border-dashed border-foreground/[0.06] bg-foreground/[0.02]",
												i > 0 && "-ml-px",
											)}
										>
											<div className="text-[11px] font-mono text-foreground/65 dark:text-foreground/50 uppercase tracking-wider mb-0.5">
												{item.label}
											</div>
											<div className="text-[11px] font-mono text-foreground/40 dark:text-foreground/28">
												{item.desc}
											</div>
										</div>
									))}
								</div>
							</div>
						</div>

						{/* Live Monitor (menggantikan Sentinel) */}
						<LiveMonitorSection />

						{/* CTA */}
						<div className="mt-8 mb-4">
							<div className="border border-dashed border-foreground/[0.10] p-5 flex items-center justify-between">
								<div>
									<p className="text-[11px] font-mono uppercase tracking-widest text-foreground/80 dark:text-foreground/80 mb-1">
										Lihat paket & harga
									</p>
									<p className="text-[12px] text-foreground/50 dark:text-foreground/40 leading-relaxed">
										API gratis, priority token, dashboard, webhook, dan lebih banyak lagi.
									</p>
								</div>
								<Link
									href="/pricing"
									className="inline-flex items-center gap-1.5 shrink-0 ml-4 px-4 py-2 border border-dashed border-foreground/[0.14] text-foreground dark:text-foreground/80 hover:text-foreground hover:border-foreground/25 hover:bg-foreground/[0.02] transition-all"
								>
									<span className="font-mono text-[11px] uppercase tracking-widest">
										Lihat Harga
									</span>
									<svg className="h-2.5 w-2.5 opacity-50" viewBox="0 0 10 10" fill="none">
										<path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.2" />
									</svg>
								</Link>
							</div>
						</div>

						<ContributorsSection
							contributors={contributors}
							contributorCount={stats.contributors}
						/>

						<ReadmeFooter stats={stats} />
					</motion.article>
				</div>
			</div>
		</motion.div>
	);
}
