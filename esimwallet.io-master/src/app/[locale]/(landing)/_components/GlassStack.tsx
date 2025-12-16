import React from 'react';

export function GlassStack() {
    return (
        <div className="relative w-full max-w-5xl h-[400px] flex items-center justify-center container perspective-1000 mt-8 hidden md:flex">

            {/* Card 1: No KYC */}
            <div className="glass absolute animate-on-scroll" style={{ transform: 'rotate(-6deg) translateX(-180px)', zIndex: 10, '--fx-filter': 'blur(4px) liquid-glass(2, 10) saturate(1.25)', animation: 'animationIn 0.8s ease-out 0.1s both' } as React.CSSProperties} data-default-transform="rotate(-6deg) translateX(-180px)">
                <div className="w-[320px] h-[360px] rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border-gradient backdrop-blur-xl shadow-2xl p-6 flex flex-col justify-between group">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></svg>
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
            <div className="glass absolute animate-on-scroll" style={{ transform: 'rotate(0deg) translateY(-20px)', zIndex: 20, '--fx-filter': 'blur(4px) liquid-glass(2, 10) saturate(1.25)', animation: 'animationIn 0.8s ease-out 0.3s both' } as React.CSSProperties} data-default-transform="rotate(0deg) translateY(-20px)">
                <div className="w-[320px] h-[360px] rounded-2xl bg-gradient-to-br from-slate-900/95 to-slate-950/95 border-gradient backdrop-blur-xl shadow-2xl p-6 flex flex-col justify-between">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>
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
            <div className="glass absolute animate-on-scroll" style={{ transform: 'rotate(6deg) translateX(180px)', zIndex: 10, '--fx-filter': 'blur(4px) liquid-glass(2, 10) saturate(1.25)', animation: 'animationIn 0.8s ease-out 0.5s both' } as React.CSSProperties} data-default-transform="rotate(6deg) translateX(180px)">
                <div className="w-[320px] h-[360px] rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border-gradient backdrop-blur-xl shadow-2xl p-6 flex flex-col justify-between">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 7h.01" /><path d="M17 7h.01" /><path d="M7 17h.01" /><path d="M17 17h.01" /></svg>
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
    );
}
