'use client';

import { CheckCircle, Circle, Clock } from "lucide-react";

export function DealStatus({ status }: { status: 'proposed' | 'accepted' | 'in_progress' | 'completed' }) {
    const steps = [
        { id: 'proposed', label: 'Proposed' },
        { id: 'accepted', label: 'Accepted' },
        { id: 'in_progress', label: 'In Progress' },
        { id: 'completed', label: 'Completed' },
    ];

    const currentStepIndex = steps.findIndex(s => s.id === status);

    return (
        <div className="w-full py-4">
            <div className="relative flex items-center justify-between w-full">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
                <div
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-brand-teal -z-10 transition-all duration-500"
                    style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                ></div>

                {steps.map((step, index) => {
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;

                    return (
                        <div key={step.id} className="flex flex-col items-center bg-white px-2">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${isCompleted
                                        ? "bg-brand-teal border-brand-teal text-white"
                                        : "bg-white border-gray-300 text-gray-300"
                                    }`}
                            >
                                {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                            </div>
                            <span className={`text-xs font-medium mt-2 ${isCurrent ? "text-brand-teal" : "text-gray-500"}`}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
