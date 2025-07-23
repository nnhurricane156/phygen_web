"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getAllChapters, getTopicsByChapter, generateExam, generateExamFromPrompt, Chapter, Topic, DifficultyLevel } from "@/lib/api";

export default function CreateExamForm() {
    // Tab state
    const [activeTab, setActiveTab] = useState<'dropdown' | 'prompt'>('dropdown');
    
    // Dropdown form states
    const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
    const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
    const [difficulty, setDifficulty] = useState<DifficultyLevel | null>(null);
    const [numberOfQuestions, setNumberOfQuestions] = useState<number>(10);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);
    
    // Prompt form states
    const [prompt, setPrompt] = useState<string>("");
    
    // Loading and error states
    const [loadingChapters, setLoadingChapters] = useState(false);
    const [loadingTopics, setLoadingTopics] = useState(false);
    const [generatingExam, setGeneratingExam] = useState(false);
    const [chaptersError, setChaptersError] = useState<string | null>(null);
    const [topicsError, setTopicsError] = useState<string | null>(null);
    const [examError, setExamError] = useState<string | null>(null);

    // Options for the dropdown form
    const difficultyLevels: DifficultyLevel[] = ["Easy", "Medium", "Hard", "Expert"];
    const questionOptions = [
        { value: 10, label: "10 Questions (Quick Quiz)" },
        { value: 20, label: "20 Questions (Standard Test)" },
        { value: 30, label: "30 Questions (Comprehensive Exam)" },
        { value: 50, label: "50 Questions (Final Exam)" }
    ];

    // Prompt examples
    const promptExamples = [
        "Tạo đề gồm 10 câu, trong đó có 3 câu thuộc chương 1, 2 câu chương 3, còn lại tự chọn.",
        "Create 15 physics questions about mechanics and thermodynamics, medium difficulty.",
        "Generate 20 questions covering all chapters with varying difficulty levels.",
        "Tạo đề thi 25 câu về điện học và quang học, độ khó trung bình đến khó.",
        "Create exam with 12 easy questions from chapter 1 and 8 hard questions from chapter 2."
    ];

    // Handle dropdown form submission
    const handleGenerateExamFromDropdown = async () => {
        if (!selectedChapter || !selectedTopic || !difficulty) {
            setExamError("Please complete all selections");
            return;
        }

        try {
            setGeneratingExam(true);
            setExamError(null);
            
            console.log("Generating exam with:", { 
                selectedChapter, 
                selectedTopic, 
                difficulty, 
                numberOfQuestions 
            });
            
            const examResult = await generateExam(
                selectedChapter,
                selectedTopic,
                difficulty,
                numberOfQuestions
            );
            
            console.log('✅ Exam generated from dropdown:', examResult);
            alert('Exam generated successfully from dropdown selection!');
            
        } catch (err) {
            console.error('❌ Error generating exam from dropdown:', err);
            setExamError(err instanceof Error ? err.message : 'Failed to generate exam');
        } finally {
            setGeneratingExam(false);
        }
    };

    // Handle prompt form submission
    const handleGenerateExamFromPrompt = async () => {
        if (!prompt.trim()) {
            setExamError("Please enter a prompt for exam generation");
            return;
        }

        try {
            setGeneratingExam(true);
            setExamError(null);
            
            console.log("Generating exam from prompt:", prompt);
            
            const examResult = await generateExamFromPrompt(prompt);
            
            console.log('✅ Exam generated from prompt:', examResult);
            alert('Exam generated successfully from prompt!');
            
            // Clear the prompt after successful generation
            setPrompt("");
            
        } catch (err) {
            console.error('❌ Error generating exam from prompt:', err);
            setExamError(err instanceof Error ? err.message : 'Failed to generate exam from prompt');
        } finally {
            setGeneratingExam(false);
        }
    };

    // Fetch chapters on component mount
    useEffect(() => {
        const fetchChapters = async () => {
            try {
                setLoadingChapters(true);
                setChaptersError(null);
                const chaptersData = await getAllChapters();
                setChapters(chaptersData);
                console.log('✅ Chapters loaded:', chaptersData);
            } catch (err) {
                console.error('❌ Error loading chapters:', err);
                setChaptersError(err instanceof Error ? err.message : 'Failed to load chapters');
            } finally {
                setLoadingChapters(false);
            }
        };

        fetchChapters();
    }, []);

    // Fetch topics when chapter changes
    useEffect(() => {
        const fetchTopics = async () => {
            if (!selectedChapter) {
                setTopics([]);
                setSelectedTopic(null);
                return;
            }

            try {
                setLoadingTopics(true);
                setTopicsError(null);
                setSelectedTopic(null); // Reset topic selection
                const topicsData = await getTopicsByChapter(selectedChapter, { pageNumber: 1 });
                setTopics(topicsData);
                console.log('✅ Topics loaded for chapter', selectedChapter, ':', topicsData);
            } catch (err) {
                console.error('❌ Error loading topics:', err);
                setTopicsError(err instanceof Error ? err.message : 'Failed to load topics');
                setTopics([]);
            } finally {
                setLoadingTopics(false);
            }
        };

        fetchTopics();
    }, [selectedChapter]);

    return (
        <div className="flex min-h-screen bg-white">
            {/* Sidebar/Navigation placeholder - for web version */}
            <div className="hidden md:block md:w-64 bg-gray-50 border-r border-gray-200">
                {/* Sidebar content would go here */}
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                {/* Header with back button */}
                <div className="border-b border-gray-200 p-4 flex items-center">
                    <Link href="/" className="flex items-center text-gray-700 hover:text-gray-900">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">Generate Exam</span>
                    </Link>
                </div>

                {/* Form content */}
                <div className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full">
                    <div className="bg-white rounded-xl md:shadow-md md:border border-gray-200 p-6">
                        {/* Tab Navigation */}
                        <div className="flex border-b border-gray-200 mb-8">
                            <button
                                type="button"
                                onClick={() => setActiveTab('dropdown')}
                                className={`cursor-pointer px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === 'dropdown'
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    Dropdown Selection
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('prompt')}
                                className={`cursor-pointer px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === 'prompt'
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    AI Prompt Generation
                                </div>
                            </button>
                        </div>

                        {/* Tab Content */}
                        {activeTab === 'dropdown' && (
                            <form onSubmit={(e) => { e.preventDefault(); handleGenerateExamFromDropdown(); }}>
                                <div className="space-y-8">
                                    {/* Chapter Selection */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800 mb-3">Select Physics Chapter</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {loadingChapters && (
                                                <div className="col-span-2 text-center py-4">
                                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                                                    <span className="text-gray-600">Loading chapters...</span>
                                                </div>
                                            )}
                                            {chaptersError && (
                                                <div className="col-span-2 p-4 bg-red-50 border border-red-200 rounded-md">
                                                    <p className="text-red-700">⚠️ {chaptersError}</p>
                                                </div>
                                            )}
                                            {chapters.map((chapter) => (
                                                <button
                                                key={chapter.id}
                                                type="button"
                                                onClick={() => setSelectedChapter(chapter.id)}
                                                className={`cursor-pointer p-4 rounded-lg border-2 text-left transition-all ${selectedChapter === chapter.id
                                                    ? "bg-indigo-600 text-white border-indigo-600"
                                                    : "bg-white text-gray-700 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50"
                                                    }`}
                                            >
                                                <div className="font-medium">{chapter.chapterName}</div>
                                                <div className={`text-sm mt-1 ${selectedChapter === chapter.id ? "text-indigo-100" : "text-gray-500"}`}>
                                                    Chapter ID: {chapter.id}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">Choose the physics chapter for your exam questions.</p>
                                </div>

                                {/* Topic Selection */}
                                {selectedChapter && (
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800 mb-3">Select Physics Topic</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {loadingTopics && (
                                                <div className="col-span-2 text-center py-4">
                                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                                                    <span className="text-gray-600">Loading topics...</span>
                                                </div>
                                            )}
                                            {topicsError && (
                                                <div className="col-span-2 p-4 bg-red-50 border border-red-200 rounded-md">
                                                    <p className="text-red-700">⚠️ {topicsError}</p>
                                                </div>
                                            )}
                                            {topics.map((topic) => (
                                                <button
                                                    key={topic.id}
                                                    type="button"
                                                    onClick={() => setSelectedTopic(topic.id)}
                                                    className={`cursor-pointer p-4 rounded-lg border-2 text-left transition-all ${selectedTopic === topic.id
                                                        ? "bg-indigo-600 text-white border-indigo-600"
                                                        : "bg-white text-gray-700 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50"
                                                        }`}
                                                >
                                                    <div className="font-medium">{topic.topicName}</div>
                                                    <div className={`text-sm mt-1 ${selectedTopic === topic.id ? "text-indigo-100" : "text-gray-500"}`}>
                                                        Topic ID: {topic.id}
                                                    </div>
                                                </button>
                                            ))}
                                            {!loadingTopics && topics.length === 0 && !topicsError && (
                                                <div className="col-span-2 text-center py-4 text-gray-500">
                                                    No topics found for this chapter
                                                </div>
                                            )}
                                        </div>
                                        <p className="mt-2 text-sm text-gray-500">Choose the specific topic within the chapter.</p>
                                    </div>
                                )}

                                {/* Difficulty Selection */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-800 mb-3">Select Difficulty</h3>
                                    <div className="flex flex-wrap gap-2 md:gap-4">
                                        {difficultyLevels.map((level) => (
                                            <button
                                                key={level}
                                                type="button"
                                                onClick={() => setDifficulty(level)}
                                                className={`cursor-pointer px-6 py-2 rounded-full ${difficulty === level
                                                    ? "bg-indigo-600 text-white"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    }`}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">Select the level of difficulty for the questions.</p>
                                </div>

                                {/* Number of Questions Selection */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-800 mb-3">Number of Questions</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {questionOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => setNumberOfQuestions(option.value)}
                                                className={`cursor-pointer p-3 rounded-lg border-2 text-center transition-all ${numberOfQuestions === option.value
                                                    ? "bg-indigo-600 text-white border-indigo-600"
                                                    : "bg-white text-gray-700 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50"
                                                    }`}
                                            >
                                                <div className="font-medium">{option.value}</div>
                                                <div className={`text-xs mt-1 ${numberOfQuestions === option.value ? "text-indigo-100" : "text-gray-500"}`}>
                                                    Questions
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">Choose how many questions you want in your exam.</p>
                                </div>

                                {/* Generate Exam Button */}
                                <div>
                                    {examError && (
                                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                                            <p className="text-red-700">⚠️ {examError}</p>
                                        </div>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={!selectedChapter || !selectedTopic || !difficulty || generatingExam}
                                        className={`cursor-pointer w-full py-4 text-base font-medium text-white rounded-lg transition-colors ${selectedChapter && selectedTopic && difficulty && !generatingExam
                                            ? "bg-indigo-600 hover:bg-indigo-700 shadow-lg"
                                            : "bg-gray-300 cursor-not-allowed"
                                            }`}
                                    >
                                        {generatingExam
                                            ? "🔄 Generating Exam..." 
                                            : selectedChapter && selectedTopic && difficulty 
                                                ? "🎯 Generate Physics Exam" 
                                                : "Please complete all selections"
                                        }
                                    </button>
                                </div>
                            </div>
                        </form>
                        )}

                        {/* Prompt Tab Content */}
                        {activeTab === 'prompt' && (
                            <form onSubmit={(e) => { e.preventDefault(); handleGenerateExamFromPrompt(); }}>
                                <div className="space-y-8">
                                    {/* Prompt Input */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800 mb-3">AI Exam Generation</h3>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Describe your exam requirements in natural language. The AI will generate questions based on your prompt.
                                        </p>
                                        <div className="relative">
                                            <textarea
                                                value={prompt}
                                                onChange={(e) => setPrompt(e.target.value)}
                                                placeholder="Enter your exam generation prompt here..."
                                                className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                                                maxLength={1000}
                                            />
                                            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                                                {prompt.length}/1000
                                            </div>
                                        </div>
                                    </div>

                                    {/* Example Prompts */}
                                    <div>
                                        <h4 className="text-md font-medium text-gray-800 mb-3">Example Prompts</h4>
                                        <div className="space-y-2">
                                            {promptExamples.map((example, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => setPrompt(example)}
                                                    className="cursor-pointer w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span className="text-sm text-gray-700">{example}</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                        <p className="mt-2 text-xs text-gray-500">Click any example to use it as your prompt</p>
                                    </div>

                                    {/* Tips Section */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Tips for better prompts:</h4>
                                        <ul className="text-xs text-blue-700 space-y-1">
                                            <li>• Specify the number of questions you want</li>
                                            <li>• Mention specific chapters or topics</li>
                                            <li>• Include difficulty level preferences</li>
                                            <li>• You can write in Vietnamese or English</li>
                                            <li>• Be specific about question distribution</li>
                                        </ul>
                                    </div>

                                    {/* Generate Button */}
                                    <div>
                                        {examError && (
                                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                                                <p className="text-red-700">⚠️ {examError}</p>
                                            </div>
                                        )}
                                        <button
                                            type="submit"
                                            disabled={!prompt.trim() || generatingExam}
                                            className={`cursor-pointer w-full py-4 text-base font-medium text-white rounded-lg transition-colors ${prompt.trim() && !generatingExam
                                                ? "bg-indigo-600 hover:bg-indigo-700 shadow-lg"
                                                : "bg-gray-300 cursor-not-allowed"
                                                }`}
                                        >
                                            {generatingExam
                                                ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                                        Generating Exam from AI...
                                                    </div>
                                                )
                                                : prompt.trim()
                                                    ? "🤖 Generate Exam with AI"
                                                    : "Please enter a prompt"
                                            }
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
