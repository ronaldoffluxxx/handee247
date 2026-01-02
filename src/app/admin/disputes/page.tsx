'use client';

import { Button } from "@/components/ui/Button";
import { AlertTriangle, MessageSquare, CheckCircle, XCircle } from "lucide-react";

export default function DisputesPage() {
    // Mock Data
    const disputes = [
        {
            id: 1,
            dealId: "D-123",
            reporter: "Sarah Jenkins",
            reported: "Mike T.",
            reason: "Inappropriate behavior in chat",
            status: "Open",
            date: "2 hours ago"
        },
        {
            id: 2,
            dealId: "D-456",
            reporter: "Alex Davis",
            reported: "Emma W.",
            reason: "Service not delivered as promised",
            status: "Investigating",
            date: "1 day ago"
        },
    ];

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Disputes & Reports</h1>

            <div className="space-y-6">
                {disputes.map((dispute) => (
                    <div key={dispute.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                        <div className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-red-100 text-red-600 rounded-full">
                                        <AlertTriangle className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-lg font-semibold text-gray-900">Dispute #{dispute.id}</h3>
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${dispute.status === 'Open' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {dispute.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">
                                            Reported by <span className="font-medium text-gray-900">{dispute.reporter}</span> against <span className="font-medium text-gray-900">{dispute.reported}</span>
                                        </p>
                                        <p className="text-sm text-gray-500">Deal ID: {dispute.dealId} • {dispute.date}</p>
                                    </div>
                                </div>
                                <Button variant="outline">View Deal Chat</Button>
                            </div>

                            <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-100">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Reason for Report</h4>
                                <p className="text-sm text-gray-600">{dispute.reason}</p>
                            </div>

                            <div className="mt-6 flex gap-3 justify-end border-t border-gray-100 pt-4">
                                <Button variant="ghost" className="text-gray-500">
                                    <MessageSquare className="w-4 h-4 mr-2" /> Contact Users
                                </Button>
                                <Button variant="outline" className="text-red-600 hover:bg-red-50 border-red-200 hover:border-red-300">
                                    <XCircle className="w-4 h-4 mr-2" /> Ban User
                                </Button>
                                <Button className="bg-green-600 hover:bg-green-700">
                                    <CheckCircle className="w-4 h-4 mr-2" /> Resolve Dispute
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
