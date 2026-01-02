/**
 * LocalStorage utility for Handee 247
 * Manages all client-side data persistence
 */

// Storage Keys
const STORAGE_KEYS = {
    USER: 'handee_user',
    USERS: 'handee_users',
    LISTINGS: 'handee_listings',
    DEALS: 'handee_deals',
    MESSAGES: 'handee_messages',
    CATEGORIES: 'handee_categories',
    ONBOARDING: 'handee_onboarding_complete',
    FAVORITES: 'handee_favorites',
    ADMIN_DATA: 'handee_admin_data',
} as const;

// Types
export interface User {
    id: string;
    email: string;
    password: string; // In production, this would be hashed
    name: string;
    phone?: string;
    location?: string;
    bio?: string;
    avatar?: string; // base64 encoded image
    role: 'user' | 'admin';
    rating: number;
    createdAt: string;
    suspended?: boolean;
}

export interface Listing {
    id: string;
    userId: string;
    title: string;
    description: string;
    category: string;
    location: string;
    price?: string;
    type: 'offer' | 'request';
    images: string[]; // base64 encoded images
    createdAt: string;
    status: 'active' | 'inactive' | 'removed';
}

export interface Deal {
    id: string;
    listingId: string;
    proposerId: string;
    receiverId: string;
    status: 'proposed' | 'accepted' | 'in_progress' | 'completed' | 'rejected';
    message?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Message {
    id: string;
    dealId: string;
    senderId: string;
    receiverId: string;
    content: string;
    type: 'text' | 'voice';
    voiceData?: string; // base64 encoded audio
    timestamp: string;
    read: boolean;
}

export interface Category {
    id: string;
    name: string;
    icon?: string;
}

// Helper functions
function getItem<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error(`Error reading ${key} from localStorage:`, error);
        return null;
    }
}

