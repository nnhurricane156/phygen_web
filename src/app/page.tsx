"use client";
import Image from "next/image";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import Link from "next/link";
import HeaderAuth from "@/components/header/HeaderAuth";
import ExamGenerator from "@/components/exam/ExamGenerator";
import { useState, useEffect } from "react";

// Mock data for physics topics
const physicsTopics = [
  {
    id: 1,
    title: "Mechanics",
    description: "Motion, forces, energy, and momentum",
    subtitle: "Classical Physics Foundation",
    questionCount: 150,
    difficulty: "All Levels",
    icon: "⚙️"
  },
  {
    id: 2,
    title: "Thermodynamics", 
    description: "Heat, temperature, and energy transfer",
    subtitle: "Thermal Physics Concepts",
    questionCount: 120,
    difficulty: "All Levels",
    icon: "🌡️"
  },
  {
    id: 3,
    title: "Electromagnetism",
    description: "Electric and magnetic fields and forces", 
    subtitle: "Electromagnetic Theory",
    questionCount: 100,
    difficulty: "All Levels",
    icon: "⚡"
  },
  {
    id: 4,
    title: "Optics",
    description: "Light, reflection, refraction, and wave optics",
    subtitle: "Wave and Geometric Optics", 
    questionCount: 80,
    difficulty: "All Levels",
    icon: "🔍"
  },
];

// Mock data for physics exam success stories
const examSuccessStories = [
  {
    id: 1,
    text: "Generated 5 physics exams for my Grade 11 class on Mechanics. Students loved the variety of questions!",
    username: "Ms. Sarah Chen",
    role: "Physics Teacher",
    tags: ["Mechanics", "Grade 11", "Teaching"],
    examType: "Mechanics - Grade 11",
    questionsGenerated: 50
  },
  {
    id: 2,
    text: "Used PhyGen to create practice tests for my upcoming physics finals. The difficulty progression was perfect!",
    username: "Alex Kumar",
    role: "Grade 12 Student", 
    tags: ["Finals Prep", "Practice Tests", "Grade 12"],
    examType: "Mixed Topics - Grade 12",
    questionsGenerated: 75
  },
  {
    id: 3,
    text: "Created thermodynamics exams with different difficulty levels. Great for differentiated learning!",
    username: "Dr. Michael Torres",
    role: "High School Principal",
    tags: ["Thermodynamics", "Differentiated Learning"],
    examType: "Thermodynamics - All Grades",
    questionsGenerated: 60
  },
];

