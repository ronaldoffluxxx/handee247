'use client';

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";

export default function CategoriesPage() {
    const [newCategory, setNewCategory] = useState("");

    // Mock Data
    const categories = [
        { id: 1, name: "Design", count: 156, slug: "design" },
        { id: 2, name: "Development", count: 89, slug: "development" },
        { id: 3, name: "Writing", count: 64, slug: "writing" },
        { id: 4, name: "Home Services", count: 210, slug: "home-services" },
        { id: 5, name: "Lessons", count: 45, slug: "lessons" },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Category Management</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Add Category Form */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <Input
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    placeholder="e.g. Photography"
                                />
                            </div>
                            <Button className="w-full">
                                <Plus className="w-4 h-4 mr-2" /> Create Category
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Category List */}
                <div className="md:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">All Categories</h2>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {categories.map((cat) => (
                                <div key={cat.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                    <div>
                                        <h3 className="font-medium text-gray-900">{cat.name}</h3>
                                        <p className="text-xs text-gray-500">{cat.count} listings</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-2 text-gray-400 hover:text-brand-teal rounded-full hover:bg-teal-50">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
