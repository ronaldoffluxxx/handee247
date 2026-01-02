'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { Search, MapPin, Filter, Star, Heart, Package } from 'lucide-react';
import { getAllListings, getCategories, getUserById, getFavorites, Listing } from '@/lib/storage';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function BrowsePage() {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedType, setSelectedType] = useState<'all' | 'offer' | 'request'>('all');
    const [listings, setListings] = useState<Listing[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const allListings = getAllListings().filter(l => l.status === 'active');
        setListings(allListings);

        const cats = getCategories();
        setCategories(['All', ...cats.map(c => c.name)]);

        if (user) {
            const userFavorites = getFavorites(user.id);
            setFavorites(userFavorites);
        }

        setLoading(false);
    }, [user]);

    const filteredListings = listings.filter(listing => {
        const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            listing.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || listing.category === selectedCategory;
        const matchesType = selectedType === 'all' || listing.type === selectedType;

        return matchesSearch && matchesCategory && matchesType;
    });

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Services</h1>
                    <p className="text-gray-600">Discover services from our community of professionals</p>
                </div>

                {/* Search & Filter */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <div className="flex flex-col gap-4">
                        {/* Search Bar */}
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input
                                type="text"
                                placeholder="Search services..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Type Filter */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSelectedType('all')}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedType === 'all'
                                        ? 'bg-brand-blue text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setSelectedType('offer')}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedType === 'offer'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                Services Offered
                            </button>
                            <button
                                onClick={() => setSelectedType('request')}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedType === 'request'
                                        ? 'bg-yellow-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                Services Needed
                            </button>
                        </div>

                        {/* Category Filter */}
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat
                                            ? 'bg-brand-blue text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-4">
                    <p className="text-sm text-gray-600">
                        {filteredListings.length} {filteredListings.length === 1 ? 'service' : 'services'} found
                    </p>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : filteredListings.length === 0 ? (
                    <EmptyState
                        icon={Package}
                        title="No services found"
                        description="Try adjusting your search or filters"
                        action={
                            <Button onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory('All');
                                setSelectedType('all');
                            }}>
                                Clear Filters
                            </Button>
                        }
                    />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredListings.map((listing) => {
                            const owner = getUserById(listing.userId);
                            const isFavorite = favorites.includes(listing.id);

                            return (
                                <Link href={`/listings/${listing.id}`} key={listing.id}>
                                    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all h-full flex flex-col group">
                                        {/* Image */}
                                        <div className="relative aspect-video bg-gradient-to-br from-brand-blue to-brand-light-blue">
                                            {listing.images && listing.images[0] ? (
                                                <img src={listing.images[0]} alt={listing.title} className="object-cover w-full h-full" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-white text-4xl font-bold">
                                                    {listing.title[0]}
                                                </div>
                                            )}
                                            <div className="absolute top-2 right-2 flex gap-2">
                                                <Badge
                                                    variant={listing.type === 'offer' ? 'success' : 'warning'}
                                                    size="sm"
                                                >
                                                    {listing.type === 'offer' ? 'Offer' : 'Request'}
                                                </Badge>
                                                {isFavorite && (
                                                    <div className="bg-red-500 text-white p-1 rounded-full">
                                                        <Heart className="w-3 h-3 fill-current" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-4 flex-1 flex flex-col">
                                            <div className="flex items-center justify-between mb-2">
                                                <Badge variant="info" size="sm">{listing.category}</Badge>
                                                <div className="flex items-center text-xs text-gray-500">
                                                    <MapPin className="w-3 h-3 mr-1" />
                                                    {listing.location}
                                                </div>
                                            </div>

                                            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-brand-blue transition-colors">
                                                {listing.title}
                                            </h3>

                                            <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                                                {listing.description}
                                            </p>

                                            {/* Footer */}
                                            <div className="mt-auto pt-4 flex items-center border-t border-gray-100">
                                                {owner && (
                                                    <>
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-blue to-brand-light-blue flex items-center justify-center text-white font-semibold text-sm mr-2">
                                                            {owner.name[0]}
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-700 flex-1">{owner.name}</span>
                                                        <div className="flex items-center text-yellow-400 text-sm">
                                                            <Star className="w-3 h-3 fill-current mr-1" />
                                                            {owner.rating.toFixed(1)}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