// Mock data for physics exam reviews
const physicsExamReviews = [
  {
    id: 1,
    name: "Dr. Lisa Wang",
    role: "Physics Department Head",
    rating: 5,
    comment: "PhyGen has revolutionized how we create physics assessments. The quality and variety of questions is outstanding.",
    examsFocused: "Electromagnetism & Optics"
  },
  {
    id: 2,
    name: "James Miller",
    role: "Grade 12 Student",
    rating: 5,
    comment: "Used this to practice for my physics finals. The difficulty levels helped me progress from basic to advanced concepts.",
    examsFocused: "Mixed Topics Practice"
  },
  {
    id: 3,
    name: "Prof. Maria Santos",
    role: "Physics Educator",
    rating: 4,
    comment: "Excellent tool for creating differentiated assessments. My students appreciate the clear question formatting.",
    examsFocused: "Mechanics & Thermodynamics"
  },
];

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  // Fix hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show loading skeleton until mounted
  if (!isMounted) {
    return (
      <div className="container mx-auto bg-white min-h-screen px-6 py-4">
        <div className="animate-pulse">
          <div className="h-16 bg-gray-200 rounded mb-8"></div>
          <div className="h-32 bg-gray-200 rounded mb-8"></div>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto bg-white min-h-screen px-6 py-4">
      {/* Header */}
      <header className="flex items-center justify-between mb-8 py-4 border-b border-gray-100">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
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
          <h1 className="text-2xl font-bold text-indigo-800">
            PhyGen
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-6 mr-6">
            <a
              href="#"
              className="text-gray-600 hover:text-indigo-700 font-medium"
            >
              Home
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-indigo-700 font-medium"
            >
              Features
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-indigo-700 font-medium"
            >
              Resources
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-indigo-700 font-medium"
            >
              About Us
            </a>
          </div>
          <HeaderAuth />
        </div>
      </header>

      {/* Hero section */}
      <section className="flex flex-col md:flex-row items-center justify-between mb-16 py-8">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h2 className="text-4xl font-bold text-indigo-900 mb-4">
            Physics Exam Generator
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Create Custom Physics Exams in Minutes
          </p>
          <p className="text-gray-600 mb-8">
            Generate physics exams by topic, chapter, and difficulty level. Perfect for teachers, 
            students, and exam preparation with comprehensive question banks covering mechanics, 
            thermodynamics, electromagnetism, and more.
          </p>          
          <div className="flex space-x-4 mb-6">
            <Link href="/createExam" className="px-6 py-3 bg-indigo-600 text-white hover:bg-indigo-700 text-base font-medium rounded-md transition-colors">
              Generate Exam Now
            </Link>
            <button className="px-6 py-3 bg-indigo-100 border border-indigo-200 text-indigo-700 hover:bg-indigo-200 text-base font-medium rounded-md shadow-sm">
              View Sample Questions
            </button>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white p-3 rounded-lg border border-indigo-100">
              <div className="text-2xl font-bold text-indigo-600">500+</div>
              <div className="text-sm text-gray-600">Physics Questions</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-indigo-100">
              <div className="text-2xl font-bold text-indigo-600">15</div>
              <div className="text-sm text-gray-600">Topics Covered</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-indigo-100">
              <div className="text-2xl font-bold text-indigo-600">3</div>
              <div className="text-sm text-gray-600">Grade Levels</div>
            </div>
          </div>
        </div>
        <div className="md:w-2/5">          
          <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 shadow-lg">
            <div className="bg-white p-4 rounded-lg mb-4 shadow-sm">
              <h3 className="font-semibold text-indigo-900 mb-2">Sample Physics Question</h3>
              <p className="text-sm text-gray-700 mb-3">What is the acceleration due to gravity on Earth?</p>
              <div className="space-y-1 text-xs text-gray-600">
                <div>A) 9.8 m/s²</div>
                <div>B) 10.0 m/s²</div>
                <div>C) 8.9 m/s²</div>
                <div>D) 11.2 m/s²</div>
              </div>
              <div className="mt-2 text-xs text-green-600 font-medium">✓ Correct Answer: A</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                Grade 10-12 Questions
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-indigo-900 mb-8 text-center">
          Physics Exam Features
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center p-6 border border-indigo-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-white hover:bg-indigo-50">
            <div className="w-16 h-16 bg-indigo-100 rounded-full mb-4 flex items-center justify-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-indigo-700"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14,2 14,8 20,8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10,9 9,9 8,9"></polyline>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-indigo-900 mb-2">
              Topic-Based Generation
            </h3>
            <p className="text-center text-gray-600">
              Generate exams by specific physics topics like Mechanics, Thermodynamics, Electromagnetism, and Optics.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 border border-indigo-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-white hover:bg-indigo-50">
            <div className="w-16 h-16 bg-indigo-100 rounded-full mb-4 flex items-center justify-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-indigo-700"
              >
                <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-4"></path>
                <path d="M12 2l3 3h5l-3 3 3 3h-5l-3 3-3-3H4l3-3-3-3h5l3-3z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-indigo-900 mb-2">
              Difficulty Levels
            </h3>
            <p className="text-center text-gray-600">
              Choose from Easy, Medium, or Hard difficulty levels suitable for Grade 10, 11, and 12 students.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 border border-indigo-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-white hover:bg-indigo-50">
            <div className="w-16 h-16 bg-indigo-100 rounded-full mb-4 flex items-center justify-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-indigo-700"
              >
                <path d="M9 12l2 2 4-4"></path>
                <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
                <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
                <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3"></path>
                <path d="M12 21c0-1 1-3 3-3s3 2 3 3-1 3-3 3-3-2-3-3"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-indigo-900 mb-2">
              Instant Results
            </h3>
            <p className="text-center text-gray-600">
              Get your custom physics exam generated instantly with answer keys and detailed solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Topic input section */}
      <ExamGenerator />

      {/* Physics Topics section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-indigo-900 mb-2 text-center">
          Physics Topics Available
        </h2>
        <p className="text-center text-indigo-700 mb-8">
          Choose from our comprehensive collection of physics topics
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {physicsTopics.map((topic) => (
            <div
              key={topic.id}
              className="border border-indigo-100 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white"
            >
              <div className="bg-indigo-50 py-3 px-4 border-b border-indigo-100">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{topic.icon}</span>
                  <div>
                    <h3 className="font-semibold text-indigo-900">{topic.title}</h3>
                    <span className="text-sm text-indigo-600">{topic.difficulty}</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h4 className="text-lg font-medium text-indigo-900 mb-2">
                  {topic.subtitle}
                </h4>
                <p className="text-gray-600 mb-4">{topic.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">
                    {topic.questionCount} Questions Available
                  </span>
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                    Ready to Use
                  </span>
                </div>
                <Link href="/createExam" className="inline-block w-full">
                  <Button className="w-full bg-indigo-600 text-white hover:bg-indigo-700">
                    Generate {topic.title} Exam
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Exam Success Stories section */}
      <section className="mb-16 bg-gray-50 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-indigo-900 mb-2 text-center">
            Physics Exam Success Stories
          </h2>
          <p className="text-center text-indigo-700 mb-10">
            See how educators and students are using PhyGen
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {examSuccessStories.map((story) => (
              <div
                key={story.id}
                className="border border-indigo-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white"
              >
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white text-lg font-bold mr-4">
                    {story.username.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-indigo-900">
                      {story.username}
                    </h4>
                    <p className="text-sm text-indigo-600">{story.role}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="bg-indigo-50 p-4 rounded-lg mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-indigo-700">Exam Generated:</span>
                      <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                        {story.questionsGenerated} questions
                      </span>
                    </div>
                    <p className="text-sm text-indigo-800 font-medium">{story.examType}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {story.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-gray-700 text-sm italic">"{story.text}"</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link href="/createExam" className="inline-block">
              <button className="px-6 py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-md font-medium">
                Create Your Physics Exam
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Physics Exam Reviews section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-indigo-900 mb-2 text-center">
          Educator & Student Reviews
        </h2>
        <p className="text-center text-indigo-700 mb-10">
          What physics educators and students say about PhyGen
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {physicsExamReviews.map((review) => (
            <div
              key={review.id}
              className="border border-indigo-100 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <span className="text-lg font-medium text-indigo-900">
                    {review.name}
                  </span>
                  <p className="text-sm text-indigo-600">{review.role}</p>
                </div>
              </div>
              
              <div className="flex mb-3">
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
              
              <div className="mb-3">
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                  Focus: {review.examsFocused}
                </span>
              </div>
              
              <p className="text-gray-700">"{review.comment}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to action */}
      <section className="mb-16 bg-indigo-600 py-16 px-6 rounded-xl text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Create Physics Exams?</h2>
        <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
          Join thousands of physics educators who use PhyGen to create engaging, 
          comprehensive exams tailored to their students' needs.
        </p>        
        <div className="flex justify-center gap-4 mb-6">
          <Link href="/createExam">
            <button className="px-8 py-3 bg-white text-indigo-700 hover:bg-indigo-50 text-base font-medium rounded-md">
              Generate Your First Exam
            </button>
          </Link>
          <Link href="/register">
            <button className="px-8 py-3 bg-indigo-500 text-white border border-indigo-400 hover:bg-indigo-500 text-base font-medium rounded-md shadow-md">
              Sign Up Free
            </button>
          </Link>
        </div>
        
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto text-center">
          <div>
            <div className="text-2xl font-bold text-white">500+</div>
            <div className="text-indigo-200 text-sm">Questions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">15</div>
            <div className="text-indigo-200 text-sm">Topics</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">Free</div>
            <div className="text-indigo-200 text-sm">Forever</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-indigo-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-indigo-900 mb-4">PhyGen</h3>
            <p className="text-gray-600">The ultimate physics exam generator for educators and students. Create comprehensive physics assessments in minutes.</p>
          </div>
          <div>
            <h3 className="font-bold text-indigo-900 mb-4">Physics Topics</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-indigo-700">Mechanics</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-700">Thermodynamics</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-700">Electromagnetism</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-700">Optics & Waves</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-indigo-900 mb-4">For Educators</h3>
            <ul className="space-y-2">
              <li><Link href="/createExam" className="text-gray-600 hover:text-indigo-700">Create Exam</Link></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-700">Question Bank</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-700">Teaching Resources</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-700">Grade Levels</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-indigo-900 mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-indigo-700">Help Center</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-700">Contact Us</a></li>
              <li><Link href="/login" className="text-gray-600 hover:text-indigo-700">Login</Link></li>
              <li><Link href="/register" className="text-gray-600 hover:text-indigo-700">Register</Link></li>
            </ul>
          </div>
        </div>

        <div className="text-center pt-6 border-t border-gray-200">
          <p className="text-gray-600">&copy; {new Date().getFullYear()} PhyGen - Physics Exam Generator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
