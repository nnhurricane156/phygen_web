"use client";

import Input from "@/components/form/input/InputField";
import Link from "next/link";
import { useState } from "react";

export default function ExamGenerator() {
    const [topic, setTopic] = useState("");
    const [grade, setGrade] = useState("10");

    return (
        <section className="mb-16 bg-indigo-500 py-10 px-8 rounded-xl shadow-lg">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-4 text-center">Generate Your Physics Exam</h2>
                <p className="text-white font-medium mb-8 text-center">Create customized physics exams by selecting topic, grade level, and difficulty</p>

                <div className="bg-white p-8 rounded-lg shadow-md">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-medium mb-3 text-indigo-900">Physics Topic</h3>
                                <select 
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="">Select a physics topic...</option>
                                    <option value="mechanics">Mechanics</option>
                                    <option value="thermodynamics">Thermodynamics</option>
                                    <option value="electromagnetism">Electromagnetism</option>
                                    <option value="optics">Optics & Waves</option>
                                    <option value="modern-physics">Modern Physics</option>
                                </select>
                                <p className="text-sm text-gray-500 mt-1">Choose the main physics topic for your exam</p>
                            </div>

                            <div>
                                <h3 className="font-medium mb-3 text-indigo-900">Grade Level</h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {["10", "11", "12"].map((g) => (
                                        <button
                                            key={g}
                                            onClick={() => setGrade(g)}
                                            className={`py-3 text-center border ${grade === g ? "bg-indigo-600 text-white font-medium" : "bg-white border-indigo-200 text-gray-600"
                                                } rounded-md transition-colors duration-200 hover:bg-indigo-50`}
                                        >
                                            Grade {g}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-500 mt-1">Select your current grade level</p>
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
                                        { level: "Hard", desc: "Complex scenarios and advanced reasoning" }
                                    ].map((difficulty) => (
                                        <label key={difficulty.level} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-md hover:bg-indigo-50 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="difficulty"
                                                value={difficulty.level}
                                                className="mt-1"
                                                onChange={(e) => setTopic(e.target.value)}
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
                                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                                    <option value="10">10 Questions (Quick Quiz)</option>
                                    <option value="20">20 Questions (Standard Test)</option>
                                    <option value="30">30 Questions (Comprehensive Exam)</option>
                                    <option value="50">50 Questions (Final Exam)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex gap-4 mt-8">
                        <button className="flex-1 py-3 bg-white border border-indigo-300 text-indigo-700 hover:bg-indigo-50 text-base font-medium rounded-md">
                            Preview Questions
                        </button>
                        <Link href="/createExam" className="flex-1">
                            <button className="w-full py-3 bg-indigo-600 text-white font-medium hover:bg-indigo-700 text-base rounded-md">
                                Generate Physics Exam
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
