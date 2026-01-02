'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getListingById, getUserById, Listing, User } from '@/lib/storage';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { ProposeDealModal } from '@/components/listings/ProposeDealModal';
import { BookServiceModal } from '@/components/listings/BookServiceModal';
import { MapPin, Star, Heart, Share2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { toggleFavorite, getFavorites } from '@/lib/storage';
import Link from 'next/link';

export default function ListingDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const toast = useToast();

    const [listing, setListing] = useState<Listing | null>(null);
    const [owner, setOwner] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [showProposeModal, setShowProposeModal] = useState(false);
    const [showBookModal, setShowBookModal] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const listingData = getListingById(params.id as string);
        if (listingData) {
            setListing(listingData);
            const ownerData = getUserById(listingData.userId);
            setOwner(ownerData);

            if (user) {
                const favorites = getFavorites(user.id);
                setIsFavorite(favorites.includes(listingData.id));
            }
        }
        setLoading(false);
    }, [params.id, user]);

    const handleFavorite = () => {
        if (!user) {
            toast.error('Please login to save favorites');
            return;
        }

        if (listing) {
            toggleFavorite(user.id, listing.id);
            setIsFavorite(!isFavorite);
            toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: listing?.title,
                text: listing?.description,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard!');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Skeleton className="h-96 w-full mb-6" />
                    <Skeleton className="h-8 w-3/4 mb-4" />
                    <Skeleton className="h-24 w-full" />
                </div>
            </div>
        );
    }

    if (!listing || !owner) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Listing not found</h2>
                    <Link href="/browse">
                        <Button>Browse Services</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const isOwner = user?.id === listing.userId;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Images */}
                        {listing.images && listing.images.length > 0 ? (
                            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                                <img
                                    src={listing.images[0]}
                                    alt={listing.title}
                                    className="w-full h-96 object-cover"
                                />
                            </div>
                        ) : (
                            <div className="bg-gradient-to-br from-brand-blue to-brand-light-blue rounded-2xl h-96 flex items-center justify-center text-white text-6xl font-bold">
                                {listing.title[0]}
                            </div>
                        )}

                        {/* Details */}
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant={listing.type === 'offer' ? 'success' : 'warning'}>
                                            {listing.type === 'offer' ? 'Service Offered' : 'Service Needed'}
                                        </Badge>
                                        <Badge variant="info">{listing.category}</Badge>
                                    </div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <MapPin className="w-4 h-4" />
                                        {listing.location}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={handleFavorite}
                                        className={`p-2 rounded-lg transition-colors ${isFavorite
                                                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                                    </button>
                                    <button
                                        onClick={handleShare}
                                        className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                                    >
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="prose max-w-none">
                                <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                                <p className="text-gray-700 whitespace-pre-wrap">{listing.description}</p>
                            </div>

                            {listing.price && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Price</span>
                                        <span className="text-2xl font-bold text-brand-blue">{listing.price}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Owner Card */}
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">
                                {listing.type === 'offer' ? 'Service Provider' : 'Posted By'}
                            </h3>

                            <div className="flex items-center gap-3 mb-4">
                                <Avatar src={owner.avatar} name={owner.name} size="lg" />
                                <div>
                                    <h4 className="font-semibold text-gray-900">{owner.name}</h4>
                                    <div className="flex items-center gap-1 text-sm text-yellow-500">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span className="font-medium">{owner.rating.toFixed(1)}</span>
                                    </div>
                                </div>
                            </div>

                            {owner.bio && (
                                <p className="text-sm text-gray-600 mb-4">{owner.bio}</p>
                            )}

                            {!isOwner && isAuthenticated && (
                                <div className="space-y-2">
                                    {listing.type === 'offer' ? (
                                        <>
                                            <Button
                                                onClick={() => setShowBookModal(true)}
                                                className="w-full"
                                            >
                                                Book Service
                                            </Button>
                                            <Button
                                                onClick={() => setShowProposeModal(true)}
                                                variant="outline"
                                                className="w-full"
                                            >
                                                Propose Deal
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            onClick={() => setShowProposeModal(true)}
                                            className="w-full"
                                        >
                                            Offer Help
                                        </Button>
                                    )}
                                </div>
                            )}

                            {!isAuthenticated && (
                                <div className="space-y-2">
                                    <Link href="/login">
                                        <Button className="w-full">Login to Contact</Button>
                                    </Link>
                                </div>
                            )}

                            {isOwner && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <p className="text-sm text-blue-900 font-medium">This is your listing</p>
                                </div>
                            )}
                        </div>

                        {/* Safety Tips */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                            <h3 className="font-semibold text-yellow-900 mb-3">Safety Tips</h3>
                            <ul className="text-sm text-yellow-800 space-y-2">
                                <li>• Communicate through the platform</li>
                                <li>• Verify credentials before booking</li>
                                <li>• Read reviews and ratings</li>
                                <li>• Report suspicious activity</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <ProposeDealModal
                isOpen={showProposeModal}
                onClose={() => setShowProposeModal(false)}
                listingId={listing.id}
                receiverId={owner.id}
            />
            <BookServiceModal
                isOpen={showBookModal}
                onClose={() => setShowBookModal(false)}
                listingId={listing.id}
                receiverId={owner.id}
            />
        </div>
    );
}
