"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal/index";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";

// Types
interface Chapter {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
}

// Mock data - replace with actual API calls
const mockChapters: Chapter[] = [
  {
    id: 1,
    name: "Cơ học",
    description: "Chương về cơ học và chuyển động",
    created_at: "2024-01-01"
  },
  {
    id: 2,
    name: "Dao động",
    description: "Chương về dao động cơ và sóng",
    created_at: "2024-01-02"
  },
  {
    id: 3,
    name: "Điện học",
    description: "Chương về điện và từ",
    created_at: "2024-01-03"
  },
  {
    id: 4,
    name: "Quang học",
    description: "Chương về ánh sáng và quang học",
    created_at: "2024-01-04"
  }
];

export default function ChaptersPage() {
  const [chapters, setChapters] = useState<Chapter[]>(mockChapters);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [formData, setFormData] = useState<Partial<Chapter>>({
    name: "",
    description: ""
  });

  // Search and filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredChapters, setFilteredChapters] = useState<Chapter[]>(chapters);

  useEffect(() => {
    const filtered = chapters.filter(chapter =>
      chapter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (chapter.description && chapter.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredChapters(filtered);
  }, [chapters, searchTerm]);

  // Open modal for create/edit
  const openModal = (chapter?: Chapter) => {
    if (chapter) {
      setEditingChapter(chapter);
      setFormData({
        name: chapter.name,
        description: chapter.description || ""
      });
    } else {
      setEditingChapter(null);
      setFormData({
        name: "",
        description: ""
      });
    }
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingChapter(null);
    setFormData({
      name: "",
      description: ""
    });
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingChapter) {
      // Update existing chapter
      setChapters(prev => prev.map(chapter =>
        chapter.id === editingChapter.id
          ? { ...chapter, ...formData }
          : chapter
      ));
    } else {
      // Create new chapter
      const newChapter: Chapter = {
        id: Date.now(),
        name: formData.name!,
        description: formData.description,
        created_at: new Date().toISOString().split('T')[0]
      };
      setChapters(prev => [newChapter, ...prev]);
    }
    
    closeModal();
  };

  // Handle delete
  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa chương này?")) {
      setChapters(prev => prev.filter(chapter => chapter.id !== id));
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Chương</h1>
        <button
          onClick={() => openModal()}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Thêm chương mới
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm chương..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableCell isHeader={true} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên chương
              </TableCell>
              <TableCell isHeader={true} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mô tả
              </TableCell>
              <TableCell isHeader={true} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày tạo
              </TableCell>
              <TableCell isHeader={true} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredChapters.map((chapter, index) => (
              <TableRow key={chapter.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {chapter.name}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {chapter.description || "Không có mô tả"}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {chapter.created_at}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(chapter)}
                      className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition-colors text-xs"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(chapter.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors text-xs"
                    >
                      Xóa
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Chapter Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} showCloseButton={false}>
        <div className="bg-white rounded-lg w-full max-w-md mx-auto">
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingChapter ? "Sửa chương" : "Thêm chương mới"}
            </h3>
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
                  Tên chương *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Nhập tên chương..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Nhập mô tả chương..."
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {editingChapter ? "Cập nhật" : "Thêm mới"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
