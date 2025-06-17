"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function CreateExamForm() {
    const [gradeLevel, setGradeLevel] = useState<number | null>(null);
    const [chapter, setChapter] = useState<number | null>(null);
    const [difficulty, setDifficulty] = useState<string | null>(null);

    // Options for the form
    const gradeLevels = [10, 11, 12];
    const chapters = [1, 2, 3, 4];
    const difficultyLevels = ["Easy", "Medium", "Hard"];

    // Handle form submission
    const handleGenerateExam = () => {
        // Add your exam generation logic here
        console.log("Generating exam with:", { gradeLevel, chapter, difficulty });
    };

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
                <div className="flex-1 p-4 md:p-8 max-w-3xl mx-auto w-full">
                    <div className="bg-white rounded-xl md:shadow-md md:border border-gray-200 p-6">
                        <form>
                            <div className="space-y-8">
                                {/* Grade Level Selection */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-800 mb-3">Select Grade Level</h3>
                                    <div className="flex flex-wrap gap-2 md:gap-4">
                                        {gradeLevels.map((grade) => (
                                            <button
                                                key={grade}
                                                type="button"
                                                onClick={() => setGradeLevel(grade)}
                                                className={`px-6 py-2 rounded-full ${gradeLevel === grade
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    }`}
                                            >
                                                Grade {grade}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">Choose the grade level for the exam.</p>
                                </div>

                                {/* Chapter Selection */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-800 mb-3">Select Chapter</h3>
                                    <div className="flex flex-wrap gap-2 md:gap-4">
                                        {chapters.map((chap) => (
                                            <button
                                                key={chap}
                                                type="button"
                                                onClick={() => setChapter(chap)}
                                                className={`px-6 py-2 rounded-full ${chapter === chap
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    }`}
                                            >
                                                Chapter {chap}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">Choose the chapter for the exam.</p>
                                </div>

                                {/* Difficulty Selection */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-800 mb-3">Select Difficulty</h3>
                                    <div className="flex flex-wrap gap-2 md:gap-4">
                                        {difficultyLevels.map((level) => (
                                            <button
                                                key={level}
                                                type="button"
                                                onClick={() => setDifficulty(level)}
                                                className={`px-6 py-2 rounded-full ${difficulty === level
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    }`}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">Select the level of difficulty for the questions.</p>
                                </div>

                                {/* Generate Exam Button */}
                                <div>
                                    <button
                                        type="button"
                                        onClick={handleGenerateExam}
                                        disabled={!gradeLevel || !chapter || !difficulty}
                                        className={`w-full py-3 text-sm font-medium text-white rounded-lg transition-colors ${gradeLevel && chapter && difficulty
                                            ? "bg-blue-500 hover:bg-blue-600"
                                            : "bg-gray-300 cursor-not-allowed"
                                            }`}
                                    >
                                        Generate Exam
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
