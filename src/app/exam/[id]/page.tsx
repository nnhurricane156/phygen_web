"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { getExamQuestions, ExamQuestion } from "@/lib/api";

// Helper function to render text with LaTeX math expressions
const renderMathText = (text: string) => {
    if (!text) return null;
    
    // Split text by LaTeX delimiters
    const parts = text.split(/(\$[^$]+\$|\$\$[^$]+\$\$)/);
    
    return parts.map((part, index) => {
        if (part.match(/^\$\$.*\$\$$/)) {
            // Block math (display mode)
            const math = part.slice(2, -2);
            try {
                return <BlockMath key={index} math={math} />;
            } catch (error) {
                console.warn('KaTeX error for block math:', math, error);
                return <span key={index} className="text-red-500">{part}</span>;
            }
        } else if (part.match(/^\$.*\$$/)) {
            // Inline math
            const math = part.slice(1, -1);
            try {
                return <InlineMath key={index} math={math} />;
            } catch (error) {
                console.warn('KaTeX error for inline math:', math, error);
                return <span key={index} className="text-red-500">{part}</span>;
            }
        } else {
            // Regular text
            return <span key={index}>{part}</span>;
        }
    });
};

export default function ExamDetailsPage() {
    const params = useParams();
    const examId = params?.id as string;
    
    const [examQuestions, setExamQuestions] = useState<ExamQuestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    // Handle client-side mounting
    useEffect(() => {
        setMounted(true);
    }, []);

    // Fetch exam questions
    useEffect(() => {
        if (!mounted || !examId) return;

        const fetchExamQuestions = async () => {
            try {
                setLoading(true);
                setError(null);
                const questions = await getExamQuestions(examId);
                setExamQuestions(questions);
                console.log('✅ Exam questions loaded:', questions);
            } catch (err) {
                console.error('❌ Error loading exam questions:', err);
                setError(err instanceof Error ? err.message : 'Failed to load exam questions');
            } finally {
                setLoading(false);
            }
        };

        fetchExamQuestions();
    }, [mounted, examId]);

    // Get difficulty label
    const getDifficultyLabel = (difficulty: number) => {
        const labels = ['Easy', 'Medium', 'Hard', 'Expert'];
        return labels[difficulty] || 'Unknown';
    };

    // Get difficulty color
    const getDifficultyColor = (difficulty: number) => {
        const colors = ['text-green-600', 'text-yellow-600', 'text-orange-600', 'text-red-600'];
        return colors[difficulty] || 'text-gray-600';
    };

    // Don't render until mounted to prevent hydration issues
    if (!mounted) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="text-gray-500 mt-4">Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <Link 
                                href="/examHistory" 
                                className="text-indigo-600 hover:text-indigo-700 font-medium mb-2 inline-block"
                            >
                                ← Back to Exam History
                            </Link>
                            <h1 className="text-3xl font-bold text-gray-900">Exam Questions</h1>
                            <p className="text-gray-600 mt-2">Exam ID: {examId}</p>
                        </div>
                        <div className="flex gap-4">
                            <Link 
                                href="/examHistory" 
                                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Back to History
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-lg shadow-md">
                    {loading ? (
                        <div className="text-center py-16">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                            <p className="text-gray-500 mt-4">Loading exam questions...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-16 px-6">
                            <div className="text-red-500 mb-4">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Questions</h3>
                            <p className="text-red-600 mb-4">⚠️ {error}</p>
                            <button 
                                onClick={() => window.location.reload()}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : examQuestions.length === 0 ? (
                        <div className="text-center py-16 px-6">
                            <div className="text-gray-400 mb-4">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Questions Found</h3>
                            <p className="text-gray-600 mb-6">This exam doesn't have any questions yet.</p>
                            <Link 
                                href="/examHistory" 
                                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors inline-block"
                            >
                                Back to Exam History
                            </Link>
                        </div>
                    ) : (
                        <div className="p-6">
                            {/* Exam Summary */}
                            <div className="border-b pb-6 mb-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            Physics Exam Questions
                                        </h2>
                                        <p className="text-gray-600 mt-1">
                                            Total Questions: {examQuestions.length}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        {examQuestions.length > 0 && (
                                            <div className="text-sm text-gray-600">
                                                <span className="font-medium">Subject: </span>
                                                {examQuestions[0].className}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Questions List */}
                            <div className="space-y-8">
                                {examQuestions.map((question, index) => (
                                    <div key={question.id} className="border border-gray-200 rounded-lg p-6">
                                        {/* Question Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
                                                        Question {index + 1}
                                                    </span>
                                                    <span className={`text-sm font-medium px-2 py-1 rounded ${getDifficultyColor(question.difficulty)}`}>
                                                        {getDifficultyLabel(question.difficulty)}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-3">
                                                    {renderMathText(question.question)}
                                                </h3>
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                        </svg>
                                                        {question.chapterName}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                        </svg>
                                                        {question.topicName}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                        </svg>
                                                        {question.className}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Answer Options */}
                                        <div className="space-y-3">
                                            {[
                                                { key: 'A', value: question.a },
                                                { key: 'B', value: question.b },
                                                { key: 'C', value: question.c },
                                                { key: 'D', value: question.d }
                                            ].map((option) => (
                                                <div
                                                    key={option.key}
                                                    className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg bg-gray-50"
                                                >
                                                    <div className="flex-shrink-0">
                                                        <span className="inline-flex items-center justify-center w-6 h-6 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700">
                                                            {option.key}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <span className="text-gray-900">{renderMathText(option.value)}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Correct Answer (if available) */}
                                        {question.answer && (
                                            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span className="text-sm font-medium text-green-800">
                                                        Correct Answer: {question.answer.toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-600">
                                        Showing {examQuestions.length} questions
                                    </div>
                                    <Link
                                        href="/examHistory"
                                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        Back to Exam History
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
