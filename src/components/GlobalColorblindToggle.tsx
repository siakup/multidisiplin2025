'use client';

import { useEffect, useState } from 'react';
import ColorblindModeToggle from './ColorblindModeToggle';

export default function GlobalColorblindToggle() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const checkVisibility = () => {
            let role = localStorage.getItem('userRole');

            if (role) {
                // Bersihkan quotes jika ada
                role = role.replace(/^"|"$/g, '').trim();

                // Gunakan check yang lebih agresif (contains 'facility')
                if (role.toLowerCase().includes('facility')) {
                    setIsVisible(false);
                    return;
                }
            }

            setIsVisible(true);
        };

        // Check on mount
        checkVisibility();

        // Listen for storage changes (multi-tab support)
        window.addEventListener('storage', checkVisibility);

        // Listen for custom event 'userUpdated' (login/logout support within same tab)
        window.addEventListener('userUpdated', checkVisibility);

        return () => {
            window.removeEventListener('storage', checkVisibility);
            window.removeEventListener('userUpdated', checkVisibility);
        };
    }, []);

    if (!isVisible) return null;

    return <ColorblindModeToggle fixed />;
}
