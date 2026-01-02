'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';
import { updateUser, getUserListings, Listing } from '@/lib/storage';
import { Camera, MapPin, Mail, Phone, Edit2, Briefcase, Package } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const toast = useToast();

    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState<'offered' | 'needed'>('offered');
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        location: user?.location || '',
        bio: user?.bio || '',
    });
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
    const [userListings, setUserListings] = useState<Listing[]>([]);

    useEffect(() => {
        // Wait for auth to load before checking authentication
        if (authLoading) return;

        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                phone: user.phone || '',
                location: user.location || '',
                bio: user.bio || '',
            });
            setAvatarPreview(user.avatar || '');

            // Load user listings
            const listings = getUserListings(user.id);
            setUserListings(listings);
        }
    }, [user, isAuthenticated, authLoading, router]);


    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (!user) return;

        updateUser(user.id, {
            ...formData,
            avatar: avatarPreview,
        });

        toast.success('Profile updated successfully!');
        setIsEditing(false);
    };

    const offeredListings = userListings.filter(l => l.type === 'offer');
    const neededListings = userListings.filter(l => l.type === 'request');

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
                    <div className="h-32 bg-gradient-to-r from-brand-blue to-brand-light-blue" />
                    <div className="px-6 pb-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16">
                            <div className="relative">
                                <Avatar src={avatarPreview} name={user.name} size="xl" className="ring-4 ring-white" />
                                {isEditing && (
                                    <label className="absolute bottom-0 right-0 p-2 bg-brand-blue text-white rounded-full cursor-pointer hover:bg-brand-blue-dark transition-colors">
                                        <Camera className="w-4 h-4" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>

                            <div className="flex-1">
                                {isEditing ? (
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="text-2xl font-bold mb-2"
                                    />
                                ) : (
                                    <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                                )}

                                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mt-2">
                                    {user.location && (
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            {user.location}
                                        </span>
                                    )}
                                    <Badge variant="info">⭐ {user.rating.toFixed(1)} Rating</Badge>
                                    {user.role === 'admin' && <Badge variant="warning">Admin</Badge>}
                                </div>
                            </div>

                            <Button
                                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                variant={isEditing ? 'default' : 'outline'}
                                className="flex items-center gap-2"
                            >
                                <Edit2 className="w-4 h-4" />
                                {isEditing ? 'Save Changes' : 'Edit Profile'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Profile Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>

                        {isEditing ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="pl-10"
                                            disabled
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="pl-10"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="pl-10"
                                            placeholder="City, State"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent resize-none"
                                        rows={4}
                                        placeholder="Tell us about yourself and your skills..."
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Mail className="w-4 h-4" />
                                    {user.email}
                                </div>
                                {user.phone && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Phone className="w-4 h-4" />
                                        {user.phone}
                                    </div>
                                )}
                                {user.bio && (
                                    <p className="text-gray-700 mt-4">{user.bio}</p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Services Offered</span>
                                <span className="font-semibold text-brand-blue">{offeredListings.length}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Services Needed</span>
                                <span className="font-semibold text-brand-blue">{neededListings.length}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Rating</span>
                                <span className="font-semibold text-yellow-500">⭐ {user.rating.toFixed(1)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Services Tabs */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="border-b border-gray-200">
                        <div className="flex">
                            <button
                                onClick={() => setActiveTab('offered')}
                                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'offered'
                                    ? 'text-brand-blue border-b-2 border-brand-blue'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <Briefcase className="w-4 h-4" />
                                    Services I Offer ({offeredListings.length})
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab('needed')}
                                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'needed'
                                    ? 'text-brand-blue border-b-2 border-brand-blue'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <Package className="w-4 h-4" />
                                    Services I Need ({neededListings.length})
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        {activeTab === 'offered' ? (
                            offeredListings.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {offeredListings.map((listing) => (
                                        <Link key={listing.id} href={`/listings/${listing.id}`}>
                                            <div className="p-4 border border-gray-200 rounded-lg hover:border-brand-blue hover:shadow-md transition-all">
                                                <h3 className="font-semibold text-gray-900 mb-1">{listing.title}</h3>
                                                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{listing.description}</p>
                                                <div className="flex items-center justify-between">
                                                    <Badge variant="success">{listing.category}</Badge>
                                                    <span className="text-xs text-gray-500">{listing.location}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    icon={Briefcase}
                                    title="No services offered yet"
                                    description="Start offering your skills to the community"
                                    action={
                                        <Link href="/listings/create">
                                            <Button>Post a Service</Button>
                                        </Link>
                                    }
                                />
                            )
                        ) : (
                            neededListings.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {neededListings.map((listing) => (
                                        <Link key={listing.id} href={`/listings/${listing.id}`}>
                                            <div className="p-4 border border-gray-200 rounded-lg hover:border-brand-blue hover:shadow-md transition-all">
                                                <h3 className="font-semibold text-gray-900 mb-1">{listing.title}</h3>
                                                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{listing.description}</p>
                                                <div className="flex items-center justify-between">
                                                    <Badge variant="warning">{listing.category}</Badge>
                                                    <span className="text-xs text-gray-500">{listing.location}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    icon={Package}
                                    title="No service requests yet"
                                    description="Let others know what services you're looking for"
                                    action={
                                        <Link href="/listings/create">
                                            <Button>Request a Service</Button>
                                        </Link>
                                    }
                                />
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
