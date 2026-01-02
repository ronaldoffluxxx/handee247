'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getDealById, getListingById, getUserById, updateDeal, getDealMessages, Deal, Listing, User } from '@/lib/storage';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { Check, X, ArrowLeft, MessageCircle } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import Link from 'next/link';

const statusSteps = [
    { key: 'proposed', label: 'Proposed' },
    { key: 'accepted', label: 'Accepted' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'completed', label: 'Completed' },
];

export default function DealPage() {
    const params = useParams();
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const toast = useToast();

    const [deal, setDeal] = useState<Deal | null>(null);
    const [listing, setListing] = useState<Listing | null>(null);
    const [proposer, setProposer] = useState<User | null>(null);
    const [receiver, setReceiver] = useState<User | null>(null);
    const [otherUser, setOtherUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        const dealData = getDealById(params.id as string);
        if (dealData) {
            // Check if user has access to this deal
            if (user && dealData.proposerId !== user.id && dealData.receiverId !== user.id) {
                toast.error('You do not have access to this deal');
                router.push('/dashboard');
                return;
            }

            setDeal(dealData);

            const listingData = getListingById(dealData.listingId);
            setListing(listingData);

            const proposerData = getUserById(dealData.proposerId);
            const receiverData = getUserById(dealData.receiverId);
            setProposer(proposerData);
            setReceiver(receiverData);

            // Determine the other user in the deal
            if (user) {
                setOtherUser(user.id === dealData.proposerId ? receiverData : proposerData);
            }
        }
        setLoading(false);
    }, [params.id, user, isAuthenticated, router, toast]);

    const handleAccept = () => {
        if (deal) {
            updateDeal(deal.id, { status: 'accepted' });
            setDeal({ ...deal, status: 'accepted' });
            toast.success('Deal accepted!');
        }
    };

    const handleReject = () => {
        if (deal) {
            updateDeal(deal.id, { status: 'rejected' });
            setDeal({ ...deal, status: 'rejected' });
            toast.success('Deal rejected');
            router.push('/dashboard');
        }
    };

    const handleStartProgress = () => {
        if (deal) {
            updateDeal(deal.id, { status: 'in_progress' });
            setDeal({ ...deal, status: 'in_progress' });
            toast.success('Deal marked as in progress');
        }
    };

    const handleComplete = () => {
        if (deal) {
            updateDeal(deal.id, { status: 'completed' });
            setDeal({ ...deal, status: 'completed' });
            toast.success('Deal completed! 🎉');
        }
    };

    if (loading || !deal || !listing || !proposer || !receiver || !otherUser) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading deal...</p>
                </div>
            </div>
        );
    }

    const currentStepIndex = statusSteps.findIndex(s => s.key === deal.status);
    const isProposer = user?.id === deal.proposerId;
    const isReceiver = user?.id === deal.receiverId;
    const canAccept = isReceiver && deal.status === 'proposed';
    const canProgress = deal.status === 'accepted';
    const canComplete = deal.status === 'in_progress';

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => router.push('/dashboard')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Deal Header */}
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Deal Room</h1>
                                    <Link href={`/listings/${listing.id}`} className="text-brand-blue hover:underline">
                                        {listing.title}
                                    </Link>
                                </div>
                                <Badge
                                    variant={
                                        deal.status === 'completed' ? 'success' :
                                            deal.status === 'rejected' ? 'error' :
                                                deal.status === 'in_progress' ? 'info' :
                                                    'warning'
                                    }
                                >
                                    {deal.status.replace('_', ' ').toUpperCase()}
                                </Badge>
                            </div>

                            {/* Status Tracker */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-700 mb-4">Progress</h3>
                                <div className="relative">
                                    <div className="flex justify-between">
                                        {statusSteps.map((step, index) => (
                                            <div key={step.key} className="flex flex-col items-center flex-1">
                                                <div
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${index <= currentStepIndex
                                                            ? 'bg-brand-blue text-white'
                                                            : 'bg-gray-200 text-gray-500'
                                                        }`}
                                                >
                                                    {index < currentStepIndex ? (
                                                        <Check className="w-5 h-5" />
                                                    ) : (
                                                        index + 1
                                                    )}
                                                </div>
                                                <span className={`text-xs mt-2 text-center ${index <= currentStepIndex ? 'text-brand-blue font-medium' : 'text-gray-500'
                                                    }`}>
                                                    {step.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10">
                                        <div
                                            className="h-full bg-brand-blue transition-all duration-500"
                                            style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Proposal Message */}
                            {deal.message && (
                                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Proposal Message</h4>
                                    <p className="text-gray-600">{deal.message}</p>
                                </div>
                            )}

                            {/* Actions */}
                            {deal.status !== 'rejected' && deal.status !== 'completed' && (
                                <div className="flex gap-3">
                                    {canAccept && (
                                        <>
                                            <Button onClick={handleAccept} className="flex-1">
                                                <Check className="w-4 h-4 mr-2" />
                                                Accept Deal
                                            </Button>
                                            <Button onClick={handleReject} variant="outline" className="flex-1 text-red-600 border-red-600 hover:bg-red-50">
                                                <X className="w-4 h-4 mr-2" />
                                                Reject
                                            </Button>
                                        </>
                                    )}
                                    {canProgress && (
                                        <Button onClick={handleStartProgress} className="flex-1">
                                            Start Work
                                        </Button>
                                    )}
                                    {canComplete && (
                                        <Button onClick={handleComplete} className="flex-1">
                                            Mark as Completed
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Chat */}
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-gray-200 flex items-center gap-2">
                                <MessageCircle className="w-5 h-5 text-brand-blue" />
                                <h3 className="font-semibold text-gray-900">Messages</h3>
                            </div>
                            <ChatWindow dealId={deal.id} otherUser={otherUser} />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Participants */}
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Participants</h3>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Avatar src={proposer.avatar} name={proposer.name} size="md" />
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{proposer.name}</p>
                                        <p className="text-xs text-gray-500">Proposer</p>
                                    </div>
                                    {isProposer && (
                                        <Badge variant="info" size="sm">You</Badge>
                                    )}
                                </div>

                                <div className="flex items-center gap-3">
                                    <Avatar src={receiver.avatar} name={receiver.name} size="md" />
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{receiver.name}</p>
                                        <p className="text-xs text-gray-500">Receiver</p>
                                    </div>
                                    {isReceiver && (
                                        <Badge variant="info" size="sm">You</Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Service Details */}
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Service Details</h3>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <span className="text-gray-500">Category:</span>
                                    <span className="ml-2 font-medium text-gray-900">{listing.category}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Location:</span>
                                    <span className="ml-2 font-medium text-gray-900">{listing.location}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Type:</span>
                                    <span className="ml-2 font-medium text-gray-900">
                                        {listing.type === 'offer' ? 'Service Offered' : 'Service Needed'}
                                    </span>
                                </div>
                                {listing.price && (
                                    <div>
                                        <span className="text-gray-500">Price:</span>
                                        <span className="ml-2 font-medium text-brand-blue">{listing.price}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
