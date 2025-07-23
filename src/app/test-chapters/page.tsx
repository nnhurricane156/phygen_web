"use client";

import { useState, useEffect } from 'react';
import { getAllChapters, getTopicsByChapter, Chapter, Topic } from '@/lib/api';

export default function TestChaptersPage() {
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
    const [loadingChapters, setLoadingChapters] = useState(false);
    const [loadingTopics, setLoadingTopics] = useState(false);
    const [chaptersError, setChaptersError] = useState<string | null>(null);
    const [topicsError, setTopicsError] = useState<string | null>(null);

    const fetchChapters = async () => {
        try {
            setLoadingChapters(true);
            setChaptersError(null);
            console.log('🔄 Fetching chapters...');
            
            const chaptersData = await getAllChapters();
            setChapters(chaptersData);
            console.log('✅ Chapters fetched successfully:', chaptersData);
        } catch (err) {
            console.error('❌ Error fetching chapters:', err);
            setChaptersError(err instanceof Error ? err.message : 'Failed to fetch chapters');
        } finally {
            setLoadingChapters(false);
        }
    };

    const fetchTopics = async (chapterId: number) => {
        try {
            setLoadingTopics(true);
            setTopicsError(null);
            console.log('🔄 Fetching topics for chapter:', chapterId);
            
            const topicsData = await getTopicsByChapter(chapterId, { pageNumber: 1, pageSize: 50 });
            setTopics(topicsData);
            console.log('✅ Topics fetched successfully:', topicsData);
        } catch (err) {
            console.error('❌ Error fetching topics:', err);
            setTopicsError(err instanceof Error ? err.message : 'Failed to fetch topics');
        } finally {
            setLoadingTopics(false);
        }
    };

    useEffect(() => {
        fetchChapters();
    }, []);

    const handleChapterSelect = (chapterId: number) => {
        setSelectedChapter(chapterId);
        setTopics([]); // Clear previous topics
        fetchTopics(chapterId);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Test Chapters & Topics API</h1>
                        <button
                            onClick={fetchChapters}
                            disabled={loadingChapters}
                            className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {loadingChapters ? 'Loading...' : 'Refresh Chapters'}
                        </button>
                    </div>

                    {chaptersError && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-red-700">
                                <strong>Chapters Error:</strong> {chaptersError}
                            </p>
                        </div>
                    )}

                    {topicsError && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-red-700">
                                <strong>Topics Error:</strong> {topicsError}
                            </p>
                        </div>
                    )}

                    {loadingChapters && (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            <span className="ml-2 text-gray-600">Loading chapters...</span>
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Chapters Section */}
                        <div>
                            <h2 className="text-lg font-semibold mb-4">Chapters ({chapters.length})</h2>
                            {chapters.length > 0 && (
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {chapters.map((chapter) => (
                                        <button
                                            key={chapter.id}
                                            onClick={() => handleChapterSelect(chapter.id)}
                                            className={`cursor-pointer w-full text-left p-3 border rounded-md transition-colors ${
                                                selectedChapter === chapter.id
                                                    ? 'bg-indigo-50 border-indigo-300'
                                                    : 'border-gray-200 hover:bg-gray-50'
                                            }`}
                                        >
                                            <h3 className="font-medium text-gray-900">{chapter.chapterName}</h3>
                                            <p className="text-sm text-gray-500">ID: {chapter.id} | Class ID: {chapter.classId}</p>
                                        </button>
                                    ))}
                                </div>
                            )}
                            {!loadingChapters && chapters.length === 0 && !chaptersError && (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No chapters found</p>
                                </div>
                            )}
                        </div>

                        {/* Topics Section */}
                        <div>
                            <h2 className="text-lg font-semibold mb-4">
                                Topics {selectedChapter ? `for Chapter ${selectedChapter}` : ''}
                                {topics.length > 0 && ` (${topics.length})`}
                            </h2>
                            
                            {!selectedChapter && (
                                <div className="text-center py-8 text-gray-500">
                                    <p>Select a chapter to view its topics</p>
                                </div>
                            )}

                            {loadingTopics && (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                                    <span className="ml-2 text-gray-600">Loading topics...</span>
                                </div>
                            )}

                            {selectedChapter && !loadingTopics && topics.length > 0 && (
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {topics.map((topic) => (
                                        <div key={topic.id} className="p-3 border border-gray-200 rounded-md bg-green-50">
                                            <h3 className="font-medium text-gray-900">{topic.topicName}</h3>
                                            <p className="text-sm text-gray-500">ID: {topic.id} | Chapter ID: {topic.chapterId}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {selectedChapter && !loadingTopics && topics.length === 0 && !topicsError && (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No topics found for this chapter</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-gray-50 rounded-md">
                        <h3 className="font-medium mb-2">API Info:</h3>
                        <div className="space-y-1 text-sm text-gray-600">
                            <p><strong>Chapters Endpoint:</strong> GET /api/Chapter</p>
                            <p><strong>Topics Endpoint:</strong> GET /api/Topics?chapterId={`{id}`}&pageNumber=1</p>
                            <p><strong>Base URL:</strong> http://ec2-54-66-6-158.ap-southeast-2.compute.amazonaws.com:5152/api</p>
                            <p><strong>Authorization:</strong> Bearer token from localStorage</p>
                            <p><strong>Pagination:</strong> Supports pageNumber, pageSize, searchTerm parameters</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
