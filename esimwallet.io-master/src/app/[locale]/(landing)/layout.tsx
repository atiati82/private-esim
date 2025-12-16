import React, { use } from 'react';
import { unstable_setRequestLocale } from 'next-intl/server';
import { defaultLocale, type Locale } from '@/i18n/routing';

export function generateStaticParams() {
    return [{ locale: defaultLocale }];
}

export default function LandingLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = use(params);
    unstable_setRequestLocale(locale as Locale);

    return (
        <html lang={locale} className="scroll-smooth">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Private eSIM – No KYC, Anonymous Global Data</title>
                <meta
                    name="description"
                    content="Get a private eSIM with no KYC, instant QR activation and global coverage in 190+ countries. Stay anonymous, avoid roaming fees and earn cashback on every purchase."
                />

                {/* Tailwind CSS */}
                <script src="https://cdn.tailwindcss.com"></script>

                {/* Fonts */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&display=swap"
                    rel="stylesheet"
                />

                {/* Unicorn Studio Script */}
                <script src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.33/dist/unicornStudio.umd.js"></script>

                <script
                    dangerouslySetInnerHTML={{
                        __html: `
            tailwind.config = {
                theme: {
                    extend: {
                        fontFamily: {
                            sans: ['Geist', 'sans-serif'],
                        },
                        colors: {
                            slate: {
                                850: '#151e2e',
                                950: '#020617',
                            }
                        }
                    }
                }
            }
            `,
                    }}
                />

                <style dangerouslySetInnerHTML={{
                    __html: `
            body {
                font-family: 'Geist', sans-serif;
                background-color: #020617;
                color: #ffffff;
                overflow-x: hidden;
            }

            /* 
              Sequence animation intro. 
            */
            @keyframes animationIn {
                0% {
                    opacity: 0;
                    transform: translateY(30px);
                    filter: blur(8px);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0);
                    filter: blur(0px);
                }
            }

            /* 3D Perspective */
            .perspective-1000 {
                perspective: 1000px;
                transform-style: preserve-3d;
            }

            /* Glassmorphism Classes */
            .glass {
                transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                cursor: grab;
                user-select: none;
                -webkit-user-select: none;
                touch-action: none; /* Prevent scroll while dragging */
            }
            .glass:hover {
                transform: translateY(-8px) scale(1.02);
                z-index: 50;
            }
            .glass:active {
                cursor: grabbing;
            }
            .glass.dragging {
                transition: none;
                user-select: none;
            }

            /* Gradient Borders */
            .border-gradient {
                position: relative;
            }
            .border-gradient::before {
                content: "";
                position: absolute;
                inset: 0;
                border-radius: inherit;
                padding: 1px;
                -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                -webkit-mask-composite: xor;
                mask-composite: exclude;
                background: linear-gradient(225deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0.1) 100%);
                pointer-events: none;
            }

            /* Custom Scrollbar */
            ::-webkit-scrollbar { width: 8px; }
            ::-webkit-scrollbar-track { background: #020617; }
            ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
            ::-webkit-scrollbar-thumb:hover { background: #475569; }
            
            details > summary { list-style: none; }
            details > summary::-webkit-details-marker { display: none; }
        `}} />
            </head>
            <body>
                {children}
            </body>
        </html >
    );
}
