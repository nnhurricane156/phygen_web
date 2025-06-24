"use client";
import Image from "next/image";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import { useState } from "react";
import Badge from "@/components/ui/badge/Badge";
import Link from "next/link";

// Mock data for resources
const resources = [
  {
    id: 1,
    title: "Physics Textbook",
    description: "Comprehensive textbook covering all chapters",
    subtitle: "Physics for High School",
    type: "Must Have",
  },
  {
    id: 2,
    title: "Practice Problems",
    description: "A collection of practice problems by topic",
    subtitle: "Physics Practice Book",
    type: "Recommended",
  },
];

// Mock data for community insights
const communityInsights = [
  {
    id: 1,
    text: "I just scored 90% on my physics test thanks to PhyGen!",
    username: "John123",
    tags: ["Success", "Test Prep"],
  },
  {
    id: 2,
    text: "Great resources for physics preparation.",
    username: "JaneDoe",
    tags: ["Study Tips", "Physics"],
  },
];

// Mock data for reviews
const reviews = [
  {
    id: 1,
    name: "Maria",
    rating: 5,
    comment: "The exam generator is a lifesaver! Very useful.",
  },
  {
    id: 2,
    name: "Trung",
    rating: 5,
    comment: "I love the variety of questions and topics!",
  },
  {
    id: 3,
    name: "Alex",
    rating: 4,
    comment: "Very helpful for my physics class. Could use more advanced topics."
  },
];

