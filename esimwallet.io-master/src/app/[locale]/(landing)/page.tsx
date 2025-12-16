'use client';

import React from 'react';
import { LandingAnimations } from './_components/LandingAnimations';

export default function LandingPage() {
    return (
        <div className="bg-slate-950 text-slate-200 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
            {/* Background Effect */}
            <div className="fixed top-0 w-full h-screen -z-10 pointer-events-none" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)' }}>
                <div data-us-project="1bY8o6HVTI1oxJxuCJEG" className="absolute w-full h-full left-0 top-0"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 -z-20"></div>
            </div>

            <script dangerouslySetInnerHTML={{ __html: `if(window.UnicornStudio){UnicornStudio.init()}` }} />

            <LandingAnimations />

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/70 backdrop-blur-xl">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <a href="#" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path><path d="m9 12 2 2 4-4"></path></svg>
                        </div>
                        <span className="text-sm font-medium tracking-tight text-white">private-esim</span>
                    </a>
                    <div className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
                        <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#cashback" className="hover:text-white transition-colors">Cashback</a>
                        <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
                    </div>
                    <a href="#hero-private-esim" className="text-xs font-medium bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full border border-white/10 transition-all">
                        Get Started
                    </a>
                </div>
            </nav>

            {/* Hero Section with Staggered Animation */}
            <section id="hero-private-esim" className="relative pt-32 pb-20 px-6 min-h-screen flex flex-col items-center justify-center overflow-hidden">

                <div className="max-w-4xl mx-auto text-center z-10">
                    {/* 1. Badge (0.1s delay) */}
                    <div className="[animation:animationIn_0.8s_ease-out_0.1s_both]">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-medium tracking-wider text-indigo-300 uppercase mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            No Identity Verification Required
                        </div>
                    </div>

                    {/* 2. Title (0.2s delay) */}
                    <h1 className="text-5xl md:text-7xl font-medium text-white tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-400 [animation:animationIn_0.8s_ease-out_0.2s_both]">
                        Private eSIM,<br />No Questions Asked
                    </h1>

                    {/* 3. Subtitle (0.3s delay) */}
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light [animation:animationIn_0.8s_ease-out_0.3s_both]">
                        Activate your secure mobile internet in minutes with no ID, no passport scan, no paperwork. Enjoy fast data in 190+ countries and keep your real identity out of carrier databases.
                    </p>

                    {/* 4. Buttons (0.4s delay) */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 [animation:animationIn_0.8s_ease-out_0.4s_both]">
                        <button className="group relative px-8 py-3.5 rounded-full bg-white text-slate-950 text-sm font-medium tracking-tight hover:bg-slate-100 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
                            Get Your Private eSIM Now
                        </button>
                        <a href="#compare" className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1 group">
                            Compare plans for your next trip
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                        </a>
                    </div>
                </div>

                {/* 5. Glass Stack Visual (0.6s delay) */}
                <div className="relative w-full max-w-5xl h-[400px] flex items-center justify-center container perspective-1000 mt-8 hidden md:flex [animation:animationIn_0.8s_ease-out_0.6s_both]">

                    {/* Card 1: No KYC */}
                    <div className="glass absolute" data-default-transform="rotate(-6deg) translateX(-180px)" style={{ transform: 'rotate(-6deg) translateX(-180px)', zIndex: 10 }}>
                        <div className="w-[320px] h-[360px] rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-white/10 backdrop-blur-xl shadow-2xl p-6 flex flex-col justify-between group">
                            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path><path d="m9 12 2 2 4-4"></path></svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-medium text-white mb-2 tracking-tight">No KYC Required</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">No passport uploads. No selfie verifications. No address proof. Just pay and connect.</p>
                            </div>
                            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                <span className="text-xs text-indigo-300 font-medium bg-indigo-500/10 px-2 py-1 rounded">100% Anonymous</span>
                                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Global Coverage (Center) */}
                    <div className="glass absolute" data-default-transform="rotate(0deg) translateY(-20px)" style={{ transform: 'rotate(0deg) translateY(-20px)', zIndex: 20 }}>
                        <div className="w-[320px] h-[360px] rounded-2xl bg-gradient-to-br from-slate-900/95 to-slate-950/95 border border-white/10 backdrop-blur-xl shadow-2xl p-6 flex flex-col justify-between">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-medium text-white mb-2 tracking-tight">Global Coverage</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">High-speed data in 190+ countries. Tier-1 networks ensuring you stay connected everywhere.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-4">
                                <div className="bg-white/5 rounded px-2 py-1 text-[10px] text-center text-slate-300">USA</div>
                                <div className="bg-white/5 rounded px-2 py-1 text-[10px] text-center text-slate-300">Europe</div>
                                <div className="bg-white/5 rounded px-2 py-1 text-[10px] text-center text-slate-300">Asia</div>
                                <div className="bg-white/5 rounded px-2 py-1 text-[10px] text-center text-slate-300">Global</div>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Instant Activation */}
                    <div className="glass absolute" data-default-transform="rotate(6deg) translateX(180px)" style={{ transform: 'rotate(6deg) translateX(180px)', zIndex: 10 }}>
                        <div className="w-[320px] h-[360px] rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-white/10 backdrop-blur-xl shadow-2xl p-6 flex flex-col justify-between">
                            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M7 7h.01"></path><path d="M17 7h.01"></path><path d="M7 17h.01"></path><path d="M17 17h.01"></path></svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-medium text-white mb-2 tracking-tight">Instant QR Activation</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">Receive your QR code via email immediately after purchase. Scan, activate, and go online in 2 minutes.</p>
                            </div>
                            <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
                                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full w-3/4 bg-amber-500 rounded-full"></div>
                                </div>
                                <span className="text-[10px] text-slate-500 text-right">Setup: 120 seconds</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Benefits List */}
                <div className="md:hidden w-full max-w-md space-y-3 mt-8 [animation:animationIn_0.8s_ease-out_0.5s_both]">
                    <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path><path d="m9 12 2 2 4-4"></path></svg>
                        <div className="text-sm text-white">No KYC Required</div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
                        <div className="text-sm text-white">Coverage in 190+ Countries</div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M7 7h.01"></path><path d="M17 7h.01"></path><path d="M7 17h.01"></path><path d="M17 17h.01"></path></svg>
                        <div className="text-sm text-white">Instant QR Activation</div>
                    </div>
                </div>
            </section>

            {/* Why Private eSIM? */}
            <section id="why-private-esim" className="py-24 px-6 relative bg-slate-950">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-16 max-w-2xl">
                        <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-white mb-6">Why Private eSIM Is Different</h2>
                        <p className="text-slate-400 text-base leading-relaxed font-light">
                            Most eSIM providers behave like old-school telcos: demanding passport scans, selfie videos, and home addresses. We are built for privacy-conscious travelers, nomads, and journalists who want data, not data collection.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Card 1: Normal SIM */}
                        <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <h3 className="text-lg font-medium text-white mb-6">Classic Contract</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3 text-sm text-slate-400">
                                    <svg className="text-red-400 shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                                    Passport & ID required
                                </li>
                                <li className="flex items-start gap-3 text-sm text-slate-400">
                                    <svg className="text-red-400 shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                                    Long contracts & hidden fees
                                </li>
                                <li className="flex items-start gap-3 text-sm text-slate-400">
                                    <svg className="text-red-400 shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                                    Store visits required
                                </li>
                            </ul>
                        </div>

                        {/* Card 2: Standard eSIM */}
                        <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <h3 className="text-lg font-medium text-white mb-6">Standard eSIM</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3 text-sm text-slate-400">
                                    <svg className="text-amber-400 shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>
                                    Often still requires KYC
                                </li>
                                <li className="flex items-start gap-3 text-sm text-slate-400">
                                    <svg className="text-amber-400 shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>
                                    Centralized IP routing
                                </li>
                                <li className="flex items-start gap-3 text-sm text-slate-400">
                                    <svg className="text-amber-400 shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>
                                    Mixed privacy policies
                                </li>
                            </ul>
                        </div>

                        {/* Card 3: private-esim */}
                        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden border-gradient ring-1 ring-white/10">
                            <h3 className="text-lg font-medium text-white mb-6">private-esim.com</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3 text-sm text-slate-200">
                                    <svg className="text-emerald-400 shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
                                    No ID or Selfie Uploads
                                </li>
                                <li className="flex items-start gap-3 text-sm text-slate-200">
                                    <svg className="text-emerald-400 shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
                                    Prepaid & Contract-Free
                                </li>
                                <li className="flex items-start gap-3 text-sm text-slate-200">
                                    <svg className="text-emerald-400 shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
                                    Optimized Privacy Routing
                                </li>
                                <li className="flex items-start gap-3 text-sm text-slate-200">
                                    <svg className="text-emerald-400 shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
                                    Cashback Rewards
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-24 px-6 border-t border-white/5">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-medium tracking-tight text-white mb-16 text-center">3 Simple Steps to Anonymity</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line for Desktop */}
                        <div className="hidden md:block absolute top-12 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                        {/* Step 1 */}
                        <div className="relative flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center z-10 mb-6 shadow-xl">
                                <span className="text-2xl font-semibold text-white">01</span>
                            </div>
                            <h3 className="text-lg font-medium text-white mb-3">Choose Your Plan</h3>
                            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                                Browse local, regional, or global plans. Filter by data volume and validity. No account creation needed to browse.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="relative flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center z-10 mb-6 shadow-xl">
                                <span className="text-2xl font-semibold text-white">02</span>
                            </div>
                            <h3 className="text-lg font-medium text-white mb-3">Pay Anonymously</h3>
                            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                                Secure checkout. Receive your QR code instantly by email. No store visits, no couriers.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="relative flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center z-10 mb-6 shadow-xl">
                                <span className="text-2xl font-semibold text-white">03</span>
                            </div>
                            <h3 className="text-lg font-medium text-white mb-3">Scan & Connect</h3>
                            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                                Scan the QR code in your phone settings. Within minutes, you are online via the best local network.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 px-6 bg-slate-950">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-medium tracking-tight text-white mb-12">Built for Privacy & Freedom</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Feature 1 */}
                        <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors">
                            <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center mb-6 text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                            </div>
                            <h3 className="text-lg font-medium text-white mb-2">True No-KYC Options</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Many of our plans require absolutely zero personal identification. Ideal for sensitive work environments or personal privacy.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors">
                            <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center mb-6 text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
                            </div>
                            <h3 className="text-lg font-medium text-white mb-2">190+ Countries</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                From city hubs to remote islands, our partner networks span the globe. Swap countries without swapping physical SIM cards.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors">
                            <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center mb-6 text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="20" y2="10"></line><line x1="18" x2="18" y1="20" y2="4"></line><line x1="6" x2="6" y1="20" y2="16"></line></svg>
                            </div>
                            <h3 className="text-lg font-medium text-white mb-2">Intelligent Pricing</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Our engine checks competitor pricing in real-time to ensure you get the best market rate while funding rewards.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors">
                            <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center mb-6 text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path></svg>
                            </div>
                            <h3 className="text-lg font-medium text-white mb-2">Secure Infrastructure</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Powered by encrypted handling, GDPR-compliant storage, and full device lifecycle management.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Who It's For */}
            <section id="who-for" className="py-24 px-6 border-t border-white/5">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-medium tracking-tight text-white mb-12">Who Uses Private eSIM?</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-6 rounded-xl bg-white/5 border border-white/5">
                            <div className="text-white font-medium mb-2">Digital Nomads</div>
                            <p className="text-xs text-slate-400">Keep work profiles separate, avoid roaming bills, and stay location-flexible.</p>
                        </div>
                        <div className="p-6 rounded-xl bg-white/5 border border-white/5">
                            <div className="text-white font-medium mb-2">Privacy Advocates</div>
                            <p className="text-xs text-slate-400">Keep your traffic running while limiting personal data in telco systems.</p>
                        </div>
                        <div className="p-6 rounded-xl bg-white/5 border border-white/5">
                            <div className="text-white font-medium mb-2">Journalists</div>
                            <p className="text-xs text-slate-400">Protect sources and personal safety with No-KYC connectivity.</p>
                        </div>
                        <div className="p-6 rounded-xl bg-white/5 border border-white/5">
                            <div className="text-white font-medium mb-2">Travelers</div>
                            <p className="text-xs text-slate-400">Land, scan, connect. No hunting for kiosks or language barriers.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cashback & Loyalty */}
            <section id="cashback" className="py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none"></div>
                <div className="max-w-6xl mx-auto relative">
                    <div className="flex flex-col md:flex-row items-start justify-between gap-12">
                        <div className="md:w-1/2">
                            <h2 className="text-3xl font-medium tracking-tight text-white mb-6">Earn Coins While You Travel</h2>
                            <p className="text-slate-400 text-base leading-relaxed mb-8">
                                With private-esim.com, you build a travel wallet of rewards. Our Genius-style cashback engine turns every purchase into Coins.
                            </p>
                            <ul className="space-y-6">
                                <li className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20 text-amber-400 font-bold">10%</div>
                                    <div>
                                        <h4 className="text-white font-medium">Cashback on Every Order</h4>
                                        <p className="text-sm text-slate-400">Get 10% back in Coins immediately.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20 text-amber-400 font-bold">50%</div>
                                    <div>
                                        <h4 className="text-white font-medium">Pay with Coins</h4>
                                        <p className="text-sm text-slate-400">Use balance to pay up to 50% of future orders.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="md:w-1/2 w-full">
                            <div className="p-8 rounded-2xl bg-slate-900 border border-white/10 relative">
                                <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber-500/20 blur-3xl rounded-full"></div>
                                <h3 className="text-lg font-medium text-white mb-4">Refer Friends</h3>
                                <div className="flex items-center gap-3 p-3 bg-black/40 rounded-lg border border-white/5 mb-4">
                                    <span className="text-xs font-mono text-slate-300">private-esim.com/ref/yourname</span>
                                    <button className="ml-auto text-xs text-white bg-white/10 px-2 py-1 rounded hover:bg-white/20">Copy</button>
                                </div>
                                <p className="text-sm text-slate-400">Earn <span className="text-white font-medium">7-12%</span> from their spending in Coins.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tech & Ethics */}
            <section id="tech-security" className="py-24 px-6 border-t border-white/5">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="text-3xl font-medium text-white mb-4">Ethical Connectivity</h2>
                    <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                        We believe modern connectivity should not come at the cost of your health or privacy.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* 5G Toggle Card */}
                    <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center text-center">
                        <div className="w-full max-w-[200px] bg-slate-900 rounded-full p-1 flex items-center mb-6 border border-white/10">
                            <div className="w-1/2 py-1.5 rounded-full text-xs font-medium text-slate-500">5G ON</div>
                            <div className="w-1/2 py-1.5 rounded-full bg-white text-slate-950 text-xs font-medium shadow-sm">4G LTE</div>
                        </div>
                        <h3 className="text-white font-medium mb-2">Health & EMF Conscious</h3>
                        <p className="text-sm text-slate-400">Our plans work perfectly on 4G LTE. No need to force 5G if you are concerned about exposure.</p>
                    </div>

                    {/* VPN Card */}
                    <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center text-center">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">VPN Status</span>
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-xs font-bold text-white">ACTIVE</span>
                        </div>
                        <h3 className="text-white font-medium mb-2">VPN Compatible</h3>
                        <p className="text-sm text-slate-400">Combine with your favorite VPN for encrypted tunnels and full IP obfuscation.</p>
                    </div>
                </div>
            </section>

            {/* Reseller */}
            <section id="reseller" className="py-24 px-6 bg-slate-900/50">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-medium text-white mb-8 text-center">Partner with Us</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 border border-white/10 rounded-xl hover:border-white/20 transition-colors">
                            <h3 className="text-white font-medium mb-2">Affiliate Links</h3>
                            <p className="text-xs text-slate-400 mb-4">Share your link, earn commissions on every sale. Up to 27% commission.</p>
                            <a href="#" className="text-xs text-white underline decoration-white/30 hover:decoration-white">Get Links →</a>
                        </div>
                        <div className="p-6 border border-white/10 rounded-xl hover:border-white/20 transition-colors">
                            <h3 className="text-white font-medium mb-2">White Label iFrame</h3>
                            <p className="text-xs text-slate-400 mb-4">Embed a full eSIM store on your website. We handle the provisioning.</p>
                            <a href="#" className="text-xs text-white underline decoration-white/30 hover:decoration-white">Request Access →</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust */}
            <section id="trust" className="py-20 px-6 border-t border-white/5">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="flex justify-center gap-1 mb-6">
                        <svg className="text-amber-400 w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                        <svg className="text-amber-400 w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                        <svg className="text-amber-400 w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                        <svg className="text-amber-400 w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                        <svg className="text-amber-400 w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                    </div>
                    <p className="text-xl font-medium text-white mb-2">"Finally a private eSIM that just works."</p>
                    <p className="text-sm text-slate-400">Used in 50+ countries by early adopters.</p>
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="py-24 px-6 max-w-3xl mx-auto">
                <h2 className="text-2xl font-medium text-white mb-8">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <details className="group bg-white/[0.02] border border-white/5 rounded-lg open:bg-white/[0.04] transition-all">
                        <summary className="flex cursor-pointer items-center justify-between p-6 font-medium text-white">
                            What is a private eSIM?
                            <span className="transition group-open:rotate-180">
                                <svg fill="none" height="20" shape-rendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="20"><path d="M6 9l6 6 6-6"></path></svg>
                            </span>
                        </summary>
                        <div className="px-6 pb-6 text-sm text-slate-400 leading-relaxed">
                            A private eSIM is a digital SIM profile focusing on privacy. It allows you to get mobile data without physical SIM cards or heavy identity verification processes.
                        </div>
                    </details>
                    <details className="group bg-white/[0.02] border border-white/5 rounded-lg open:bg-white/[0.04] transition-all">
                        <summary className="flex cursor-pointer items-center justify-between p-6 font-medium text-white">
                            Do all plans require no KYC?
                            <span className="transition group-open:rotate-180">
                                <svg fill="none" height="20" shape-rendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="20"><path d="M6 9l6 6 6-6"></path></svg>
                            </span>
                        </summary>
                        <div className="px-6 pb-6 text-sm text-slate-400 leading-relaxed">
                            Not all. Some countries strictly require checks by law. However, we specialize in No-KYC options wherever legally possible.
                        </div>
                    </details>
                    <details className="group bg-white/[0.02] border border-white/5 rounded-lg open:bg-white/[0.04] transition-all">
                        <summary className="flex cursor-pointer items-center justify-between p-6 font-medium text-white">
                            How fast do I get my eSIM?
                            <span className="transition group-open:rotate-180">
                                <svg fill="none" height="20" shape-rendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="20"><path d="M6 9l6 6 6-6"></path></svg>
                            </span>
                        </summary>
                        <div className="px-6 pb-6 text-sm text-slate-400 leading-relaxed">
                            Instantly. You receive a QR code via email immediately after payment and can be online in minutes.
                        </div>
                    </details>
                    <details className="group bg-white/[0.02] border border-white/5 rounded-lg open:bg-white/[0.04] transition-all">
                        <summary className="flex cursor-pointer items-center justify-between p-6 font-medium text-white">
                            Can I keep my WhatsApp?
                            <span className="transition group-open:rotate-180">
                                <svg fill="none" height="20" shape-rendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="20"><path d="M6 9l6 6 6-6"></path></svg>
                            </span>
                        </summary>
                        <div className="px-6 pb-6 text-sm text-slate-400 leading-relaxed">
                            Yes. The eSIM provides data only. You can keep your physical SIM active for calls/SMS and your WhatsApp number remains unchanged.
                        </div>
                    </details>
                </div>
            </section>

            {/* Final CTA */}
            <section id="final-cta" className="py-32 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none"></div>
                <div className="relative z-10 max-w-2xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-6">Ready to Go Truly Mobile?</h2>
                    <p className="text-slate-400 text-lg mb-10">
                        Skip the SIM shops. Skip the passport checks. Connect in minutes.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button className="px-8 py-3.5 rounded-full bg-white text-slate-950 text-sm font-medium hover:bg-slate-100 transition-colors shadow-lg shadow-white/10">
                            Get Your Private eSIM Now
                        </button>
                        <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                            Explore Global Plans →
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-white/5 text-center">
                <div className="text-xs text-slate-500">
                    © 2024 Private eSIM. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
