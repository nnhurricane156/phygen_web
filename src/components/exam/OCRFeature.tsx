"use client";

import React, { useState, useRef } from "react";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { processImageToQuestions, ExamQuestion, getAllChapters, getTopicsByChapter, getChapterById, getTopicById, saveQuestion, SaveQuestionRequest, Chapter, Topic } from "@/lib/api";

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

interface OCRFeatureProps {
    onQuestionsExtracted?: (questions: ExamQuestion[]) => void;
}

export default function OCRFeature({ onQuestionsExtracted }: OCRFeatureProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [extractedQuestions, setExtractedQuestions] = useState<ExamQuestion[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
    const [questionStates, setQuestionStates] = useState<{ [key: string]: { chapterId: number; topicId: number; difficulty: number; saving: boolean; saved: boolean } }>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load chapters on mount
    React.useEffect(() => {
        const loadChapters = async () => {
            try {
                const chaptersData = await getAllChapters();
                setChapters(chaptersData);
            } catch (err) {
                console.error('Error loading chapters:', err);
            }
        };
        loadChapters();
    }, []);

    // Load topics when chapter changes
    const loadTopicsForChapter = async (chapterId: number) => {
        try {
            const topicsData = await getTopicsByChapter(chapterId);
            setTopics(topicsData);
        } catch (err) {
            console.error('Error loading topics:', err);
        }
    };

    // Handle chapter change for a specific question
    const handleChapterChange = async (questionId: string, chapterId: number) => {
        setQuestionStates(prev => ({
            ...prev,
            [questionId]: {
                ...prev[questionId],
                chapterId,
                topicId: 0 // Reset topic when chapter changes
            }
        }));
        
        // Load topics for the new chapter if not already loaded
        const hasTopicsForChapter = topics.some(topic => topic.chapterId === chapterId);
        if (!hasTopicsForChapter && chapterId > 0) {
            try {
                const newTopics = await getTopicsByChapter(chapterId);
                setTopics(prev => {
                    // Remove existing topics for this chapter and add new ones
                    const filtered = prev.filter(topic => topic.chapterId !== chapterId);
                    return [...filtered, ...newTopics];
                });
            } catch (err) {
                console.error(`Error loading topics for chapter ${chapterId}:`, err);
            }
        }
        
        setSelectedChapter(chapterId);
    };

    // Handle topic change for a specific question
    const handleTopicChange = (questionId: string, topicId: number) => {
        setQuestionStates(prev => ({
            ...prev,
            [questionId]: {
                ...prev[questionId],
                topicId
            }
        }));
    };

    // Handle difficulty change for a specific question
    const handleDifficultyChange = (questionId: string, difficulty: number) => {
        setQuestionStates(prev => ({
            ...prev,
            [questionId]: {
                ...prev[questionId],
                difficulty
            }
        }));
    };

    // Save question to database
    const handleSaveQuestion = async (question: ExamQuestion) => {
        const questionState = questionStates[question.id];
        
        // Use question's default values as fallback
        const chapterId = questionState?.chapterId || question.chapterId;
        const topicId = questionState?.topicId || question.topicId;
        const difficulty = questionState?.difficulty ?? question.difficulty ?? 0;
        
        if (!chapterId || !topicId) {
            alert('Please select chapter and topic before saving.');
            return;
        }

        setQuestionStates(prev => ({
            ...prev,
            [question.id]: {
                ...prev[question.id],
                chapterId,
                topicId,
                difficulty,
                saving: true,
                saved: false
            }
        }));

        try {
            const saveData: SaveQuestionRequest = {
                classId: 1, // Default class ID
                chapterId,
                topicId,
                questionContent: question.question,
                difficulty,
                questionOptionSet: {
                    a: question.a,
                    b: question.b,
                    c: question.c,
                    d: question.d,
                    correct: question.answer || "A" // Default to A if no answer
                }
            };

            await saveQuestion(saveData);

            setQuestionStates(prev => ({
                ...prev,
                [question.id]: {
                    ...prev[question.id],
                    saving: false,
                    saved: true
                }
            }));

            console.log('✅ Question saved successfully');
        } catch (err) {
            console.error('❌ Error saving question:', err);
            setQuestionStates(prev => ({
                ...prev,
                [question.id]: {
                    ...prev[question.id],
                    saving: false
                }
            }));
            alert('Failed to save question. Please try again.');
        }
    };

    // Handle file selection
    const handleFileChange = async (file: File) => {
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            setError('Please upload a valid image (JPG, PNG) or PDF file.');
            return;
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            setError('File size must be less than 10MB.');
            return;
        }

        try {
            setIsProcessing(true);
            setError(null);
            setExtractedQuestions([]);

            console.log('Processing file:', file.name);
            const questions = await processImageToQuestions(file);
            
            // Fetch chapter and topic names for questions that have IDs but missing names
            const updatedQuestions = await Promise.all(questions.map(async (question) => {
                let updatedQuestion = { ...question };
                
                // Fetch chapter name if we have chapterId but no chapterName
                if (question.chapterId && !question.chapterName) {
                    try {
                        const chapter = await getChapterById(question.chapterId);
                        updatedQuestion.chapterName = chapter.chapterName;
                    } catch (err) {
                        console.error(`Error fetching chapter ${question.chapterId}:`, err);
                        updatedQuestion.chapterName = `Chapter ${question.chapterId}`;
                    }
                }
                
                // Fetch topic name if we have topicId but no topicName
                if (question.topicId && !question.topicName) {
                    try {
                        const topic = await getTopicById(question.topicId);
                        updatedQuestion.topicName = topic.topicName;
                    } catch (err) {
                        console.error(`Error fetching topic ${question.topicId}:`, err);
                        updatedQuestion.topicName = `Topic ${question.topicId}`;
                    }
                }
                
                return updatedQuestion;
            }));
            
            setExtractedQuestions(updatedQuestions);
            
            // Initialize question states with defaults from the extracted data
            const initialStates: { [key: string]: { chapterId: number; topicId: number; difficulty: number; saving: boolean; saved: boolean } } = {};
            const chapterIds = new Set<number>();
            
            updatedQuestions.forEach(question => {
                initialStates[question.id] = {
                    chapterId: question.chapterId || 0,
                    topicId: question.topicId || 0,
                    difficulty: question.difficulty || 0,
                    saving: false,
                    saved: false
                };
                
                // Collect unique chapter IDs to load topics
                if (question.chapterId) {
                    chapterIds.add(question.chapterId);
                }
            });
            setQuestionStates(initialStates);
            
            // Load topics for all chapters present in the questions
            const allTopics: Topic[] = [];
            for (const chapterId of chapterIds) {
                try {
                    const chapterTopics = await getTopicsByChapter(chapterId);
                    allTopics.push(...chapterTopics);
                } catch (err) {
                    console.error(`Error loading topics for chapter ${chapterId}:`, err);
                }
            }
            setTopics(allTopics);
            
            // Set the selected chapter to the first question's chapter if available
            if (updatedQuestions.length > 0 && updatedQuestions[0].chapterId) {
                setSelectedChapter(updatedQuestions[0].chapterId);
            }
            
            onQuestionsExtracted?.(questions);
            
            console.log('✅ Questions extracted successfully:', questions.length, 'questions');
        } catch (err) {
            console.error('❌ Error processing file:', err);
            setError(err instanceof Error ? err.message : 'Failed to process file');
        } finally {
            setIsProcessing(false);
        }
    };

    // Handle drag and drop
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer.files[0]);
        }
    };

    // Handle file input click
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileChange(e.target.files[0]);
        }
    };

    // Get difficulty label and color
    const getDifficultyLabel = (difficulty: number) => {
        const labels = ['Easy', 'Medium', 'Hard', 'Expert'];
        return labels[difficulty] || 'Unknown';
    };

    const getDifficultyColor = (difficulty: number) => {
        const colors = ['bg-green-100 text-green-800', 'bg-yellow-100 text-yellow-800', 'bg-orange-100 text-orange-800', 'bg-red-100 text-red-800'];
        return colors[difficulty] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            {/* Header */}
            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">OCR Question Extraction</h3>
                <p className="text-gray-600">Upload images or PDFs to automatically extract physics questions using AI</p>
            </div>

            {/* File Upload Area */}
            <div className="mb-6">
                <div
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        dragActive
                            ? 'border-purple-400 bg-purple-50'
                            : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileInputChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isProcessing}
                    />
                    
                    {isProcessing ? (
                        <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
                            <p className="text-purple-600 font-medium">Processing file...</p>
                            <p className="text-sm text-gray-500 mt-1">This may take a few moments</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="text-lg font-medium text-gray-700 mb-2">
                                Drop your file here or click to browse
                            </p>
                            <p className="text-sm text-gray-500">
                                Supports: JPG, PNG, PDF (max 10MB)
                            </p>
                        </div>
                    )}
                </div>

                {/* File Format Examples */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg">
                        <svg className="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-gray-700">Image Files</span>
                    </div>
                    <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg">
                        <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm text-gray-700">PDF Documents</span>
                    </div>
                    <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg">
                        <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="text-sm text-gray-700">AI Processing</span>
                    </div>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-red-700">{error}</p>
                    </div>
                </div>
            )}

            {/* Extracted Questions */}
            {extractedQuestions.length > 0 && (
                <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">
                            Extracted Questions ({extractedQuestions.length})
                        </h4>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            ✓ Extraction Complete
                        </span>
                    </div>

                    <div className="space-y-6 max-h-[1200px] overflow-y-auto">
                        {extractedQuestions.map((question, index) => (
                            <div key={question.id || index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                {/* Question Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <span className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
                                        Question {index + 1}
                                    </span>
                                    <div className="flex gap-2">
                                        <span className={`text-xs font-medium px-2 py-1 rounded ${getDifficultyColor(question.difficulty)}`}>
                                            {getDifficultyLabel(question.difficulty)}
                                        </span>
                                    </div>
                                </div>

                                {/* Question Text */}
                                <h5 className="font-medium text-gray-900 mb-3">
                                    {renderMathText(question.question)}
                                </h5>

                                {/* Answer Options */}
                                <div className="grid grid-cols-1 gap-2 mb-3">
                                    {[
                                        { key: 'A', value: question.a },
                                        { key: 'B', value: question.b },
                                        { key: 'C', value: question.c },
                                        { key: 'D', value: question.d }
                                    ].map((option) => (
                                        <div key={option.key} className="flex items-start space-x-2">
                                            <span className="inline-flex items-center justify-center w-5 h-5 bg-white border border-gray-300 rounded-full text-xs font-medium text-gray-700 flex-shrink-0">
                                                {option.key}
                                            </span>
                                            <span className="text-sm text-gray-700 flex-1">{renderMathText(option.value)}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Question Metadata */}
                                <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-4">
                                    <span className="flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                        {question.chapterName}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                        {question.topicName}
                                    </span>
                                </div>

                                {/* Review Controls */}
                                <div className="bg-white border border-gray-200 rounded-lg p-4 mt-4">
                                    <h6 className="text-sm font-medium text-gray-900 mb-3">Review & Save Question</h6>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        {/* Chapter Dropdown */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Chapter
                                            </label>
                                            <select
                                                value={questionStates[question.id]?.chapterId || question.chapterId || 0}
                                                onChange={(e) => handleChapterChange(question.id, parseInt(e.target.value))}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            >
                                                <option value={0}>Select Chapter</option>
                                                {chapters.map((chapter) => (
                                                    <option key={chapter.id} value={chapter.id}>
                                                        {chapter.chapterName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Topic Dropdown */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Topic
                                            </label>
                                            <select
                                                value={questionStates[question.id]?.topicId || question.topicId || 0}
                                                onChange={(e) => handleTopicChange(question.id, parseInt(e.target.value))}
                                                disabled={!(questionStates[question.id]?.chapterId || question.chapterId)}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            >
                                                <option value={0}>Select Topic</option>
                                                {topics.filter(topic => topic.chapterId === (questionStates[question.id]?.chapterId || question.chapterId)).map((topic) => (
                                                    <option key={topic.id} value={topic.id}>
                                                        {topic.topicName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Difficulty Dropdown */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Difficulty
                                            </label>
                                            <select
                                                value={questionStates[question.id]?.difficulty ?? question.difficulty ?? 0}
                                                onChange={(e) => handleDifficultyChange(question.id, parseInt(e.target.value))}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            >
                                                <option value={0}>Easy</option>
                                                <option value={1}>Medium</option>
                                                <option value={2}>Hard</option>
                                                <option value={3}>Expert</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Save Button */}
                                    <div className="flex justify-end">
                                        {questionStates[question.id]?.saved ? (
                                            <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 text-sm font-medium rounded-md">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Saved Successfully
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => handleSaveQuestion(question)}
                                                disabled={
                                                    questionStates[question.id]?.saving || 
                                                    !(questionStates[question.id]?.chapterId || question.chapterId) || 
                                                    !(questionStates[question.id]?.topicId || question.topicId)
                                                }
                                                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                            >
                                                {questionStates[question.id]?.saving ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                                        </svg>
                                                        Save Question
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
