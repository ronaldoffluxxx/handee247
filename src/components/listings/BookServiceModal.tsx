'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import { addDeal, Deal } from '@/lib/storage';
import { useRouter } from 'next/navigation';
import { Calendar, Clock } from 'lucide-react';

interface BookServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    listingId: string;
    receiverId: string;
}

export function BookServiceModal({ isOpen, onClose, listingId, receiverId }: BookServiceModalProps) {
    const { user } = useAuth();
    const toast = useToast();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleBook = async () => {
        if (!user) {
            toast.error('Please login to book a service');
            return;
        }

        setLoading(true);

        const deal: Deal = {
            id: `deal_${Date.now()}`,
            listingId,
            proposerId: user.id,
            receiverId,
            status: 'accepted',
            message: 'Direct booking',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        addDeal(deal);
        toast.success('Service booked successfully!');
        setLoading(false);
        onClose();
        router.push(`/deals/${deal.id}`);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Book Service">
            <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Quick Booking</h3>
                    <p className="text-sm text-blue-700">
                        This will create an instant booking. You can discuss details with the service provider in the deal room.
                    </p>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Calendar className="w-5 h-5 text-brand-blue" />
                        <span>Flexible scheduling available</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Clock className="w-5 h-5 text-brand-blue" />
                        <span>Instant confirmation</span>
                    </div>
                </div>

                <div className="flex gap-3 justify-end pt-4">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleBook} disabled={loading}>
                        {loading ? 'Booking...' : 'Confirm Booking'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
