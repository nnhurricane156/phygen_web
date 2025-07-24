"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getAllChapters, getTopicsByChapter, generateExam, Chapter, Topic, DifficultyLevel } from "@/lib/api";

export default function ExamGenerator() {
    const [selectedChapter, setSelectedChapter] = useState("");
    const [selectedTopic, setSelectedTopic] = useState("");
    const [difficulty, setDifficulty] = useState<DifficultyLevel | "">("");
    const [numberOfQuestions, setNumberOfQuestions] = useState("10");
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loadingChapters, setLoadingChapters] = useState(false);
    const [loadingTopics, setLoadingTopics] = useState(false);
    const [generatingExam, setGeneratingExam] = useState(false);
    const [chaptersError, setChaptersError] = useState<string | null>(null);
    const [topicsError, setTopicsError] = useState<string | null>(null);
    const [examError, setExamError] = useState<string | null>(null);

    // Fetch chapters on component mount
    useEffect(() => {
        const fetchChapters = async () => {
            try {
                setLoadingChapters(true);
                setChaptersError(null);
                const chaptersData = await getAllChapters();
                setChapters(chaptersData);
                // console.log('✅ Chapters loaded:', chaptersData);
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
                setSelectedTopic("");
                return;
            }

            try {
                setLoadingTopics(true);
                setTopicsError(null);
                setSelectedTopic(""); // Reset topic selection
                const topicsData = await getTopicsByChapter(Number(selectedChapter), { pageNumber: 1 });
                setTopics(topicsData);
                // console.log('✅ Topics loaded for chapter', selectedChapter, ':', topicsData);
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

    // Handle exam generation
    const handleGenerateExam = async () => {
        if (!selectedChapter || !selectedTopic || !difficulty || !numberOfQuestions) {
            setExamError("Please fill in all fields");
            return;
        }

        try {
            setGeneratingExam(true);
            setExamError(null);
            
            const examResult = await generateExam(
                Number(selectedChapter),
                Number(selectedTopic),
                difficulty as DifficultyLevel,
                Number(numberOfQuestions)
            );
            
            console.log('✅ Exam generated:', examResult);
            // You can handle the exam result here (redirect, show modal, etc.)
            alert('Exam generated successfully!');
            
        } catch (err) {
            console.error('❌ Error generating exam:', err);
            setExamError(err instanceof Error ? err.message : 'Failed to generate exam');
        } finally {
            setGeneratingExam(false);
        }
    };

    return (
        <section className="mb-16 bg-indigo-500 py-10 px-8 rounded-xl shadow-lg">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-4 text-center">Generate Your Physics Exam</h2>
                <p className="text-white font-medium mb-8 text-center">Create customized physics exams by selecting topic and difficulty</p>

                <div className="bg-white p-8 rounded-lg shadow-md">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-medium mb-3 text-indigo-900">Physics Chapter</h3>
                                <select 
                                    value={selectedChapter}
                                    onChange={(e) => setSelectedChapter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    disabled={loadingChapters}
                                >
                                    <option value="">
                                        {loadingChapters ? "Loading chapters..." : "Select a physics chapter..."}
                                    </option>
                                    {chapters.map((chapter) => (
                                        <option key={chapter.id} value={chapter.id}>
                                            {chapter.chapterName}
                                        </option>
                                    ))}
                                </select>
                                {chaptersError && (
                                    <p className="text-sm text-red-500 mt-1">⚠️ {chaptersError}</p>
                                )}
                                {!chaptersError && (
                                    <p className="text-sm text-gray-500 mt-1">Choose the main physics chapter for your exam</p>
                                )}
                            </div>

                            <div>
                                <h3 className="font-medium mb-3 text-indigo-900">Physics Topic</h3>
                                <select 
                                    value={selectedTopic}
                                    onChange={(e) => setSelectedTopic(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    disabled={loadingTopics || !selectedChapter}
                                >
                                    <option value="">
                                        {!selectedChapter 
                                            ? "Select a chapter first..." 
                                            : loadingTopics 
                                                ? "Loading topics..." 
                                                : "Select a physics topic..."}
                                    </option>
                                    {topics.map((topic) => (
                                        <option key={topic.id} value={topic.id}>
                                            {topic.topicName}
                                        </option>
                                    ))}
                                </select>
                                {topicsError && (
                                    <p className="text-sm text-red-500 mt-1">⚠️ {topicsError}</p>
                                )}
                                {!topicsError && selectedChapter && (
                                    <p className="text-sm text-gray-500 mt-1">Choose the specific topic within the chapter</p>
                                )}
                            </div>


                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-medium mb-3 text-indigo-900">Difficulty Level</h3>
                                <div className="space-y-2">
                                    {[
                                        { level: "Easy", desc: "Basic concepts and simple calculations" },
                                        { level: "Medium", desc: "Intermediate problems with multiple steps" },
                                        { level: "Hard", desc: "Complex scenarios and advanced reasoning" },
                                        { level: "Expert", desc: "Advanced physics problems requiring deep understanding" }
                                    ].map((difficulty) => (
                                        <label key={difficulty.level} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-md hover:bg-indigo-50 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="difficulty"
                                                value={difficulty.level}
                                                className="mt-1"
                                                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                                            />
                                            <div>
                                                <div className="font-medium text-gray-900">{difficulty.level}</div>
                                                <div className="text-sm text-gray-500">{difficulty.desc}</div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium mb-3 text-indigo-900">Number of Questions</h3>
                                <select 
                                    value={numberOfQuestions}
                                    onChange={(e) => setNumberOfQuestions(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="10">10 Questions (Quick Quiz)</option>
                                    <option value="20">20 Questions (Standard Test)</option>
                                    <option value="30">30 Questions (Comprehensive Exam)</option>
                                    <option value="50">50 Questions (Final Exam)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    {examError && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-red-700">⚠️ {examError}</p>
                        </div>
                    )}
                    
                    <div className="flex gap-4 mt-8">
                        <button 
                            onClick={handleGenerateExam}
                            disabled={!selectedChapter || !selectedTopic || !difficulty || generatingExam}
                            className={`cursor-pointer flex-1 py-3 text-base font-medium rounded-md transition-colors ${
                                selectedChapter && selectedTopic && difficulty && !generatingExam
                                    ? "bg-indigo-600 text-white hover:bg-indigo-700" 
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                        >
                            {generatingExam ? "Generating..." : "🎯 Generate Physics Exam"}
                        </button>
                        <Link href="/createExam" className="flex-1">
                            <button className="cursor-pointer w-full py-3 bg-white border border-indigo-300 text-indigo-700 hover:bg-indigo-50 text-base font-medium rounded-md">
                                Advanced Options
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
