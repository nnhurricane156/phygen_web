"use client";
import React, { useState } from "react";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table/index";
import { Modal } from "@/components/ui/modal/index";

// Helper function to render text with LaTeX math expressions
const renderMathText = (text: string) => {
    if (!text) return null;
    
    // Split text by LaTeX delimiters
    const parts = text.split(/(\$[^$]+\$|\$\$[^$]+\$\$)/);
    
    return parts.map((part, index) => {
        if (part.match(/^\$\$.*\$\$$/)) {
            // Block math (display mode)
            const math = part.slice(2, -2);
            try {
                return <BlockMath key={index} math={math} />;
            } catch (error) {
                console.warn('KaTeX error for block math:', math, error);
                return <span key={index} className="text-red-500">{part}</span>;
            }
        } else if (part.match(/^\$.*\$$/)) {
            // Inline math
            const math = part.slice(1, -1);
            try {
                return <InlineMath key={index} math={math} />;
            } catch (error) {
                console.warn('KaTeX error for inline math:', math, error);
                return <span key={index} className="text-red-500">{part}</span>;
            }
        } else {
            // Regular text
            return <span key={index}>{part}</span>;
        }
    });
};

interface Question {
  id: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  subject: string;
  chapterId: number;
  topicId: number;
}

interface Exam {
  id: number;
  title: string;
  description: string;
  duration: number; // in minutes
  totalQuestions: number;
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questions: Question[];
  createdAt: string;
}

// Mock questions data
const availableQuestions: Question[] = [
  {
    id: 1,
    questionText: "What is the speed of light in vacuum?",
    optionA: "3 × 10^8 m/s",
    optionB: "2 × 10^8 m/s",
    optionC: "4 × 10^8 m/s",
    optionD: "1 × 10^8 m/s",
    correctAnswer: 'A',
    subject: "Physics",
    chapterId: 1,
    topicId: 1,
  },
  {
    id: 2,
    questionText: "Which law states that every action has an equal and opposite reaction?",
    optionA: "Newton's First Law",
    optionB: "Newton's Second Law",
    optionC: "Newton's Third Law",
    optionD: "Law of Conservation",
    correctAnswer: 'C',
    subject: "Physics",
    chapterId: 1,
    topicId: 2,
  },
  {
    id: 3,
    questionText: "What is the formula for kinetic energy?",
    optionA: "KE = mv",
    optionB: "KE = 1/2 mv²",
    optionC: "KE = mgh",
    optionD: "KE = mv²",
    correctAnswer: 'B',
    subject: "Physics",
    chapterId: 1,
    topicId: 3,
  },
];

// Mock exams data
const examsData: Exam[] = [
  {
    id: 1,
    title: "Physics Basic Exam",
    description: "Basic physics concepts and laws",
    duration: 60,
    totalQuestions: 2,
    subject: "Physics",
    difficulty: "Easy",
    questions: [availableQuestions[0], availableQuestions[1]],
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    title: "Advanced Physics Test",
    description: "Advanced physics problems and theories",
    duration: 90,
    totalQuestions: 3,
    subject: "Physics",
    difficulty: "Hard",
    questions: availableQuestions,
    createdAt: "2024-01-14",
  },
];