export default function Home() {
  // State for topic input and grade selection
  const [topic, setTopic] = useState("");
  const [grade, setGrade] = useState("10");

  return (
    <div className="container mx-auto bg-white min-h-screen px-6 py-4">
      {/* Header */}
      <header className="flex items-center justify-between mb-8 py-4 border-b border-gray-100">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
              ></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-blue-800">
            PhyGen Exam Generator
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-6 mr-6">
            <a
              href="#"
              className="text-gray-600 hover:text-blue-700 font-medium"
            >
              Home
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-700 font-medium"
            >
              Features
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-700 font-medium"
            >
              Resources
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-700 font-medium"
            >
              About Us
            </a>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href="/login"
              className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 font-medium"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="flex flex-col md:flex-row items-center justify-between mb-16 py-8">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h2 className="text-4xl font-bold text-blue-900 mb-4">
            Welcome to PhyGen
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Your AI-powered Physics Exam Generator
          </p>
          <p className="text-gray-600 mb-8">
            Generate custom physics exams, practice with tailored questions, and
            improve your understanding with our comprehensive resources.
          </p>          <div className="flex space-x-4">
            <button className="px-6 py-3 bg-blue-600 text-black hover:bg-blue-500 text-base font-medium rounded-md">
              Get Started
            </button>
            <button className="px-6 py-3 bg-blue-300 border border-blue-400 text-black hover:bg-blue-400 text-base font-medium rounded-md shadow-sm">
              Learn More
            </button>
          </div>
        </div>
        <div className="md:w-2/5">          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-lg">
          <Image
            src="/file.svg"
            alt="Physics Exam"
            className="w-full h-auto"
            width={400}
            height={300}
          />
        </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-blue-900 mb-8 text-center">
          Our Features
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center p-6 border border-blue-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-white hover:bg-blue-50">
            <div className="w-16 h-16 bg-blue-100 rounded-full mb-4 flex items-center justify-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-blue-700"
              >
                <path d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Generate Exam
            </h3>
            <p className="text-center text-gray-600">
              Create customized physics exams tailored to your specific needs and academic level.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 border border-blue-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-white hover:bg-blue-50">
            <div className="w-16 h-16 bg-blue-100 rounded-full mb-4 flex items-center justify-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-blue-700"
              >
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Study Resources
            </h3>
            <p className="text-center text-gray-600">
              Access comprehensive study materials, textbooks, and practice problems to enhance your learning.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 border border-blue-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-white hover:bg-blue-50">
            <div className="w-16 h-16 bg-blue-100 rounded-full mb-4 flex items-center justify-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-blue-700"
              >
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              My Tests
            </h3>
            <p className="text-center text-gray-600">
              Track your progress, review past tests, and monitor your improvement over time.
            </p>
          </div>
        </div>
      </section>      {/* Topic input section */}
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
                    onClick={() => setGrade(g)} className={`flex-1 py-3 text-center border ${grade === g ? "bg-blue-600 text-black font-medium" : "bg-white border-blue-200 text-gray-600"
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

      {/* Resources section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-blue-900 mb-2 text-center">
          Recommended Resources
        </h2>
        <p className="text-center text-blue-700 mb-8">
          Enhance your physics knowledge with our curated resources
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="border border-blue-100 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white"
            >
              <div className="bg-blue-50 py-3 px-4 border-b border-blue-100">
                <Badge
                  size="sm"
                  color={resource.type === "Must Have" ? "success" : "info"}
                  className="mb-1"
                >
                  {resource.type}
                </Badge>
                <h3 className="font-semibold text-blue-900">{resource.title}</h3>
              </div>

              <div className="p-6">
                <div className="h-48 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-blue-800 font-medium text-lg">
                    {resource.title}
                  </span>
                </div>
                <h4 className="text-lg font-medium text-blue-900 mb-2">
                  {resource.subtitle}
                </h4>
                <p className="text-gray-600 mb-4">{resource.description}</p>
                <Button className="bg-blue-600 text-white hover:bg-blue-700">
                  View Resource
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community Insights section */}
      <section className="mb-16 bg-gray-50 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-blue-900 mb-2 text-center">
            Community Insights
          </h2>
          <p className="text-center text-blue-700 mb-10">
            What our users are saying
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {communityInsights.map((insight) => (
              <div
                key={insight.id}
                className="border border-blue-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white"
              >
                <div className="flex items-start mb-6">
                  <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 text-lg font-bold mr-4">
                    {insight.username.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900">
                      {insight.username}
                    </h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {insight.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="h-48 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-sm text-blue-800">
                  {insight.id === 1
                    ? "Screenshot of test results"
                    : "Image of study materials"}
                </div>

                <p className="text-gray-700 text-lg">{insight.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-blue-900 mb-2 text-center">
          User Reviews
        </h2>
        <p className="text-center text-blue-700 mb-10">
          What our users say about PhyGen
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border border-blue-100 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 text-lg font-bold">
                  {review.name.charAt(0)}
                </div>
                <span className="text-lg font-medium text-blue-900">
                  {review.name}
                </span>
              </div>
              <div className="flex mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < review.rating ? "text-yellow-500" : "text-gray-300"
                      }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to action */}
      <section className="mb-16 bg-blue-600 py-16 px-6 rounded-xl text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
        <p className="text-blue-100 mb-8 max-w-2xl mx-auto">Join thousands of students who use PhyGen to improve their physics exam scores and deepen their understanding.</p>        <div className="flex justify-center gap-4">
          <button className="px-8 py-3 bg-white text-blue-700 hover:bg-blue-50 text-base font-medium rounded-md">Sign Up Now</button>
          <button className="px-8 py-3 bg-blue-400 text-black border border-blue-300 hover:bg-blue-500 text-base font-medium rounded-md shadow-md">Learn More</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-blue-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-blue-900 mb-4">PhyGen</h3>
            <p className="text-gray-600">Your AI-powered Physics Exam Generator for smarter learning and better results.</p>
          </div>
          <div>
            <h3 className="font-bold text-blue-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-700">Home</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-700">Features</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-700">Resources</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-700">About</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-blue-900 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-700">Textbooks</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-700">Practice Tests</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-700">Video Tutorials</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-700">Study Groups</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-blue-900 mb-4">Connect</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-700">Contact Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-700">Support</a></li>
              <li><Link href="/login" className="text-gray-600 hover:text-blue-700">Login</Link></li>
              <li><Link href="/register" className="text-gray-600 hover:text-blue-700">Register</Link></li>
            </ul>
          </div>
        </div>

        <div className="text-center pt-6 border-t border-gray-200">
          <p className="text-gray-600">&copy; {new Date().getFullYear()} PhyGen App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
