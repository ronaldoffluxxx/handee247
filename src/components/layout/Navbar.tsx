'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, User, LogOut, Settings, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/');
        setShowUserMenu(false);
    };

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-bold bg-gradient-to-r from-brand-blue to-brand-light-blue bg-clip-text text-transparent">
                                Handee 247
                            </span>
                        </Link>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link
                                href="/browse"
                                className="border-transparent text-gray-500 hover:border-brand-blue hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                            >
                                Browse Services
                            </Link>
                            {isAuthenticated && (
                                <Link
                                    href="/dashboard"
                                    className="border-transparent text-gray-500 hover:border-brand-blue hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                                >
                                    Dashboard
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <Link href="/listings/create">
                                    <Button size="sm">Post Service</Button>
                                </Link>
                                <div className="relative">
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                                    >
                                        <Avatar src={user?.avatar} name={user?.name} size="sm" />
                                    </button>

                                    {showUserMenu && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setShowUserMenu(false)}
                                            />
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 z-20 border border-gray-100">
                                                <div className="px-4 py-2 border-b border-gray-100">
                                                    <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                                                    <p className="text-xs text-gray-500">{user?.email}</p>
                                                </div>
                                                <Link
                                                    href="/profile"
                                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                    onClick={() => setShowUserMenu(false)}
                                                >
                                                    <User className="w-4 h-4" />
                                                    Profile
                                                </Link>
                                                <Link
                                                    href="/dashboard"
                                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                    onClick={() => setShowUserMenu(false)}
                                                >
                                                    <LayoutDashboard className="w-4 h-4" />
                                                    Dashboard
                                                </Link>
                                                {user?.role === 'admin' && (
                                                    <Link
                                                        href="/admin"
                                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                        onClick={() => setShowUserMenu(false)}
                                                    >
                                                        <Settings className="w-4 h-4" />
                                                        Admin Panel
                                                    </Link>
                                                )}
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Logout
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost">Log in</Button>
                                </Link>
                                <Link href="/signup">
                                    <Button>Sign up</Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-blue"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="sm:hidden border-t border-gray-100">
                    <div className="pt-2 pb-3 space-y-1">
                        <Link
                            href="/browse"
                            className="bg-brand-blue/10 border-brand-blue text-brand-blue block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            Browse Services
                        </Link>
                        {isAuthenticated && (
                            <Link
                                href="/dashboard"
                                className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                                onClick={() => setIsOpen(false)}
                            >
                                Dashboard
                            </Link>
                        )}
                    </div>

                    {isAuthenticated ? (
                        <div className="pt-4 pb-4 border-t border-gray-200">
                            <div className="flex items-center px-4 mb-3">
                                <Avatar src={user?.avatar} name={user?.name} size="md" />
                                <div className="ml-3">
                                    <div className="text-base font-medium text-gray-800">{user?.name}</div>
                                    <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Link
                                    href="/profile"
                                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Profile
                                </Link>
                                <Link
                                    href="/listings/create"
                                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Post Service
                                </Link>
                                {user?.role === 'admin' && (
                                    <Link
                                        href="/admin"
                                        className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Admin Panel
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:bg-red-50"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="pt-4 pb-4 border-t border-gray-200">
                            <div className="flex items-center px-4 space-x-4">
                                <Link href="/login" className="w-full" onClick={() => setIsOpen(false)}>
                                    <Button variant="ghost" className="w-full justify-start">Log in</Button>
                                </Link>
                            </div>
                            <div className="mt-3 px-4">
                                <Link href="/signup" className="w-full" onClick={() => setIsOpen(false)}>
                                    <Button className="w-full">Sign up</Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}