const ExamPage = () => {
  const [exams, setExams] = useState<Exam[]>(examsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [formData, setFormData] = useState<Partial<Exam>>({
    title: "",
    description: "",
    duration: 60,
    subject: "",
    difficulty: 'Easy',
    questions: [],
  });

  const itemsPerPage = 10;

  // Filter exams based on search term
  const filteredExams = exams.filter(
    (exam) =>
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredExams.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExams = filteredExams.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // Open modal for create/edit
  const openModal = (exam?: Exam) => {
    if (exam) {
      setEditingExam(exam);
      setFormData(exam);
      setSelectedQuestions(exam.questions);
    } else {
      setEditingExam(null);
      setFormData({
        title: "",
        description: "",
        duration: 60,
        subject: "",
        difficulty: 'Easy',
        questions: [],
      });
      setSelectedQuestions([]);
    }
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExam(null);
    setFormData({});
    setSelectedQuestions([]);
  };

  // Open question selection modal
  const openQuestionModal = () => {
    setIsQuestionModalOpen(true);
  };

  // Close question selection modal
  const closeQuestionModal = () => {
    setIsQuestionModalOpen(false);
  };

  // Handle question selection
  const handleQuestionToggle = (question: Question) => {
    setSelectedQuestions(prev => {
      const isSelected = prev.find(q => q.id === question.id);
      if (isSelected) {
        return prev.filter(q => q.id !== question.id);
      } else {
        return [...prev, question];
      }
    });
  };

  // Save selected questions
  const saveSelectedQuestions = () => {
    setFormData(prev => ({
      ...prev,
      questions: selectedQuestions,
      totalQuestions: selectedQuestions.length
    }));
    closeQuestionModal();
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingExam) {
      // Update existing exam
      setExams(prev => prev.map(exam => 
        exam.id === editingExam.id 
          ? { 
              ...exam, 
              ...formData,
              questions: selectedQuestions,
              totalQuestions: selectedQuestions.length
            } as Exam
          : exam
      ));
    } else {
      // Create new exam
      const newExam: Exam = {
        id: Math.max(...exams.map(e => e.id)) + 1,
        ...formData,
        questions: selectedQuestions,
        totalQuestions: selectedQuestions.length,
        createdAt: new Date().toISOString().split('T')[0]
      } as Exam;
      setExams(prev => [...prev, newExam]);
    }
    
    closeModal();
  };

  // Handle delete
  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this exam?")) {
      setExams(prev => prev.filter(e => e.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Exam Management</h1>
        
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search exams..."
              value={searchTerm}
              onChange={handleSearch}
              className="py-2 px-4 pl-10 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 w-72"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <button 
            onClick={() => openModal()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
          >
            Create Exam
          </button>
        </div>
      </div>

      {/* Exams Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableCell className="font-semibold text-gray-900 px-6 py-4">ID</TableCell>
              <TableCell className="font-semibold text-gray-900 px-6 py-4">Title</TableCell>
              <TableCell className="font-semibold text-gray-900 px-6 py-4">Subject</TableCell>
              <TableCell className="font-semibold text-gray-900 px-6 py-4">Questions</TableCell>
              <TableCell className="font-semibold text-gray-900 px-6 py-4">Duration</TableCell>
              <TableCell className="font-semibold text-gray-900 px-6 py-4">Difficulty</TableCell>
              <TableCell className="font-semibold text-gray-900 px-6 py-4">Created</TableCell>
              <TableCell className="font-semibold text-gray-900 px-6 py-4">Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedExams.map((exam) => (
              <TableRow key={exam.id} className="border-b border-gray-200 hover:bg-gray-50">
                <TableCell className="px-6 py-4 text-sm text-gray-900">{exam.id}</TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-900 font-medium">
                  <div>
                    <div className="font-medium">{exam.title}</div>
                    <div className="text-gray-500 text-xs mt-1">{exam.description}</div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-600">{exam.subject}</TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-900 text-center">{exam.totalQuestions}</TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-600">{exam.duration} min</TableCell>
                <TableCell className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    exam.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    exam.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {exam.difficulty}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-600">{exam.createdAt}</TableCell>
                <TableCell className="px-6 py-4 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(exam)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(exam.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded ${
                  currentPage === page
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Create/Edit Exam Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} showCloseButton={false}>
        <div className="bg-white rounded-lg w-full max-w-2xl mx-auto">
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingExam ? 'Edit Exam' : 'Create New Exam'}
            </h2>
            <button
              onClick={closeModal}
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.04289 16.5413C5.65237 16.9318 5.65237 17.565 6.04289 17.9555C6.43342 18.346 7.06658 18.346 7.45711 17.9555L11.9987 13.4139L16.5408 17.956C16.9313 18.3466 17.5645 18.3466 17.955 17.956C18.3455 17.5655 18.3455 16.9323 17.955 16.5418L13.4129 11.9997L17.955 7.4576C18.3455 7.06707 18.3455 6.43391 17.955 6.04338C17.5645 5.65286 16.9313 5.65286 16.5408 6.04338L11.9987 10.5855L7.45711 6.0439C7.06658 5.65338 6.43342 5.65338 6.04289 6.0439C5.65237 6.43442 5.65237 7.06759 6.04289 7.45811L10.5845 11.9997L6.04289 16.5413Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
          
          {/* Modal Body */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exam Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter exam title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter exam description..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration || 60}
                    onChange={handleInputChange}
                    min="1"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Subject"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty || 'Easy'}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Questions ({selectedQuestions.length} selected)
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={openQuestionModal}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Select Questions
                  </button>
                  {selectedQuestions.length > 0 && (
                    <span className="text-sm text-gray-600">
                      {selectedQuestions.length} question(s) selected
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {editingExam ? 'Update' : 'Create'} Exam
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Question Selection Modal */}
      <Modal isOpen={isQuestionModalOpen} onClose={closeQuestionModal} showCloseButton={false}>
        <div className="bg-white rounded-lg w-full max-w-4xl mx-auto">
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Select Questions for Exam</h2>
            <button
              onClick={closeQuestionModal}
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.04289 16.5413C5.65237 16.9318 5.65237 17.565 6.04289 17.9555C6.43342 18.346 7.06658 18.346 7.45711 17.9555L11.9987 13.4139L16.5408 17.956C16.9313 18.3466 17.5645 18.3466 17.955 17.956C18.3455 17.5655 18.3455 16.9323 17.955 16.5418L13.4129 11.9997L17.955 7.4576C18.3455 7.06707 18.3455 6.43391 17.955 6.04338C17.5645 5.65286 16.9313 5.65286 16.5408 6.04338L11.9987 10.5855L7.45711 6.0439C7.06658 5.65338 6.43342 5.65338 6.04289 6.0439C5.65237 6.43442 5.65237 7.06759 6.04289 7.45811L10.5845 11.9997L6.04289 16.5413Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
          
          {/* Modal Body */}
          <div className="p-6">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {availableQuestions.map((question) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={selectedQuestions.find(q => q.id === question.id) !== undefined}
                      onChange={() => handleQuestionToggle(question)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 mb-2">
                        {renderMathText(question.questionText)}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div>A) {renderMathText(question.optionA)}</div>
                        <div>B) {renderMathText(question.optionB)}</div>
                        <div>C) {renderMathText(question.optionC)}</div>
                        <div>D) {renderMathText(question.optionD)}</div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Correct Answer: Option {question.correctAnswer} | Subject: {question.subject}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
            <button
              type="button"
              onClick={closeQuestionModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveSelectedQuestions}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Save Selection ({selectedQuestions.length})
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ExamPage;
