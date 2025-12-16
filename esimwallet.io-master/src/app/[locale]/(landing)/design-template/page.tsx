import React from 'react';
import { LandingNavbar } from '../_components/LandingNavbar';
import { LandingFooter } from '../_components/LandingFooter';
import { GlassStack } from '../_components/GlassStack';

export default function DesignTemplate() {
    return (
        <div className="bg-slate-950 text-slate-200 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
            {/* Background Effect */}
            <div className="fixed top-0 w-full h-screen -z-10 pointer-events-none" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)' }}>
                <div data-us-project="1bY8o6HVTI1oxJxuCJEG" className="absolute w-full h-full left-0 top-0"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 -z-20"></div>
            </div>

            <script dangerouslySetInnerHTML={{ __html: `if(window.UnicornStudio){UnicornStudio.init()}` }} />

            {/* GRADIENT BLUR (Top) */}
            <div className="gradient-blur">
                <div></div><div></div><div></div><div></div><div></div><div></div>
                <style dangerouslySetInnerHTML={{
                    __html: `
            .gradient-blur { position: fixed; z-index: 5; inset: 0 0 auto 0; height: 12%; pointer-events: none; }
            .gradient-blur>div, .gradient-blur::before, .gradient-blur::after { position: absolute; inset: 0; }
            .gradient-blur::before { content: ""; z-index: 1; backdrop-filter: blur(0.5px); mask: linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12.5%, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 37.5%); }
            .gradient-blur>div:nth-of-type(1) { z-index: 2; backdrop-filter: blur(1px); mask: linear-gradient(to top, rgba(0,0,0,0) 12.5%, rgba(0,0,0,1) 25%, rgba(0,0,0,1) 37.5%, rgba(0,0,0,0) 50%); }
            .gradient-blur>div:nth-of-type(2) { z-index: 3; backdrop-filter: blur(2px); mask: linear-gradient(to top, rgba(0,0,0,0) 25%, rgba(0,0,0,1) 37.5%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 62.5%); }
            .gradient-blur>div:nth-of-type(3) { z-index: 4; backdrop-filter: blur(4px); mask: linear-gradient(to top, rgba(0,0,0,0) 37.5%, rgba(0,0,0,1) 50%, rgba(0,0,0,1) 62.5%, rgba(0,0,0,0) 75%); }
            .gradient-blur>div:nth-of-type(4) { z-index: 5; backdrop-filter: blur(8px); mask: linear-gradient(to top, rgba(0,0,0,0) 50%, rgba(0,0,0,1) 62.5%, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 87.5%); }
            .gradient-blur>div:nth-of-type(5) { z-index: 6; backdrop-filter: blur(16px); mask: linear-gradient(to top, rgba(0,0,0,0) 62.5%, rgba(0,0,0,1) 75%, rgba(0,0,0,1) 87.5%, rgba(0,0,0,0) 100%); }
            .gradient-blur>div:nth-of-type(6) { z-index: 7; backdrop-filter: blur(32px); mask: linear-gradient(to top, rgba(0,0,0,0) 75%, rgba(0,0,0,1) 87.5%, rgba(0,0,0,1) 100%); }
            .gradient-blur::after { content: ""; z-index: 8; backdrop-filter: blur(64px); mask: linear-gradient(to top, rgba(0,0,0,0) 87.5%, rgba(0,0,0,1) 100%); }
        `}} />
            </div>

            <LandingNavbar />

            {/* HERO */}
            <section id="hero-template" className="relative pt-32 pb-20 px-6 min-h-screen flex flex-col items-center justify-center overflow-hidden">
                <div className="max-w-4xl mx-auto text-center z-10 fade-in-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-medium tracking-wider text-indigo-300 uppercase mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        Template Badge
                    </div>

                    <h1 className="text-5xl md:text-7xl font-medium text-white tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-400">
                        Design Template<br />Ready for Use
                    </h1>

                    <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                        This is a reusable template layout with glassmorphism effects, scroll animations, and Tailwind styling.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                        <button className="group relative px-8 py-3.5 rounded-full bg-white text-slate-950 text-sm font-medium tracking-tight hover:bg-slate-100 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
                            Primary Action
                        </button>
                        <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1 group">
                            Secondary Link
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                        </a>
                    </div>
                </div>

                <GlassStack />
            </section>

            {/* SECTION TEMPLATE */}
            <section className="py-24 px-6 border-t border-white/5">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-3xl font-medium text-white mb-6">Generic Section</h2>
                    <p className="text-slate-400">Add your content blocks here.</p>
                </div>
            </section>

            <LandingFooter />

            {/* Gradient Blur (bottom) */}
            <div className="absolute bottom-0 left-0 w-full h-[600px] z-0 overflow-hidden pointer-events-none">
                <div className="absolute -bottom-[300px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute -bottom-[200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[100px]"></div>
            </div>

            {/* Interactive Card Script */}
            <script dangerouslySetInnerHTML={{
                __html: `
          document.querySelectorAll('.glass').forEach(card => {
              card.addEventListener('mousemove', e => {
                  const rect = card.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  card.style.setProperty('--mouse-x', \`\${x}px\`);
                  card.style.setProperty('--mouse-y', \`\${y}px\`);
              });
          });
      `}} />
        </div>
    );
}
