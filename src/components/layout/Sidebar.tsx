'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Briefcase, MessageSquare, Settings, LogOut, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Offers", href: "/dashboard/offers", icon: Briefcase },
    { name: "Active Deals", href: "/dashboard/deals", icon: MessageSquare },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen">
            <div className="flex items-center justify-center h-16 border-b border-gray-200">
                <span className="text-2xl font-bold text-brand-orange">Handee</span>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
                <nav className="flex-1 px-2 py-4 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                                    isActive
                                        ? "bg-brand-teal/10 text-brand-teal"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        "mr-3 flex-shrink-0 h-6 w-6",
                                        isActive ? "text-brand-teal" : "text-gray-400 group-hover:text-gray-500"
                                    )}
                                />
                                {item.name}
                            </Link>
                        );
                    })}

                    <div className="pt-4 mt-4 border-t border-gray-200">
                        <Link
                            href="/admin"
                            className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        >
                            <Shield className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                            Admin Panel
                        </Link>
                    </div>
                </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <button className="flex-shrink-0 w-full group block">
                    <div className="flex items-center">
                        <div>
                            <img
                                className="inline-block h-9 w-9 rounded-full"
                                src="https://i.pravatar.cc/150?u=me"
                                alt=""
                            />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Ronald</p>
                            <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">View profile</p>
                        </div>
                        <LogOut className="ml-auto h-5 w-5 text-gray-400 hover:text-gray-600" />
                    </div>
                </button>
            </div>
        </div>
    );
}
