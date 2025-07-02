"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table/index";
import Badge from "@/components/ui/badge/Badge";
import Link from "next/link";

// Interface for exam data
interface ExamData {
  id: number;
  title: string;
  subject: string;
  difficulty: string;
  questions: number;
  createdBy: string;
  createdDate: string;
  status: "Active" | "Draft" | "Archived";
  attempts: number;
  avgScore: number;
}

// Sample exam data
const sampleExams: ExamData[] = [
  {
    id: 1,
    title: "Classical Mechanics Basics",
    subject: "Mechanics",
    difficulty: "Beginner",
    questions: 25,
    createdBy: "Dr. Smith",
    createdDate: "2024-01-15",
    status: "Active",
    attempts: 145,
    avgScore: 78
  },
  {
    id: 2,
    title: "Electromagnetic Fields",
    subject: "Electromagnetism",
    difficulty: "Intermediate",
    questions: 30,
    createdBy: "Prof. Johnson",
    createdDate: "2024-01-12",
    status: "Active",
    attempts: 89,
    avgScore: 72
  },
  {
    id: 3,
    title: "Quantum Mechanics Fundamentals",
    subject: "Quantum Physics",
    difficulty: "Advanced",
    questions: 20,
    createdBy: "Dr. Wilson",
    createdDate: "2024-01-10",
    status: "Draft",
    attempts: 0,
    avgScore: 0
  },
  {
    id: 4,
    title: "Thermodynamics Practice",
    subject: "Thermodynamics",
    difficulty: "Intermediate",
    questions: 28,
    createdBy: "Prof. Davis",
    createdDate: "2024-01-08",
    status: "Active",
    attempts: 203,
    avgScore: 81
  },
  {
    id: 5,
    title: "Wave Physics Assessment",
    subject: "Waves",
    difficulty: "Beginner",
    questions: 22,
    createdBy: "Dr. Brown",
    createdDate: "2024-01-05",
    status: "Archived",
    attempts: 156,
    avgScore: 75
  }
];

const AdminPage = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  // Filter exams based on search term
  const filteredExams = sampleExams.filter(exam =>
    exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate metrics
  const totalExams = sampleExams.length;
  const activeExams = sampleExams.filter(exam => exam.status === "Active").length;
  const totalAttempts = sampleExams.reduce((sum, exam) => sum + exam.attempts, 0);
  const totalQuestions = sampleExams.reduce((sum, exam) => sum + exam.questions, 0);
  const avgScore = Math.round(
    sampleExams.filter(exam => exam.attempts > 0)
      .reduce((sum, exam) => sum + exam.avgScore, 0) / 
    sampleExams.filter(exam => exam.attempts > 0).length
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const getBadgeColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Draft":
        return "bg-yellow-100 text-yellow-800";
      case "Archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-blue-100 text-blue-800";
      case "Intermediate":
        return "bg-indigo-100 text-indigo-800";
      case "Advanced":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Physics Exam Administration</h1>
          <p className="text-gray-600 mt-1">Manage physics exams, monitor performance, and track usage</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search exams..."
              value={searchTerm}
              onChange={handleSearch}
              className="py-2 px-4 pl-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          
          <Link 
            href="/admin/exam"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Create Exam
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Exams</p>
              <p className="text-2xl font-bold text-gray-900">{totalExams}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Exams</p>
              <p className="text-2xl font-bold text-gray-900">{activeExams}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Attempts</p>
              <p className="text-2xl font-bold text-gray-900">{totalAttempts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Questions</p>
              <p className="text-2xl font-bold text-gray-900">{totalQuestions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Score</p>
              <p className="text-2xl font-bold text-gray-900">{avgScore}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Exam Attempts Over Time</h3>
          <div className="h-64 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-gray-600">Chart visualization would appear here</p>
              <p className="text-sm text-gray-500 mt-1">Showing monthly exam attempt trends</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Distribution</h3>
          <div className="h-64 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <p className="text-gray-600">Pie chart visualization would appear here</p>
              <p className="text-sm text-gray-500 mt-1">Showing exam distribution by physics topics</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Exams Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent Physics Exams</h2>
          <Link 
            href="/admin/exam"
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100">
              <TableRow>
                <TableCell isHeader className="px-6 py-4 font-medium text-gray-500 text-start">
                  Exam Title
                </TableCell>
                <TableCell isHeader className="px-6 py-4 font-medium text-gray-500 text-start">
                  Subject
                </TableCell>
                <TableCell isHeader className="px-6 py-4 font-medium text-gray-500 text-start">
                  Difficulty
                </TableCell>
                <TableCell isHeader className="px-6 py-4 font-medium text-gray-500 text-start">
                  Questions
                </TableCell>
                <TableCell isHeader className="px-6 py-4 font-medium text-gray-500 text-start">
                  Created By
                </TableCell>
                <TableCell isHeader className="px-6 py-4 font-medium text-gray-500 text-start">
                  Status
                </TableCell>
                <TableCell isHeader className="px-6 py-4 font-medium text-gray-500 text-start">
                  Attempts
                </TableCell>
                <TableCell isHeader className="px-6 py-4 font-medium text-gray-500 text-start">
                  Avg Score
                </TableCell>
                <TableCell isHeader className="px-6 py-4 font-medium text-gray-500 text-start">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100">
              {filteredExams.slice(0, 5).map((exam) => (
                <TableRow key={exam.id} className="hover:bg-gray-50">
                  <TableCell className="px-6 py-4 text-start">
                    <div>
                      <div className="font-medium text-gray-900">{exam.title}</div>
                      <div className="text-sm text-gray-500">{exam.createdDate}</div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-700 text-start">
                    {exam.subject}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-start">
                    <Badge className={getDifficultyColor(exam.difficulty)}>
                      {exam.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-700 text-start">
                    {exam.questions}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-700 text-start">
                    {exam.createdBy}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-start">
                    <Badge className={getBadgeColor(exam.status)}>
                      {exam.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-700 text-start">
                    {exam.attempts}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-700 text-start">
                    {exam.attempts > 0 ? `${exam.avgScore}%` : '-'}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-start">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-indigo-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button className="p-1 text-gray-400 hover:text-indigo-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-6 border-t border-gray-100">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{Math.min(5, filteredExams.length)}</span> of{' '}
            <span className="font-medium">{filteredExams.length}</span> results
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              className="flex items-center px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)}
              disabled={currentPage === 1}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <div className="flex items-center space-x-1">
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`flex items-center justify-center w-8 h-8 rounded-lg text-sm ${
                    currentPage === page
                      ? "bg-indigo-600 text-white"
                      : "text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              className="flex items-center px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handlePageChange(currentPage < 3 ? currentPage + 1 : 3)}
              disabled={currentPage === 3}
            >
              Next
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
