'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { getUserDeals, getListingById, getUserById, Deal } from '@/lib/storage';
import { Briefcase, MessageSquare, Star, TrendingUp, Package } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const [deals, setDeals] = useState<Deal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Wait for auth to load before checking authentication
        if (authLoading) return;

        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (user) {
            const userDeals = getUserDeals(user.id);
            setDeals(userDeals);
        }
        setLoading(false);
    }, [user, isAuthenticated, authLoading, router]);


    if (!user) return null;

    const activeDeals = deals.filter(d => d.status !== 'completed' && d.status !== 'rejected');
    const completedDeals = deals.filter(d => d.status === 'completed');

    const stats = [
        { name: 'Active Deals', value: activeDeals.length.toString(), icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-100' },
        { name: 'Completed', value: completedDeals.length.toString(), icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
        { name: 'Rating', value: user.rating.toFixed(1), icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-100' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
                    <p className="text-gray-600 mt-1">Here's what's happening with your services</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {stats.map((stat) => (
                        <div key={stat.name} className="bg-white rounded-xl shadow-sm p-6 flex items-center">
                            <div className={`p-3 rounded-full ${stat.bg} ${stat.color} mr-4`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Active Deals */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900">Active Deals</h2>
                        {activeDeals.length > 0 && (
                            <Badge variant="info">{activeDeals.length}</Badge>
                        )}
                    </div>
                    <div className="divide-y divide-gray-200">
                        {activeDeals.length === 0 ? (
                            <EmptyState
                                icon={Package}
                                title="No active deals"
                                description="Start browsing services to create your first deal"
                                action={
                                    <Link href="/browse">
                                        <button className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue-dark transition-colors">
                                            Browse Services
                                        </button>
                                    </Link>
                                }
                            />
                        ) : (
                            activeDeals.map((deal) => {
                                const listing = getListingById(deal.listingId);
                                const otherUserId = deal.proposerId === user.id ? deal.receiverId : deal.proposerId;
                                const otherUser = getUserById(otherUserId);

                                if (!listing || !otherUser) return null;

                                return (
                                    <Link key={deal.id} href={`/deals/${deal.id}`}>
                                        <div className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer">
                                            <div className="flex items-center flex-1">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-blue to-brand-light-blue flex items-center justify-center text-white font-bold mr-4">
                                                    {otherUser.name[0]}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-sm font-medium text-gray-900">{listing.title}</h3>
                                                    <p className="text-xs text-gray-500">with {otherUser.name}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Badge
                                                    variant={
                                                        deal.status === 'proposed' ? 'warning' :
                                                            deal.status === 'accepted' ? 'info' :
                                                                'success'
                                                    }
                                                >
                                                    {deal.status.replace('_', ' ')}
                                                </Badge>
                                                <span className="text-xs text-gray-400">
                                                    {new Date(deal.updatedAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Completed Deals */}
                {completedDeals.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Completed Deals</h2>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {completedDeals.slice(0, 5).map((deal) => {
                                const listing = getListingById(deal.listingId);
                                const otherUserId = deal.proposerId === user.id ? deal.receiverId : deal.proposerId;
                                const otherUser = getUserById(otherUserId);

                                if (!listing || !otherUser) return null;

                                return (
                                    <Link key={deal.id} href={`/deals/${deal.id}`}>
                                        <div className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold mr-4">
                                                    ✓
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-900">{listing.title}</h3>
                                                    <p className="text-xs text-gray-500">with {otherUser.name}</p>
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-400">
                                                {new Date(deal.updatedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
