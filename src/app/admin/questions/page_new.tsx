// "use client";

// import React, { useState } from "react";
// // import Link from "next/link";

// // Types
// interface Question {
//   id: number;
//   question_text: string;
//   option_a: string;
//   option_b: string;
//   option_c: string;
//   option_d: string;
//   correct_answer: string;
//   chapter_id?: number;
//   topic_id?: number;
//   created_at?: string;
// }

// interface Chapter {
//   id: number;
//   name: string;
// }

// interface Topic {
//   id: number;
//   name: string;
//   chapter_id: number;
// }

// // Mock data - replace with actual API calls
// const mockQuestions: Question[] = [
//   {
//     id: 1,
//     question_text: "Gia tốc trọng trường trên Trái Đất là bao nhiêu?",
//     option_a: "9.8 m/s²",
//     option_b: "10 m/s²", 
//     option_c: "8.9 m/s²",
//     option_d: "11 m/s²",
//     correct_answer: "A",
//     chapter_id: 1,
//     topic_id: 1,
//     created_at: "2024-01-01"
//   },
//   {
//     id: 2,
//     question_text: "Công thức tính vận tốc là gì?",
//     option_a: "v = a.t",
//     option_b: "v = s/t",
//     option_c: "v = s.t",
//     option_d: "v = a/t",
//     correct_answer: "B",
//     chapter_id: 1,
//     topic_id: 1,
//     created_at: "2024-01-02"
//   }
// ];

// const mockChapters: Chapter[] = [
//   { id: 1, name: "Cơ học" },
//   { id: 2, name: "Dao động và sóng" },
//   { id: 3, name: "Điện học" }
// ];

// const mockTopics: Topic[] = [
//   { id: 1, name: "Chuyển động thẳng", chapter_id: 1 },
//   { id: 2, name: "Chuyển động tròn", chapter_id: 1 },
//   { id: 3, name: "Dao động điều hòa", chapter_id: 2 }
// ];

// export default function QuestionsPage() {
//   const [questions, setQuestions] = useState<Question[]>(mockQuestions);
//   const [chapters] = useState<Chapter[]>(mockChapters);
//   const [topics] = useState<Topic[]>(mockTopics);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedChapter, setSelectedChapter] = useState<number | "">("");

//   // Form state
//   const [formData, setFormData] = useState({
//     question_text: "",
//     option_a: "",
//     option_b: "",
//     option_c: "",
//     option_d: "",
//     correct_answer: "A",
//     chapter_id: "",
//     topic_id: ""
//   });

//   // Filter questions
//   const filteredQuestions = questions.filter(question => {
//     const matchesSearch = question.question_text.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesChapter = selectedChapter === "" || question.chapter_id === selectedChapter;
//     return matchesSearch && matchesChapter;
//   });

//   // Get available topics for selected chapter
//   const availableTopics = topics.filter(topic => topic.chapter_id === Number(formData.chapter_id));

