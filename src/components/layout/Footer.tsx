import { cn } from '@/lib/utils';

interface FooterProps {
    className?: string;
}

export function Footer({ className }: FooterProps) {
    return (
        <footer className={cn('bg-gray-900 text-white', className)}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-brand-blue to-brand-light-blue bg-clip-text text-transparent mb-4">
                            Handee 247
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Your trusted marketplace for discovering and offering services. Connect with skilled professionals 24/7.
                        </p>
                        <p className="text-sm text-gray-500">
                            Built by <span className="font-semibold text-brand-light-blue">FluxxxDev</span>
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="/browse" className="hover:text-white transition-colors">Browse Services</a></li>
                            <li><a href="/listings/create" className="hover:text-white transition-colors">Post a Service</a></li>
                            <li><a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
                            <li><a href="/profile" className="hover:text-white transition-colors">Profile</a></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Handee 247. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
