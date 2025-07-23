"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getUserExams, downloadExamWord, ExamSet } from "@/lib/api";

export default function ExamHistoryPage() {
    const [examSets, setExamSets] = useState<ExamSet[]>([]);
    const [loadingExams, setLoadingExams] = useState(false);
    const [examsError, setExamsError] = useState<string | null>(null);
    const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());
    const [mounted, setMounted] = useState(false);

    // Handle client-side mounting
    useEffect(() => {
        setMounted(true);
    }, []);

    // Fetch user's exam history
    useEffect(() => {
        if (!mounted) return;

        const fetchExamHistory = async () => {
            try {
                setLoadingExams(true);
                setExamsError(null);
                const exams = await getUserExams();
                setExamSets(exams);
                console.log('✅ Exam history loaded:', exams);
            } catch (err) {
                console.error('❌ Error loading exam history:', err);
                setExamsError(err instanceof Error ? err.message : 'Failed to load exam history');
            } finally {
                setLoadingExams(false);
            }
        };

        fetchExamHistory();
    }, [mounted]);

    // Handle exam download
    const handleDownload = async (examSet: ExamSet) => {
        if (!mounted) return;

        try {
            setDownloadingIds(prev => new Set(prev).add(examSet.id));
            await downloadExamWord(examSet.id);
        } catch (err) {
            console.error('❌ Error downloading exam:', err);
            alert(err instanceof Error ? err.message : 'Failed to download exam');
        } finally {
            setDownloadingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(examSet.id);
                return newSet;
            });
        }
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        if (!mounted) return dateString;
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get status badge color
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'generated':
                return 'bg-green-100 text-green-800';
            case 'draft':
                return 'bg-yellow-100 text-yellow-800';
            case 'published':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Exam History</h1>
                            <p className="text-gray-600 mt-2">Manage and download your physics exams</p>
                        </div>
                        <div className="flex gap-4">
                            <Link 
                                href="/createExam" 
                                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Create New Exam
                            </Link>
                            <Link 
                                href="/" 
                                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Exam List */}
                <div className="bg-white rounded-lg shadow-md">
                    {loadingExams ? (
                        <div className="text-center py-16">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                            <p className="text-gray-500 mt-4">Loading your exams...</p>
                        </div>
                    ) : examsError ? (
                        <div className="text-center py-16">
                            <div className="text-red-500 mb-4">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Exams</h3>
                            <p className="text-red-600 mb-4">⚠️ {examsError}</p>
                            <button 
                                onClick={() => window.location.reload()}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : examSets.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-gray-400 mb-4">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Exams Found</h3>
                            <p className="text-gray-600 mb-6">You haven't created any exams yet.</p>
                            <Link 
                                href="/createExam" 
                                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors inline-block"
                            >
                                Create Your First Exam
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-hidden">
                            {/* Table Header */}
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-900">
                                    <div className="col-span-4">Exam Title</div>
                                    <div className="col-span-3">Description</div>
                                    <div className="col-span-2">Created</div>
                                    <div className="col-span-1">Status</div>
                                    <div className="col-span-2">Actions</div>
                                </div>
                            </div>

                            {/* Table Body */}
                            <div className="divide-y divide-gray-200">
                                {examSets.map((exam) => (
                                    <div key={exam.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                        <div className="grid grid-cols-12 gap-4 items-center">
                                            {/* Title */}
                                            <div className="col-span-4">
                                                <Link 
                                                    href={`/exam/${exam.id}`}
                                                    className="block hover:text-indigo-600 transition-colors"
                                                >
                                                    <h3 className="text-sm font-medium text-gray-900 mb-1 hover:text-indigo-600 cursor-pointer">
                                                        {exam.title}
                                                    </h3>
                                                </Link>
                                                <p className="text-xs text-gray-500">
                                                    ID: {exam.id.substring(0, 8)}...
                                                </p>
                                            </div>

                                            {/* Description */}
                                            <div className="col-span-3">
                                                <p className="text-sm text-gray-600 line-clamp-2">
                                                    {exam.description}
                                                </p>
                                            </div>

                                            {/* Created Date */}
                                            <div className="col-span-2">
                                                <p className="text-sm text-gray-600">
                                                    {formatDate(exam.createdAt)}
                                                </p>
                                            </div>

                                            {/* Status */}
                                            <div className="col-span-1">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(exam.status)}`}>
                                                    {exam.status}
                                                </span>
                                            </div>

                                            {/* Actions */}
                                            <div className="col-span-2">
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={`/exam/${exam.id}`}
                                                        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        View
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDownload(exam)}
                                                        disabled={downloadingIds.has(exam.id)}
                                                        className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                                            downloadingIds.has(exam.id)
                                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                        }`}
                                                    >
                                                        {downloadingIds.has(exam.id) ? (
                                                            <>
                                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                                                <span className="hidden sm:inline">Downloading...</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                </svg>
                                                                <span className="hidden sm:inline">Download</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Statistics */}
                {examSets.length > 0 && (
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Exams</p>
                                    <p className="text-2xl font-bold text-gray-900">{examSets.length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Generated Exams</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {examSets.filter(exam => exam.status.toLowerCase() === 'generated').length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">This Month</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {examSets.filter(exam => {
                                            const examDate = new Date(exam.createdAt);
                                            const now = new Date();
                                            return examDate.getMonth() === now.getMonth() && 
                                                   examDate.getFullYear() === now.getFullYear();
                                        }).length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
