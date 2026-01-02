import { cn } from '@/lib/utils';

interface AvatarProps {
    src?: string;
    alt?: string;
    name?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export function Avatar({ src, alt, name, size = 'md', className }: AvatarProps) {
    const sizeClasses = {
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-16 w-16 text-lg',
        xl: 'h-24 w-24 text-2xl',
    };

    const getInitials = (name?: string) => {
        if (!name) return '?';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name[0].toUpperCase();
    };

    return (
        <div
            className={cn(
                'relative rounded-full overflow-hidden bg-gradient-to-br from-brand-blue to-brand-light-blue flex items-center justify-center font-semibold text-white',
                sizeClasses[size],
                className
            )}
        >
            {src ? (
                <img src={src} alt={alt || name || 'Avatar'} className="w-full h-full object-cover" />
            ) : (
                <span>{getInitials(name)}</span>
            )}
        </div>
    );
}
