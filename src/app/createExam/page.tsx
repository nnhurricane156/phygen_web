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
                                                className={`px-6 py-3 rounded-lg border-2 transition-all ${gradeLevel === grade
                                                    ? "bg-indigo-600 text-white border-indigo-600"
                                                    : "bg-white text-gray-700 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50"
                                                    }`}
                                            >
                                                Grade {grade}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">Choose the grade level for your physics exam.</p>
                                </div>

                                {/* Physics Topic Selection */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-800 mb-3">Select Physics Topic</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {[
                                            { id: 1, name: "Mechanics", desc: "Motion, Forces, Energy" },
                                            { id: 2, name: "Thermodynamics", desc: "Heat, Temperature, Energy Transfer" },
                                            { id: 3, name: "Electromagnetism", desc: "Electric & Magnetic Fields" },
                                            { id: 4, name: "Optics", desc: "Light, Reflection, Refraction" },
                                        ].map((topic) => (
                                            <button
                                                key={topic.id}
                                                type="button"
                                                onClick={() => setChapter(topic.id)}
                                                className={`p-4 rounded-lg border-2 text-left transition-all ${chapter === topic.id
                                                    ? "bg-indigo-600 text-white border-indigo-600"
                                                    : "bg-white text-gray-700 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50"
                                                    }`}
                                            >
                                                <div className="font-medium">{topic.name}</div>
                                                <div className={`text-sm mt-1 ${chapter === topic.id ? "text-indigo-100" : "text-gray-500"}`}>
                                                    {topic.desc}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">Choose the physics topic for your exam questions.</p>
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

                                {/* Generate Exam Button */}
                                <div>
                                    <button
                                        type="button"
                                        onClick={handleGenerateExam}
                                        disabled={!gradeLevel || !chapter || !difficulty}
                                        className={`w-full py-4 text-base font-medium text-white rounded-lg transition-colors ${gradeLevel && chapter && difficulty
                                            ? "bg-indigo-600 hover:bg-indigo-700 shadow-lg"
                                            : "bg-gray-300 cursor-not-allowed"
                                            }`}
                                    >
                                        {gradeLevel && chapter && difficulty 
                                            ? "🎯 Generate Physics Exam" 
                                            : "Please complete all selections"
                                        }
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
