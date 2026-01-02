'use client';

import { Card } from "@/components/ui/Card";
import { Users, ShoppingBag, AlertTriangle, BarChart } from "lucide-react";

export default function AdminPage() {
    // Mock Data
    const stats = [
        { name: 'Total Users', value: '1,240', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
        { name: 'Active Listings', value: '856', icon: ShoppingBag, color: 'text-brand-teal', bg: 'bg-brand-teal/10' },
        { name: 'Pending Disputes', value: '3', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
        { name: 'Total Swaps', value: '3,402', icon: BarChart, color: 'text-purple-600', bg: 'bg-purple-100' },
    ];

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Users */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">New Users</h2>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">User {i}</p>
                                        <p className="text-xs text-gray-500">user{i}@example.com</p>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400">2h ago</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Reports */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
                    </div>
                    <div className="divide-y divide-gray-200">
                        <div className="px-6 py-4">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-red-600">Inappropriate Content</span>
                                <span className="text-xs text-gray-400">1h ago</span>
                            </div>
                            <p className="text-sm text-gray-600">Reported by Sarah J. regarding Deal #123</p>
                        </div>
                        <div className="px-6 py-4">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-orange-600">No Show</span>
                                <span className="text-xs text-gray-400">5h ago</span>
                            </div>
                            <p className="text-sm text-gray-600">Reported by Mike T. regarding Deal #456</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