//   const openModal = (question?: Question) => {
//     if (question) {
//       setEditingQuestion(question);
//       setFormData({
//         question_text: question.question_text,
//         option_a: question.option_a,
//         option_b: question.option_b,
//         option_c: question.option_c,
//         option_d: question.option_d,
//         correct_answer: question.correct_answer,
//         chapter_id: question.chapter_id?.toString() || "",
//         topic_id: question.topic_id?.toString() || ""
//       });
//     } else {
//       setEditingQuestion(null);
//       setFormData({
//         question_text: "",
//         option_a: "",
//         option_b: "",
//         option_c: "",
//         option_d: "",
//         correct_answer: "A",
//         chapter_id: "",
//         topic_id: ""
//       });
//     }
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setEditingQuestion(null);
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (editingQuestion) {
//       // Update existing question
//       setQuestions(questions.map(q => 
//         q.id === editingQuestion.id 
//           ? { 
//               ...q, 
//               ...formData,
//               chapter_id: Number(formData.chapter_id),
//               topic_id: Number(formData.topic_id)
//             }
//           : q
//       ));
//     } else {
//       // Add new question
//       const newQuestion: Question = {
//         id: Math.max(...questions.map(q => q.id)) + 1,
//         ...formData,
//         chapter_id: Number(formData.chapter_id),
//         topic_id: Number(formData.topic_id),
//         created_at: new Date().toISOString().split('T')[0]
//       };
//       setQuestions([...questions, newQuestion]);
//     }
    
//     closeModal();
//   };

//   const handleDelete = (id: number) => {
//     if (confirm("Bạn có chắc chắn muốn xóa câu hỏi này?")) {
//       setQuestions(questions.filter(q => q.id !== id));
//     }
//   };

//   const getChapterName = (chapterId?: number) => {
//     return chapters.find(c => c.id === chapterId)?.name || "N/A";
//   };

//   const getTopicName = (topicId?: number) => {
//     return topics.find(t => t.id === topicId)?.name || "N/A";
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">Quản lý Câu hỏi</h1>
//         <button
//           onClick={() => openModal()}
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//         >
//           Thêm câu hỏi mới
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="mb-6 flex gap-4">
//         <div className="flex-1">
//           <input
//             type="text"
//             placeholder="Tìm kiếm câu hỏi..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           />
//         </div>
//         <div>
//           <select
//             value={selectedChapter}
//             onChange={(e) => setSelectedChapter(e.target.value === "" ? "" : Number(e.target.value))}
//             className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           >
//             <option value="">Tất cả chương</option>
//             {chapters.map(chapter => (
//               <option key={chapter.id} value={chapter.id}>
//                 {chapter.name}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Questions Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Câu hỏi
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Chương
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Chủ đề
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Đáp án đúng
//               </th>
//               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Hành động
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {filteredQuestions.map((question) => (
//               <tr key={question.id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4">
//                   <div className="text-sm font-medium text-gray-900 max-w-md">
//                     {question.question_text}
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {getChapterName(question.chapter_id)}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {getTopicName(question.topic_id)}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
//                     {question.correct_answer}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                   <button
//                     onClick={() => openModal(question)}
//                     className="text-indigo-600 hover:text-indigo-900 mr-3"
//                   >
//                     Sửa
//                   </button>
//                   <button
//                     onClick={() => handleDelete(question.id)}
//                     className="text-red-600 hover:text-red-900"
//                   >
//                     Xóa
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//             <div className="px-6 py-4 border-b border-gray-200">
//               <h3 className="text-lg font-medium text-gray-900">
//                 {editingQuestion ? "Sửa câu hỏi" : "Thêm câu hỏi mới"}
//               </h3>
//             </div>
            
//             <form onSubmit={handleSubmit} className="p-6">
//               <div className="space-y-4">
//                 {/* Question Text */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Câu hỏi *
//                   </label>
//                   <textarea
//                     value={formData.question_text}
//                     onChange={(e) => setFormData({...formData, question_text: e.target.value})}
//                     required
//                     rows={3}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Nhập nội dung câu hỏi..."
//                   />
//                 </div>

//                 {/* Options */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Đáp án A *
//                     </label>
//                     <input
//                       type="text"
//                       value={formData.option_a}
//                       onChange={(e) => setFormData({...formData, option_a: e.target.value})}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       placeholder="Đáp án A"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Đáp án B *
//                     </label>
//                     <input
//                       type="text"
//                       value={formData.option_b}
//                       onChange={(e) => setFormData({...formData, option_b: e.target.value})}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       placeholder="Đáp án B"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Đáp án C *
//                     </label>
//                     <input
//                       type="text"
//                       value={formData.option_c}
//                       onChange={(e) => setFormData({...formData, option_c: e.target.value})}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       placeholder="Đáp án C"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Đáp án D *
//                     </label>
//                     <input
//                       type="text"
//                       value={formData.option_d}
//                       onChange={(e) => setFormData({...formData, option_d: e.target.value})}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       placeholder="Đáp án D"
//                     />
//                   </div>
//                 </div>

//                 {/* Correct Answer */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Đáp án đúng *
//                   </label>
//                   <select
//                     value={formData.correct_answer}
//                     onChange={(e) => setFormData({...formData, correct_answer: e.target.value})}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                     <option value="A">A</option>
//                     <option value="B">B</option>
//                     <option value="C">C</option>
//                     <option value="D">D</option>
//                   </select>
//                 </div>

//                 {/* Chapter and Topic */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Chương
//                     </label>
//                     <select
//                       value={formData.chapter_id}
//                       onChange={(e) => setFormData({...formData, chapter_id: e.target.value, topic_id: ""})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     >
//                       <option value="">Chọn chương</option>
//                       {chapters.map(chapter => (
//                         <option key={chapter.id} value={chapter.id}>
//                           {chapter.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Chủ đề
//                     </label>
//                     <select
//                       value={formData.topic_id}
//                       onChange={(e) => setFormData({...formData, topic_id: e.target.value})}
//                       disabled={!formData.chapter_id}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
//                     >
//                       <option value="">Chọn chủ đề</option>
//                       {availableTopics.map(topic => (
//                         <option key={topic.id} value={topic.id}>
//                           {topic.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
//                 <button
//                   type="button"
//                   onClick={closeModal}
//                   className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
//                 >
//                   Hủy
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   {editingQuestion ? "Cập nhật" : "Thêm mới"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
