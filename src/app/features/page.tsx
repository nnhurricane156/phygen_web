"use client";

import Link from "next/link";
import { useState } from "react";

export default function FeaturesPage() {
    const [activeFeature, setActiveFeature] = useState<string | null>(null);

    const features = [
        {
            id: "dropdown-generation",
            title: "Dropdown-Based Exam Generation",
            description: "Create structured physics exams with precise control over content and difficulty",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            ),
            color: "bg-blue-500",
            details: [
                "Select from available physics chapters",
                "Choose specific topics within chapters",
                "Set difficulty levels: Easy, Medium, Hard, Expert",
                "Control question quantity (10, 20, 30, or 50 questions)",
                "Instant validation and error handling"
            ],
            benefits: [
                "Precise control over exam content",
                "Consistent question quality",
                "Structured learning progression",
                "Easy to repeat and modify"
            ]
        },
        {
            id: "ai-prompt-generation",
            title: "AI Prompt-Based Generation",
            description: "Generate custom exams using natural language descriptions in Vietnamese or English",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            ),
            color: "bg-purple-500",
            details: [
                "Natural language input in Vietnamese or English",
                "Flexible question distribution across chapters",
                "Custom difficulty combinations",
                "Smart AI interpretation of requirements",
                "Pre-built example prompts for guidance"
            ],
            benefits: [
                "Maximum flexibility in exam creation",
                "Bilingual support",
                "Complex requirement handling",
                "Time-saving with intelligent defaults"
            ],
            examples: [
                "Tạo đề gồm 10 câu, trong đó có 3 câu thuộc chương 1, 2 câu chương 3, còn lại tự chọn.",
                "Create 15 physics questions about mechanics and thermodynamics, medium difficulty.",
                "Generate 20 questions covering all chapters with varying difficulty levels."
            ]
        },
        {
            id: "exam-history",
            title: "Comprehensive Exam Management",
            description: "View, manage, and download your previously created physics exams",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            color: "bg-green-500",
            details: [
                "Complete exam history with metadata",
                "Clickable exam titles to view questions",
                "Download exams as Word documents",
                "Exam statistics and insights",
                "Search and filter capabilities"
            ],
            benefits: [
                "Easy exam reuse and sharing",
                "Professional document generation",
                "Progress tracking",
                "Quick access to past work"
            ]
        },
        {
            id: "question-viewer",
            title: "Interactive Question Viewer",
            description: "Browse through exam questions with detailed metadata and formatting",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            ),
            color: "bg-indigo-500",
            details: [
                "Clean, readable question formatting",
                "Multiple choice options (A, B, C, D)",
                "Chapter and topic information",
                "Difficulty level indicators",
                "Correct answer highlighting"
            ],
            benefits: [
                "Easy question review",
                "Professional presentation",
                "Educational metadata",
                "Print-friendly layout"
            ]
        },
        {
            id: "authentication",
            title: "Secure Authentication System",
            description: "Multi-method authentication with JWT tokens and Google integration",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            ),
            color: "bg-red-500",
            details: [
                "JWT token-based authentication",
                "Google OAuth integration",
                "Secure session management",
                "Role-based access control",
                "Automatic token refresh"
            ],
            benefits: [
                "Secure user data protection",
                "Seamless login experience",
                "Multiple authentication options",
                "Enterprise-grade security"
            ]
        },
        {
            id: "responsive-design",
            title: "Modern Responsive Design",
            description: "Beautiful, mobile-friendly interface that works across all devices",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
            ),
            color: "bg-yellow-500",
            details: [
                "Mobile-first responsive design",
                "Clean, modern UI components",
                "Intuitive navigation",
                "Loading states and animations",
                "Accessible design patterns"
            ],
            benefits: [
                "Works on any device",
                "Professional appearance",
                "Great user experience",
                "Fast and efficient"
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center text-gray-700 hover:text-gray-900">
                                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Home
                            </Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/createExam"
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Try Features
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Powerful Physics Exam Features
                        </h1>
                        <p className="text-xl md:text-2xl text-indigo-200 mb-8 max-w-3xl mx-auto">
                            Discover all the advanced capabilities that make PhyGen the ultimate physics exam generation platform
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/createExam"
                                className="bg-white text-indigo-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                            >
                                Start Creating Exams
                            </Link>
                            <Link
                                href="/examHistory"
                                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-900 transition-colors"
                            >
                                View Exam History
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Complete Feature Overview
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        From AI-powered generation to comprehensive management, explore every feature that makes PhyGen your perfect physics exam companion.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature) => (
                        <div
                            key={feature.id}
                            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                            onClick={() => setActiveFeature(activeFeature === feature.id ? null : feature.id)}
                        >
                            {/* Feature Card Header */}
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    <div className={`${feature.color} text-white p-3 rounded-lg mr-4`}>
                                        {feature.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                            {feature.title}
                                        </h3>
                                    </div>
                                    <svg
                                        className={`w-5 h-5 text-gray-400 transition-transform ${activeFeature === feature.id ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                                <p className="text-gray-600 mb-4">
                                    {feature.description}
                                </p>
                            </div>

                            {/* Expandable Content */}
                            {activeFeature === feature.id && (
                                <div className="border-t border-gray-200 p-6 bg-gray-50">
                                    <div className="space-y-6">
                                        {/* Key Features */}
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                                            <ul className="space-y-2">
                                                {feature.details.map((detail, index) => (
                                                    <li key={index} className="flex items-start">
                                                        <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        <span className="text-sm text-gray-700">{detail}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Benefits */}
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-3">Benefits:</h4>
                                            <ul className="space-y-2">
                                                {feature.benefits.map((benefit, index) => (
                                                    <li key={index} className="flex items-start">
                                                        <svg className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                        </svg>
                                                        <span className="text-sm text-gray-700">{benefit}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Examples (for AI feature) */}
                                        {feature.examples && (
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-3">Example Prompts:</h4>
                                                <div className="space-y-2">
                                                    {feature.examples.map((example, index) => (
                                                        <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
                                                            <span className="text-sm text-gray-700 italic">"{example}"</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Call to Action */}
            <div className="bg-indigo-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Ready to Experience These Features?
                        </h2>
                        <p className="text-xl text-indigo-200 mb-8 max-w-2xl mx-auto">
                            Start creating professional physics exams today with our comprehensive feature set.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/createExam"
                                className="bg-white text-indigo-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                            >
                                Create Your First Exam
                            </Link>
                            <Link
                                href="/register"
                                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-indigo-900 transition-colors"
                            >
                                Sign Up for Free
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics Section */}
            <div className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-indigo-600 mb-2">2</div>
                            <div className="text-gray-600">Generation Methods</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-indigo-600 mb-2">4</div>
                            <div className="text-gray-600">Difficulty Levels</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-indigo-600 mb-2">50+</div>
                            <div className="text-gray-600">Questions per Exam</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-indigo-600 mb-2">∞</div>
                            <div className="text-gray-600">Exam Possibilities</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
