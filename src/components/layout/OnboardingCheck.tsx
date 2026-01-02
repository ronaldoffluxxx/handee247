'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { hasCompletedOnboarding, initializeDemoData } from '@/lib/storage';

export default function OnboardingCheck({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    useEffect(() => {
        // Initialize demo data on first load
        initializeDemoData();

        // Check if user has completed onboarding
        const completed = hasCompletedOnboarding();
        const isOnOnboardingPage = window.location.pathname === '/onboarding';
        const isOnAuthPage = window.location.pathname.startsWith('/login') ||
            window.location.pathname.startsWith('/signup');

        if (!completed && !isOnOnboardingPage && !isOnAuthPage) {
            router.push('/onboarding');
        }
    }, [router]);

    return <>{children}</>;
}
