'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { hasCompletedOnboarding, setOnboardingComplete } from '@/lib/storage';
import { ChevronLeft, ChevronRight, X, Sparkles, Search, MessageCircle, Handshake } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const onboardingScreens = [
    {
        icon: Sparkles,
        title: 'Welcome to Handee 247',
        description: 'Your trusted marketplace for discovering and offering services. Connect with skilled professionals and turn your expertise into opportunities.',
        color: 'from-brand-blue to-brand-light-blue',
    },
    {
        icon: Search,
        title: 'Discover Services',
        description: 'Find skilled people offering services near you. Browse through categories, read reviews, and connect with the perfect service provider for your needs.',
        color: 'from-brand-light-blue to-brand-blue-light',
    },
    {
        icon: Handshake,
        title: 'Offer Your Skills',
        description: 'Turn your skills into income, anytime. List your services, set your terms, and start earning by helping others in your community.',
        color: 'from-brand-blue-dark to-brand-blue',
    },
    {
        icon: MessageCircle,
        title: 'Chat & Book Easily',
        description: 'Negotiate, chat, and complete jobs smoothly. Our built-in messaging system with voice support makes communication seamless and secure.',
        color: 'from-brand-blue to-brand-light-blue',
    },
];

export default function OnboardingPage() {
    const router = useRouter();
    const [currentScreen, setCurrentScreen] = useState(0);
    const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

    useEffect(() => {
        // Redirect if already completed onboarding
        if (hasCompletedOnboarding()) {
            router.push('/login');
        }
    }, [router]);

    const handleNext = () => {
        if (currentScreen < onboardingScreens.length - 1) {
            setDirection('forward');
            setCurrentScreen(currentScreen + 1);
        } else {
            handleComplete();
        }
    };

    const handleBack = () => {
        if (currentScreen > 0) {
            setDirection('backward');
            setCurrentScreen(currentScreen - 1);
        }
    };

    const handleSkip = () => {
        handleComplete();
    };

    const handleComplete = () => {
        setOnboardingComplete();
        router.push('/login');
    };

    const screen = onboardingScreens[currentScreen];
    const Icon = screen.icon;
    const isLastScreen = currentScreen === onboardingScreens.length - 1;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                {/* Skip Button */}
                <div className="flex justify-end mb-4">
                    <button
                        onClick={handleSkip}
                        className="text-gray-500 hover:text-gray-700 font-medium text-sm flex items-center gap-1 transition-colors"
                    >
                        Skip
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Content */}
                    <div className="p-8 md:p-12">
                        {/* Icon */}
                        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${screen.color} flex items-center justify-center mb-8 mx-auto`}>
                            <Icon className="w-10 h-10 text-white" />
                        </div>

                        {/* Text Content */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                {screen.title}
                            </h1>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                {screen.description}
                            </p>
                        </div>

                        {/* Progress Dots */}
                        <div className="flex justify-center gap-2 mb-8">
                            {onboardingScreens.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setDirection(index > currentScreen ? 'forward' : 'backward');
                                        setCurrentScreen(index);
                                    }}
                                    className={`h-2 rounded-full transition-all duration-300 ${index === currentScreen
                                            ? 'w-8 bg-brand-blue'
                                            : 'w-2 bg-gray-300 hover:bg-gray-400'
                                        }`}
                                    aria-label={`Go to screen ${index + 1}`}
                                />
                            ))}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between gap-4">
                            <Button
                                variant="ghost"
                                onClick={handleBack}
                                disabled={currentScreen === 0}
                                className="flex items-center gap-2"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Back
                            </Button>

                            <Button
                                onClick={handleNext}
                                size="lg"
                                className="flex items-center gap-2 px-8"
                            >
                                {isLastScreen ? 'Get Started' : 'Next'}
                                {!isLastScreen && <ChevronRight className="w-4 h-4" />}
                            </Button>
                        </div>
                    </div>

                    {/* Footer Branding */}
                    <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-100">
                        <p className="text-sm text-gray-500">
                            Built by <span className="font-semibold text-brand-blue">FluxxxDev</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
