'use client';

import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
    onClose: (id: string) => void;
}

const toastIcons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
};

const toastStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
};

const iconStyles = {
    success: 'text-green-500',
    error: 'text-red-500',
    info: 'text-blue-500',
    warning: 'text-yellow-500',
};

export function Toast({ id, message, type, duration = 5000, onClose }: ToastProps) {
    const [isExiting, setIsExiting] = useState(false);
    const Icon = toastIcons[type];

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => onClose(id), 300);
        }, duration);

        return () => clearTimeout(timer);
    }, [id, duration, onClose]);

    return (
        <div
            className={cn(
                'flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm transition-all duration-300',
                toastStyles[type],
                isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
            )}
        >
            <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', iconStyles[type])} />
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button
                onClick={() => {
                    setIsExiting(true);
                    setTimeout(() => onClose(id), 300);
                }}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}

export function ToastContainer({ toasts }: { toasts: ToastProps[] }) {
    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
            <div className="pointer-events-auto">
                {toasts.map((toast) => (
                    <div key={toast.id} className="mb-2">
                        <Toast {...toast} />
                    </div>
                ))}
            </div>
        </div>
    );
}

// Toast manager hook
let toastId = 0;
const toastListeners: Array<(toasts: ToastProps[]) => void> = [];
let toasts: ToastProps[] = [];

function emitChange() {
    toastListeners.forEach((listener) => listener(toasts));
}

export function useToast() {
    const [, setToasts] = useState<ToastProps[]>([]);

    useEffect(() => {
        toastListeners.push(setToasts);
        return () => {
            const index = toastListeners.indexOf(setToasts);
            if (index > -1) {
                toastListeners.splice(index, 1);
            }
        };
    }, []);

    const showToast = (message: string, type: ToastType = 'info', duration = 5000) => {
        const id = `toast-${toastId++}`;
        const toast: ToastProps = {
            id,
            message,
            type,
            duration,
            onClose: (id) => {
                toasts = toasts.filter((t) => t.id !== id);
                emitChange();
            },
        };
        toasts = [...toasts, toast];
        emitChange();
    };

    return {
        success: (message: string, duration?: number) => showToast(message, 'success', duration),
        error: (message: string, duration?: number) => showToast(message, 'error', duration),
        info: (message: string, duration?: number) => showToast(message, 'info', duration),
        warning: (message: string, duration?: number) => showToast(message, 'warning', duration),
    };
}

// Global toast provider component
export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [currentToasts, setCurrentToasts] = useState<ToastProps[]>([]);

    useEffect(() => {
        toastListeners.push(setCurrentToasts);
        return () => {
            const index = toastListeners.indexOf(setCurrentToasts);
            if (index > -1) {
                toastListeners.splice(index, 1);
            }
        };
    }, []);

    return (
        <>
            {children}
            <ToastContainer toasts={currentToasts} />
        </>
    );
}
