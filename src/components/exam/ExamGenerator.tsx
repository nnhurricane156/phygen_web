"use client";

import Input from "@/components/form/input/InputField";
import { useState } from "react";

export default function ExamGenerator() {
    const [topic, setTopic] = useState("");
    const [grade, setGrade] = useState("10");

    return (
        <section className="mb-16 bg-blue-500 py-10 px-8 rounded-xl shadow-lg">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Generate Your Custom Exam</h2>
                <p className="text-white font-medium mb-8 text-center">Enter a topic and select your grade level to create a personalized physics exam</p>

                <div className="bg-white p-8 rounded-lg shadow-md">
                    <div className="mb-6">
                        <h3 className="font-medium mb-3 text-blue-900">Enter Topic</h3>
                        <Input
                            type="text"
                            placeholder="e.g. Electric Charge"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="mb-1"
                        />
                        <p className="text-sm text-gray-500">Type the Physics topic to generate questions</p>
                    </div>

                    <div className="mb-6">
                        <h3 className="font-medium mb-3 text-blue-900">Select Class Grade</h3>
                        <div className="flex gap-4 mb-2">
                            {["10", "11", "12"].map((g) => (
                                <button
                                    key={g}
                                    onClick={() => setGrade(g)}
                                    className={`flex-1 py-3 text-center border ${grade === g ? "bg-blue-600 text-black font-medium" : "bg-white border-blue-200 text-gray-600"
                                        } rounded-md transition-colors duration-200 hover:bg-blue-50`}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                        <p className="text-sm text-gray-500">Choose your current grade</p>
                    </div>
                    <div className="flex gap-4 mt-8">
                        <button className="flex-1 py-3 bg-white border border-blue-300 text-black hover:bg-blue-50 text-base font-medium rounded-md">Reset</button>
                        <button className="flex-1 py-3 bg-blue-600 text-black font-medium hover:bg-blue-500 text-base rounded-md">Generate Questions</button>
                    </div>
                </div>
            </div>
        </section>
    );
}
