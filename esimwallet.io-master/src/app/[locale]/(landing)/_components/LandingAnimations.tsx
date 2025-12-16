'use client';

import React, { useEffect } from 'react';

export function LandingAnimations() {
    useEffect(() => {
        const cards = document.querySelectorAll('.glass');

        cards.forEach((cardElement) => {
            const card = cardElement as HTMLElement;
            let isDragging = false;
            let startX = 0;
            let startY = 0;
            let currentX = 0;
            let currentY = 0;
            const defaultTransform = card.getAttribute('data-default-transform') || '';

            const onMouseDown = (e: MouseEvent) => {
                isDragging = true;
                card.classList.add('dragging');
                card.style.zIndex = '1000';
                // Initialize start position relative to current translation
                startX = e.clientX - currentX;
                startY = e.clientY - currentY;
            };

            const onMouseMove = (e: MouseEvent) => {
                if (!isDragging) return;
                e.preventDefault(); // Prevent text selection/scrolling

                currentX = e.clientX - startX;
                currentY = e.clientY - startY;

                const rotation = (currentX / window.innerWidth) * 30;
                card.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rotation}deg)`;
            };

            const onMouseUp = () => {
                if (isDragging) {
                    isDragging = false;
                    card.classList.remove('dragging');

                    // Reset after short delay to allow transition to re-enable
                    setTimeout(() => {
                        card.style.zIndex = '';
                        card.style.transform = defaultTransform;
                        currentX = 0;
                        currentY = 0;
                    }, 100);
                }
            };

            // Attach listeners
            card.addEventListener('mousedown', onMouseDown as EventListener);
            document.addEventListener('mousemove', onMouseMove as EventListener);
            document.addEventListener('mouseup', onMouseUp as EventListener);

            // Cleanup function for this specific card's listeners
            // Note: In a real component, we might want to group these, 
            // but for exact behavior matching we attach to document per card as per snippet.
            return () => {
                card.removeEventListener('mousedown', onMouseDown as EventListener);
                document.removeEventListener('mousemove', onMouseMove as EventListener);
                document.removeEventListener('mouseup', onMouseUp as EventListener);
            };
        });

        // Global cleanup (optional if component unmounts)
        return () => {
            // Individual card cleanup handles removals
        };
    }, []);

    return null;
}
