'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { addListing, getCategories, Listing } from '@/lib/storage';
import { Camera, MapPin, DollarSign, ArrowLeft, X } from 'lucide-react';

export default function CreateListingPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const toast = useToast();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        location: '',
        price: '',
        type: 'offer' as 'offer' | 'request',
    });
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        const cats = getCategories();
        setCategories(cats.map(c => c.name));
    }, [isAuthenticated, router]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImages(prev => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast.error('Please login to create a listing');
            return;
        }

        if (!formData.title.trim() || !formData.description.trim() || !formData.category) {
            toast.error('Please fill in all required fields');
            return;
        }

        setLoading(true);

        const listing: Listing = {
            id: `listing_${Date.now()}`,
            userId: user.id,
            title: formData.title,
            description: formData.description,
            category: formData.category,
            location: formData.location || 'Not specified',
            price: formData.price,
            type: formData.type,
            images,
            createdAt: new Date().toISOString(),
            status: 'active',
        };

        addListing(listing);
        toast.success('Listing created successfully!');
        setLoading(false);
        router.push(`/listings/${listing.id}`);
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>

                <div className="bg-white rounded-2xl shadow-sm p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create a Listing</h1>
                    <p className="text-gray-600 mb-8">Share your service or request help from the community</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Type Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Listing Type *
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: 'offer' })}
                                    className={`p-4 rounded-xl border-2 transition-all ${formData.type === 'offer'
                                        ? 'border-brand-blue bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="text-center">
                                        <div className="text-2xl mb-2">💼</div>
                                        <div className="font-semibold text-gray-900">Offer Service</div>
                                        <div className="text-xs text-gray-500 mt-1">I can provide this service</div>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: 'request' })}
                                    className={`p-4 rounded-xl border-2 transition-all ${formData.type === 'request'
                                        ? 'border-brand-blue bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="text-center">
                                        <div className="text-2xl mb-2">🔍</div>
                                        <div className="font-semibold text-gray-900">Request Service</div>
                                        <div className="text-xs text-gray-500 mt-1">I need this service</div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Title *
                            </label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g., Professional Logo Design"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent resize-none"
                                rows={5}
                                placeholder="Describe your service in detail..."
                                required
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                Category *
                            </label>
                            <select
                                id="category"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                                required
                            >
                                <option value="">Select a category</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Location */}
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                                Location
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    id="location"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="e.g., Remote, New York, NY"
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Price */}
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                                Price (Optional)
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    id="price"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="e.g., $50/hour or Negotiable"
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Images */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Images (Optional)
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-brand-blue transition-colors">
                                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <label className="cursor-pointer">
                                    <span className="text-brand-blue hover:text-brand-blue-dark font-medium">
                                        Upload images
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </label>
                                <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 5MB</p>
                            </div>

                            {images.length > 0 && (
                                <div className="grid grid-cols-3 gap-4 mt-4">
                                    {images.map((img, index) => (
                                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                                            <img src={img} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => setImages(images.filter((_, i) => i !== index))}
                                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Submit */}
                        <div className="flex gap-4 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="flex-1"
                            >
                                {loading ? 'Creating...' : 'Create Listing'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
