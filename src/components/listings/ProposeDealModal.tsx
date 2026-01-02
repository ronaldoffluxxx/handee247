'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import { addDeal, Deal } from '@/lib/storage';
import { useRouter } from 'next/navigation';

interface ProposeDealModalProps {
    isOpen: boolean;
    onClose: () => void;
    listingId: string;
    receiverId: string;
}

export function ProposeDealModal({ isOpen, onClose, listingId, receiverId }: ProposeDealModalProps) {
    const { user } = useAuth();
    const toast = useToast();
    const router = useRouter();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast.error('Please login to propose a deal');
            return;
        }

        setLoading(true);

        const deal: Deal = {
            id: `deal_${Date.now()}`,
            listingId,
            proposerId: user.id,
            receiverId,
            status: 'proposed',
            message,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        addDeal(deal);
        toast.success('Deal proposed successfully!');
        setLoading(false);
        onClose();
        router.push(`/deals/${deal.id}`);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Propose a Deal">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Proposal Message
                    </label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent resize-none"
                        rows={4}
                        placeholder="Explain what you're offering in exchange or why you're interested..."
                        required
                    />
                </div>

                <div className="flex gap-3 justify-end">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Proposing...' : 'Send Proposal'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
