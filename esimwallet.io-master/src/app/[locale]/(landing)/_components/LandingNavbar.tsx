import React from 'react';

export function LandingNavbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/70 backdrop-blur-xl">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <a href="#" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></svg>
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
    );
}