function setItem<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error writing ${key} to localStorage:`, error);
    }
}

function removeItem(key: string): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error(`Error removing ${key} from localStorage:`, error);
    }
}

// Auth functions
export function getCurrentUser(): User | null {
    return getItem<User>(STORAGE_KEYS.USER);
}

export function setCurrentUser(user: User | null): void {
    if (user) {
        setItem(STORAGE_KEYS.USER, user);
    } else {
        removeItem(STORAGE_KEYS.USER);
    }
}

export function getAllUsers(): User[] {
    return getItem<User[]>(STORAGE_KEYS.USERS) || [];
}

export function addUser(user: User): void {
    const users = getAllUsers();
    users.push(user);
    setItem(STORAGE_KEYS.USERS, users);
}

export function updateUser(userId: string, updates: Partial<User>): void {
    const users = getAllUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
        users[index] = { ...users[index], ...updates };
        setItem(STORAGE_KEYS.USERS, users);

        // Update current user if it's the same
        const currentUser = getCurrentUser();
        if (currentUser?.id === userId) {
            setCurrentUser(users[index]);
        }
    }
}

export function getUserById(userId: string): User | null {
    const users = getAllUsers();
    return users.find(u => u.id === userId) || null;
}

export function login(email: string, password: string): User | null {
    const users = getAllUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user && !user.suspended) {
        setCurrentUser(user);
        return user;
    }
    return null;
}

export function logout(): void {
    setCurrentUser(null);
}

export function signup(email: string, password: string, name: string): User | null {
    const users = getAllUsers();
    if (users.some(u => u.email === email)) {
        return null; // Email already exists
    }

    const newUser: User = {
        id: `user_${Date.now()}`,
        email,
        password,
        name,
        role: 'user',
        rating: 0,
        createdAt: new Date().toISOString(),
    };

    addUser(newUser);
    setCurrentUser(newUser);
    return newUser;
}

// Listings functions
export function getAllListings(): Listing[] {
    return getItem<Listing[]>(STORAGE_KEYS.LISTINGS) || [];
}

export function getListingById(id: string): Listing | null {
    const listings = getAllListings();
    return listings.find(l => l.id === id) || null;
}

export function addListing(listing: Listing): void {
    const listings = getAllListings();
    listings.push(listing);
    setItem(STORAGE_KEYS.LISTINGS, listings);
}

export function updateListing(id: string, updates: Partial<Listing>): void {
    const listings = getAllListings();
    const index = listings.findIndex(l => l.id === id);
    if (index !== -1) {
        listings[index] = { ...listings[index], ...updates };
        setItem(STORAGE_KEYS.LISTINGS, listings);
    }
}

export function deleteListing(id: string): void {
    const listings = getAllListings();
    const filtered = listings.filter(l => l.id !== id);
    setItem(STORAGE_KEYS.LISTINGS, filtered);
}

export function getUserListings(userId: string): Listing[] {
    const listings = getAllListings();
    return listings.filter(l => l.userId === userId && l.status === 'active');
}

// Deals functions
export function getAllDeals(): Deal[] {
    return getItem<Deal[]>(STORAGE_KEYS.DEALS) || [];
}

export function getDealById(id: string): Deal | null {
    const deals = getAllDeals();
    return deals.find(d => d.id === id) || null;
}

export function addDeal(deal: Deal): void {
    const deals = getAllDeals();
    deals.push(deal);
    setItem(STORAGE_KEYS.DEALS, deals);
}

export function updateDeal(id: string, updates: Partial<Deal>): void {
    const deals = getAllDeals();
    const index = deals.findIndex(d => d.id === id);
    if (index !== -1) {
        deals[index] = { ...deals[index], ...updates, updatedAt: new Date().toISOString() };
        setItem(STORAGE_KEYS.DEALS, deals);
    }
}

export function getUserDeals(userId: string): Deal[] {
    const deals = getAllDeals();
    return deals.filter(d => d.proposerId === userId || d.receiverId === userId);
}

// Messages functions
export function getAllMessages(): Message[] {
    return getItem<Message[]>(STORAGE_KEYS.MESSAGES) || [];
}

export function getDealMessages(dealId: string): Message[] {
    const messages = getAllMessages();
    return messages.filter(m => m.dealId === dealId).sort((a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
}

export function addMessage(message: Message): void {
    const messages = getAllMessages();
    messages.push(message);
    setItem(STORAGE_KEYS.MESSAGES, messages);
}

export function markMessageAsRead(messageId: string): void {
    const messages = getAllMessages();
    const index = messages.findIndex(m => m.id === messageId);
    if (index !== -1) {
        messages[index].read = true;
        setItem(STORAGE_KEYS.MESSAGES, messages);
    }
}

// Categories functions
export function getCategories(): Category[] {
    const categories = getItem<Category[]>(STORAGE_KEYS.CATEGORIES);
    if (!categories || categories.length === 0) {
        // Initialize default categories
        const defaultCategories: Category[] = [
            { id: 'design', name: 'Design' },
            { id: 'development', name: 'Development' },
            { id: 'writing', name: 'Writing' },
            { id: 'home-services', name: 'Home Services' },
            { id: 'lessons', name: 'Lessons' },
            { id: 'wellness', name: 'Wellness' },
            { id: 'photography', name: 'Photography' },
            { id: 'marketing', name: 'Marketing' },
        ];
        setItem(STORAGE_KEYS.CATEGORIES, defaultCategories);
        return defaultCategories;
    }
    return categories;
}

export function addCategory(category: Category): void {
    const categories = getCategories();
    categories.push(category);
    setItem(STORAGE_KEYS.CATEGORIES, categories);
}

export function deleteCategory(id: string): void {
    const categories = getCategories();
    const filtered = categories.filter(c => c.id !== id);
    setItem(STORAGE_KEYS.CATEGORIES, filtered);
}

// Onboarding
export function hasCompletedOnboarding(): boolean {
    return getItem<boolean>(STORAGE_KEYS.ONBOARDING) || false;
}

export function setOnboardingComplete(): void {
    setItem(STORAGE_KEYS.ONBOARDING, true);
}

// Favorites
export function getFavorites(userId: string): string[] {
    const allFavorites = getItem<Record<string, string[]>>(STORAGE_KEYS.FAVORITES) || {};
    return allFavorites[userId] || [];
}

export function toggleFavorite(userId: string, listingId: string): void {
    const allFavorites = getItem<Record<string, string[]>>(STORAGE_KEYS.FAVORITES) || {};
    const userFavorites = allFavorites[userId] || [];

    const index = userFavorites.indexOf(listingId);
    if (index > -1) {
        userFavorites.splice(index, 1);
    } else {
        userFavorites.push(listingId);
    }

    allFavorites[userId] = userFavorites;
    setItem(STORAGE_KEYS.FAVORITES, allFavorites);
}

// Initialize demo data
export function initializeDemoData(): void {
    // Only initialize if no users exist
    const users = getAllUsers();
    if (users.length === 0) {
        // Create admin user
        const admin: User = {
            id: 'admin_1',
            email: 'admin@handee247.com',
            password: 'admin123',
            name: 'Admin User',
            role: 'admin',
            rating: 5.0,
            createdAt: new Date().toISOString(),
        };
        addUser(admin);

        // Create demo users
        const demoUsers: User[] = [
            {
                id: 'user_1',
                email: 'sarah@example.com',
                password: 'password123',
                name: 'Sarah Jenkins',
                location: 'Remote',
                bio: 'Professional graphic designer with 5+ years experience',
                role: 'user',
                rating: 4.9,
                createdAt: new Date().toISOString(),
            },
            {
                id: 'user_2',
                email: 'mike@example.com',
                password: 'password123',
                name: 'Mike Thompson',
                location: 'New York, NY',
                bio: 'Licensed plumber and handyman',
                role: 'user',
                rating: 4.5,
                createdAt: new Date().toISOString(),
            },
            {
                id: 'user_3',
                email: 'alex@example.com',
                password: 'password123',
                name: 'Alex Davis',
                location: 'Remote',
                bio: 'Senior React developer and coding instructor',
                role: 'user',
                rating: 5.0,
                createdAt: new Date().toISOString(),
            },
        ];

        demoUsers.forEach(addUser);

        // Create demo listings
        const demoListings: Listing[] = [
            {
                id: 'listing_1',
                userId: 'user_1',
                title: 'Professional Logo Design',
                description: 'I will create a unique, professional logo for your business or brand.',
                category: 'design',
                location: 'Remote',
                type: 'offer',
                images: [],
                createdAt: new Date().toISOString(),
                status: 'active',
            },
            {
                id: 'listing_2',
                userId: 'user_2',
                title: 'Plumbing Help Needed',
                description: 'Looking for someone to help fix a leaky faucet in my kitchen.',
                category: 'home-services',
                location: 'New York, NY',
                type: 'request',
                images: [],
                createdAt: new Date().toISOString(),
                status: 'active',
            },
            {
                id: 'listing_3',
                userId: 'user_3',
                title: 'React.js Tutoring',
                description: 'One-on-one React tutoring sessions for beginners to advanced developers.',
                category: 'development',
                location: 'Remote',
                type: 'offer',
                images: [],
                createdAt: new Date().toISOString(),
                status: 'active',
            },
        ];

        demoListings.forEach(addListing);
    }
}
