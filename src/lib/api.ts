// API base URL with fallback
const DEFAULT_API_URL = "http://ec2-54-66-6-158.ap-southeast-2.compute.amazonaws.com:5152/api";
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || DEFAULT_API_URL;

// API endpoints
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${API_BASE_URL}/Auth/login`,
        REGISTER: `${API_BASE_URL}/Auth/register`,
        GOOGLE_LOGIN: `${API_BASE_URL}/Auth/google-login`,
        LOGOUT: `${API_BASE_URL}/Auth/logout`,
    },
    CHAPTER: {
        GET_ALL: `${API_BASE_URL}/Chapter`,
        GET_BY_ID: `${API_BASE_URL}/Chapter`,
    },
    TOPICS: {
        GET_ALL: `${API_BASE_URL}/Topics`,
        GET_BY_ID: `${API_BASE_URL}/Topics`,
    },
    EXAM: {
        GET_ALL: `${API_BASE_URL}/ExamSets`,
        GENERATE_FROM_DROPDOWN: `${API_BASE_URL}/ExamSets/generate-exam-from-dropdown`,
        GENERATE_FROM_PROMPT: `${API_BASE_URL}/ExamSets/generate-exam-from-prompt`,
        GET_USER_EXAMS: `${API_BASE_URL}/ExamSets/get-exam-by-current-user`,
        GET_EXAM_QUESTIONS: `${API_BASE_URL}/ExamSets`,
        DOWNLOAD_WORD: `${API_BASE_URL}/ExamSets/download-file-word-exam`,
        UPDATE: `${API_BASE_URL}/ExamSets`,
        DELETE: `${API_BASE_URL}/ExamSets`,
    },
    USERS: {
        GET_ALL: `${API_BASE_URL}/Users`,
        GET_BY_ID: `${API_BASE_URL}/Users`,
        GET_BY_ROLE: `${API_BASE_URL}/Users/by-role`,
        UPDATE: `${API_BASE_URL}/Users`,
        DEACTIVATE: `${API_BASE_URL}/Users`,
    },
    QUESTIONS: {
        GET_ALL: `${API_BASE_URL}/Questions`,
        PROCESS_IMAGE: `${API_BASE_URL}/Questions/process-image`,
        SAVE_QUESTION: `${API_BASE_URL}/Questions`,
    },
} as const;

// Common API response types
export interface ApiResponse<T = unknown> {
    isSuccess: boolean;
    message: string;
    data: T;
}

export interface LoginResponse {
    accessToken: string;
    id: string;
    email: string;
    username: string;
    role: number;
    identityId: string;
}

export interface RegisterResponse {
    id: string;
    username: string;
    email: string;
    password: string;
    identityId: string;
    isProvider: boolean;
    role: number;
    status: number;
    createdAt: string;
    createdExamSets: null;
    reviewedExamSets: null;
}

// Chapter data types
export interface Chapter {
    id: number;
    classId: number;
    chapterName: string;
    class: any | null;
    topics: any | null;
    questions: any | null;
    questionTemplates: any | null;
    domainEvents: {
        $id: string;
        $values: any[];
    };
}

// Topic data types
export interface Topic {
    id: number;
    chapterId: number;
    topicName: string;
    chapter: any | null;
    domainEvents: {
        $id: string;
        $values: any[];
    };
}

// Pagination types
export interface PaginatedResponse<T> {
    items: {
        $id: string;
        $values: T[];
    };
    pageNumber: number;
    totalPages: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

// Topics query parameters
export interface TopicsQueryParams {
    pageNumber?: number;
    pageSize?: number;
    chapterId?: number;
    searchTerm?: string;
}

// Exam generation types
export interface ExamGenerationRequest {
    quantity: number;
    chapterId: number;
    topicId: number;
    classId: number;
}

// Difficulty level mapping (0-3 as per API)
export const DIFFICULTY_MAPPING = {
    "Easy": 0,
    "Medium": 1,
    "Hard": 2,
    "Expert": 3
} as const;

export type DifficultyLevel = keyof typeof DIFFICULTY_MAPPING;

// Exam history types
export interface ExamSet {
    id: string;
    title: string;
    classId: number;
    description: string;
    createdBy: string;
    createdAt: string;
    status: string;
    class: any | null;
    creator: any | null;
    examSetQuestions: {
        $id: string;
        $values: any[];
    };
    domainEvents: {
        $id: string;
        $values: any[];
    };
}

export interface ExamQuestion {
    id: string;
    question: string;
    className: string;
    chapterName: string;
    chapterId: number;
    topicId: number;
    topicName: string;
    difficulty: number;
    a: string;
    b: string;
    c: string;
    d: string;
    answer: string | null;
}

export interface ExamHistoryResponse {
    $id: string;
    $values: ExamSet[];
}

export interface ExamQuestionsResponse {
    $id: string;
    $values: ExamQuestion[];
}

// Question save request interface
export interface SaveQuestionRequest {
    classId: number;
    chapterId: number;
    topicId: number;
    questionContent: string;
    difficulty: number;
    questionOptionSet: {
        a: string;
        b: string;
        c: string;
        d: string;
        correct: string;
    };
}

// Admin-specific interfaces
export interface AdminExamData {
    id: string;
    title: string;
    subject: string;
    difficulty: number;
    questionCount: number;
    createdBy: string;
    createdAt: string;
    status: string;
    attempts?: number;
    avgScore?: number;
    class?: any;
    creator?: any;
}

export interface AdminUserData {
    id: string;
    username: string;
    email: string;
    role: number;
    status: number;
    createdAt: string;
    isProvider: boolean;
    identityId: string;
}

export interface AdminDashboardStats {
    totalExams: number;
    activeExams: number;
    totalAttempts: number;
    totalQuestions: number;
    avgScore: number;
    totalUsers: number;
    activeUsers: number;
}

export interface UsersQueryParams {
    pageNumber?: number;
    pageSize?: number;
    roleFilter?: number;
    statusFilter?: number;
    searchTerm?: string;
}

// User roles
export const USER_ROLES = {
    ADMIN: 1,
    USER: 2,
    MANAGER: 3,
} as const;

// API helper function
export async function apiCall<T = unknown>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json() as Promise<ApiResponse<T>>;
}

// Authenticated API helper function that automatically adds JWT token from localStorage
export async function authenticatedApiCall<T = unknown>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    // Get token from localStorage - check all possible key names
    const token = localStorage.getItem('accessToken') || 
                  localStorage.getItem('access_token') || 
                  localStorage.getItem('auth_token');
    
    if (!token) {
        // console.log('🔍 Available localStorage keys:', Object.keys(localStorage));
        throw new Error('No access token found. Please login first.');
    }

    // console.log('🔑 Using token for API call:', token.substring(0, 20) + '...');

    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            ...options.headers,
        },
    });

    if (!response.ok) {
        if (response.status === 401) {
            // Token might be expired, clear it from localStorage
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            throw new Error('Authentication failed. Please login again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json() as Promise<ApiResponse<T>>;
}

// Chapter API functions
export async function getAllChapters(): Promise<Chapter[]> {
    try {
        const response = await authenticatedApiCall<{ $values: Chapter[] }>(API_ENDPOINTS.CHAPTER.GET_ALL);
        // Extract the actual chapters array from the $values property
        return response.data.$values.filter(chapter => chapter.chapterName !== "Null");
    } catch (error) {
        console.error('Error fetching chapters:', error);
        throw error;
    }
}

// Get chapter by ID
export async function getChapterById(chapterId: number): Promise<Chapter> {
    try {
        const response = await authenticatedApiCall<Chapter>(`${API_ENDPOINTS.CHAPTER.GET_BY_ID}/${chapterId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching chapter by ID:', chapterId, error);
        throw error;
    }
}

// Topic API functions
export async function getTopicsByChapter(chapterId: number, params: Omit<TopicsQueryParams, 'chapterId'> = {}): Promise<Topic[]> {
    try {
        // Build query parameters
        const queryParams = new URLSearchParams();
        queryParams.append('chapterId', chapterId.toString());
        queryParams.append('pageNumber', (params.pageNumber || 1).toString());
        if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
        if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);

        const url = `${API_ENDPOINTS.TOPICS.GET_ALL}?${queryParams.toString()}`;
        const response = await authenticatedApiCall<PaginatedResponse<Topic>>(url);
        
        // Extract the topics array from the paginated response
        return response.data.items.$values;
    } catch (error) {
        console.error('Error fetching topics for chapter:', chapterId, error);
        throw error;
    }
}

// Get topic by ID
export async function getTopicById(topicId: number): Promise<Topic> {
    try {
        const response = await authenticatedApiCall<Topic>(`${API_ENDPOINTS.TOPICS.GET_BY_ID}/${topicId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching topic by ID:', topicId, error);
        throw error;
    }
}

// Get all topics with pagination support
export async function getAllTopics(params: TopicsQueryParams = {}): Promise<{topics: Topic[], pagination: Omit<PaginatedResponse<Topic>, 'items'>}> {
    try {
        // Build query parameters
        const queryParams = new URLSearchParams();
        if (params.pageNumber) queryParams.append('pageNumber', params.pageNumber.toString());
        if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
        if (params.chapterId) queryParams.append('chapterId', params.chapterId.toString());
        if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);

        const url = `${API_ENDPOINTS.TOPICS.GET_ALL}?${queryParams.toString()}`;
        const response = await authenticatedApiCall<PaginatedResponse<Topic>>(url);
        
        return {
            topics: response.data.items.$values,
            pagination: {
                pageNumber: response.data.pageNumber,
                totalPages: response.data.totalPages,
                totalCount: response.data.totalCount,
                hasPreviousPage: response.data.hasPreviousPage,
                hasNextPage: response.data.hasNextPage
            }
        };
    } catch (error) {
        console.error('Error fetching topics:', error);
        throw error;
    }
}

// Search topics by name
export async function searchTopics(searchTerm: string, chapterId?: number): Promise<Topic[]> {
    try {
        const params: TopicsQueryParams = {
            searchTerm,
            pageNumber: 1,
            pageSize: 100 // Get more results for search
        };
        if (chapterId) params.chapterId = chapterId;

        const result = await getAllTopics(params);
        return result.topics;
    } catch (error) {
        console.error('Error searching topics:', error);
        throw error;
    }
}

// Exam generation functions
export async function generateExam(
    chapterId: number,
    topicId: number,
    difficulty: DifficultyLevel,
    quantity: number,
    classId: number = 1 // Default class ID
): Promise<any> {
    try {
        const requestData: ExamGenerationRequest = {
            quantity,
            chapterId,
            topicId,
            classId
        };

        // console.log('🔄 Generating exam with:', {
        //     ...requestData,
        //     difficulty: `${difficulty} (${DIFFICULTY_MAPPING[difficulty]})`
        // });

        const response = await authenticatedApiCall(
            API_ENDPOINTS.EXAM.GENERATE_FROM_DROPDOWN,
            {
                method: 'POST',
                body: JSON.stringify(requestData)
            }
        );

        // console.log('✅ Exam generated successfully:', response);
        return response.data;
    } catch (error) {
        console.error('❌ Error generating exam:', error);
        throw error;
    }
}

// Generate exam from prompt
export async function generateExamFromPrompt(prompt: string): Promise<any> {
    try {
        // console.log('🔄 Generating exam from prompt:', prompt);

        const response = await authenticatedApiCall(
            API_ENDPOINTS.EXAM.GENERATE_FROM_PROMPT,
            {
                method: 'POST',
                body: JSON.stringify({ prompt })
            }
        );

        // console.log('✅ Exam generated from prompt successfully:', response);
        return response.data;
    } catch (error) {
        console.error('❌ Error generating exam from prompt:', error);
        throw error;
    }
}

// Get user's exam history
export async function getUserExams(): Promise<ExamSet[]> {
    try {
        // console.log('🔄 Fetching user exam history...');

        const response = await authenticatedApiCall(
            API_ENDPOINTS.EXAM.GET_USER_EXAMS,
            {
                method: 'GET'
            }
        ) as ApiResponse<ExamHistoryResponse>;

        // console.log('✅ User exams fetched successfully:', response.data);
        
        // Handle the paginated response structure
        const examSets = (response.data as any)?.$values || [];
        return examSets;
    } catch (error) {
        console.error('❌ Error fetching user exams:', error);
        throw error;
    }
}

// Get exam questions by exam ID
export async function getExamQuestions(examId: string): Promise<ExamQuestion[]> {
    try {
        // console.log('🔄 Fetching exam questions for exam:', examId);

        const response = await authenticatedApiCall(
            `${API_ENDPOINTS.EXAM.GET_EXAM_QUESTIONS}/${examId}`,
            {
                method: 'GET'
            }
        ) as ApiResponse<any>;

        // console.log('✅ Exam questions fetched successfully:', response.data);
        
        // Handle the new response structure
        const examSet = response.data;
        const examSetQuestions = examSet?.examSetQuestions?.$values || [];
        
        // Transform the data to match our ExamQuestion interface
        const questions: ExamQuestion[] = await Promise.all(examSetQuestions.map(async (examSetQuestion: any) => {
            const question = examSetQuestion.question;
            const options = question.questionOptionSet;
            
            // Fetch chapter and topic names
            let chapterName = 'Unknown';
            let topicName = 'Unknown';
            
            try {
                if (question.chapterId) {
                    const chapter = await getChapterById(question.chapterId);
                    chapterName = chapter.chapterName;
                }
            } catch (err) {
                console.error(`Error fetching chapter ${question.chapterId}:`, err);
            }
            
            try {
                if (question.topicId) {
                    const topic = await getTopicById(question.topicId);
                    topicName = topic.topicName;
                }
            } catch (err) {
                console.error(`Error fetching topic ${question.topicId}:`, err);
            }
            
            return {
                id: question.id,
                question: question.questionContent,
                className: 'Physics', // Default since not provided in response
                chapterName,
                chapterId: question.chapterId,
                topicId: question.topicId,
                topicName,
                difficulty: question.difficulty,
                a: options?.a || '',
                b: options?.b || '',
                c: options?.c || '',
                d: options?.d || '',
                answer: options?.correct || null
            };
        }));
        
        // console.log('🔄 Transformed questions:', questions);
        return questions;
    } catch (error) {
        console.error('❌ Error fetching exam questions:', error);
        throw error;
    }
}

// OCR - Process image/PDF to extract questions
export async function processImageToQuestions(file: File): Promise<ExamQuestion[]> {
    try {
        // console.log('🔄 Processing image/PDF for question extraction:', file.name);

        // Check if we're in browser environment
        if (typeof window === 'undefined') {
            throw new Error('File upload can only be used in browser environment');
        }

        const token = localStorage.getItem('accessToken') || 
                      localStorage.getItem('access_token') || 
                      localStorage.getItem('auth_token');
        
        if (!token) {
            throw new Error('No authentication token found');
        }

        // Validate file size (limit to 10MB for better processing)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            throw new Error('File too large. Please use files smaller than 10MB for better processing.');
        }

        // Validate file type
        const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            throw new Error('Invalid file type. Please use PDF, JPEG, JPG, or PNG files.');
        }

        // Create FormData for file upload
        const formData = new FormData();
        formData.append('File', file);

        // Create AbortController for timeout handling
        const controller = new AbortController();
        // Increase timeout based on file size
        const fileSize = file.size / (1024 * 1024); // Size in MB
        let timeoutDuration = 60000; // Base timeout: 1 minute
        
        if (fileSize > 5) {
            timeoutDuration = 180000; // 3 minutes for large files (>5MB)
        } else if (fileSize > 2) {
            timeoutDuration = 120000; // 2 minutes for medium files (>2MB)
        }
        
        const timeoutId = setTimeout(() => {
            controller.abort();
        }, timeoutDuration);

        try {
            const response = await fetch(API_ENDPOINTS.QUESTIONS.PROCESS_IMAGE, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': '*/*'
                },
                body: formData,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                let errorMessage = '';
                
                switch (response.status) {
                    case 500:
                        errorMessage = 'Server error occurred while processing the file. The OCR service may be temporarily unavailable. Please try again later.';
                        break;
                    case 504:
                        errorMessage = 'Processing timeout. The file may be too complex or the server is overloaded. Please try with a smaller file or try again later.';
                        break;
                    case 413:
                        errorMessage = 'File too large. Please use a smaller file.';
                        break;
                    case 415:
                        errorMessage = 'Unsupported file type. Please use PDF, JPEG, JPG, or PNG files.';
                        break;
                    case 401:
                        errorMessage = 'Authentication failed. Please log in again.';
                        break;
                    case 403:
                        errorMessage = 'You do not have permission to use the OCR service.';
                        break;
                    default:
                        const errorText = await response.text().catch(() => 'Unknown error');
                        errorMessage = `OCR processing failed (${response.status}): ${errorText}`;
                }
                
                console.error('❌ OCR processing failed:', response.status, errorMessage);
                throw new Error(errorMessage);
            }

            const result = await response.json() as ApiResponse<{ $values: ExamQuestion[] }>;
            
            // console.log('✅ OCR processing successful:', result.data);
            
            // Extract questions from the response
            const questions = result.data?.$values || [];
            
            if (questions.length === 0) {
                throw new Error('No questions were extracted from the file. Please ensure the file contains readable text and question content.');
            }
            
            return questions;
        } catch (fetchError) {
            clearTimeout(timeoutId);
            
            if (fetchError instanceof Error && fetchError.name === 'AbortError') {
                const timeoutMinutes = Math.ceil(timeoutDuration / 60000);
                throw new Error(`Processing timeout after ${timeoutMinutes} minute(s). The file "${file.name}" (${fileSize.toFixed(1)}MB) may be too complex or contain dense content. Try using a smaller file, splitting the document into sections, or converting to a simpler image format.`);
            }
            
            throw fetchError;
        }
    } catch (error) {
        console.error('❌ Error processing image/PDF:', error);
        
        // Provide user-friendly error messages
        if (error instanceof Error) {
            // Re-throw with the original message if it's already user-friendly
            if (error.message.includes('timeout') || 
                error.message.includes('Server error') || 
                error.message.includes('too large') ||
                error.message.includes('Authentication') ||
                error.message.includes('permission') ||
                error.message.includes('file type') ||
                error.message.includes('No questions')) {
                throw error;
            }
            
            // Provide generic user-friendly message for other errors
            throw new Error('Failed to process the file. Please check your internet connection and try again.');
        }
        
        throw new Error('An unexpected error occurred while processing the file.');
    }
}

// Save question to database
export async function saveQuestion(questionData: SaveQuestionRequest): Promise<any> {
    try {
        // console.log('🔄 Saving question to database:', questionData);

        const response = await authenticatedApiCall(
            API_ENDPOINTS.QUESTIONS.SAVE_QUESTION,
            {
                method: 'POST',
                body: JSON.stringify(questionData)
            }
        );

        // console.log('✅ Question saved successfully:', response);
        return response.data;
    } catch (error) {
        console.error('❌ Error saving question:', error);
        throw error;
    }
}

// Download exam as Word document
export async function downloadExamWord(examSetId: string): Promise<void> {
    try {
        // console.log('🔄 Downloading exam Word document for exam:', examSetId);

        // Check if we're in browser environment
        if (typeof window === 'undefined') {
            throw new Error('Download function can only be used in browser environment');
        }

        const token = localStorage.getItem('accessToken') || 
                      localStorage.getItem('access_token') || 
                      localStorage.getItem('auth_token');
        
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`${API_ENDPOINTS.EXAM.DOWNLOAD_WORD}/${examSetId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': '*/*'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Download failed:', response.status, errorText);
            throw new Error(`Download failed: ${response.status} ${response.statusText}`);
        }

        // Get the blob from response
        const blob = await response.blob();
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `exam_${examSetId}.docx`;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        // console.log('✅ Exam downloaded successfully');
    } catch (error) {
        console.error('❌ Error downloading exam:', error);
        throw error;
    }
}

// Admin API Functions

// Get all exams for admin dashboard
export async function getAllExams(params?: { pageNumber?: number; pageSize?: number }): Promise<PaginatedResponse<AdminExamData>> {
    try {
        const queryParams = new URLSearchParams();
        if (params?.pageNumber) queryParams.append('pageNumber', params.pageNumber.toString());
        if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
        
        const url = params ? `${API_ENDPOINTS.EXAM.GET_ALL}?${queryParams.toString()}` : API_ENDPOINTS.EXAM.GET_ALL;
        const response = await authenticatedApiCall(url, { method: 'GET' }) as ApiResponse<PaginatedResponse<AdminExamData>>;
        return response.data;
    } catch (error) {
        console.error('❌ Error fetching all exams:', error);
        throw error;
    }
}

// Get all users for admin dashboard
export async function getAllUsers(params?: UsersQueryParams): Promise<PaginatedResponse<AdminUserData>> {
    try {
        const queryParams = new URLSearchParams();
        if (params?.pageNumber) queryParams.append('pageNumber', params.pageNumber.toString());
        if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
        if (params?.roleFilter !== undefined) queryParams.append('roleFilter', params.roleFilter.toString());
        if (params?.statusFilter !== undefined) queryParams.append('statusFilter', params.statusFilter.toString());
        if (params?.searchTerm) queryParams.append('searchTerm', params.searchTerm);
        
        const url = params ? `${API_ENDPOINTS.USERS.GET_ALL}?${queryParams.toString()}` : API_ENDPOINTS.USERS.GET_ALL;
        const response = await authenticatedApiCall(url, { method: 'GET' }) as ApiResponse<PaginatedResponse<AdminUserData>>;
        return response.data;
    } catch (error) {
        console.error('❌ Error fetching all users:', error);
        throw error;
    }
}

// Get all questions for admin dashboard
export async function getAllQuestions(params?: { pageNumber?: number; pageSize?: number }): Promise<PaginatedResponse<ExamQuestion>> {
    try {
        const queryParams = new URLSearchParams();
        if (params?.pageNumber) queryParams.append('pageNumber', params.pageNumber.toString());
        if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
        
        const url = params ? `${API_ENDPOINTS.QUESTIONS.GET_ALL}?${queryParams.toString()}` : API_ENDPOINTS.QUESTIONS.GET_ALL;
        const response = await authenticatedApiCall(url, { method: 'GET' }) as ApiResponse<PaginatedResponse<ExamQuestion>>;
        return response.data;
    } catch (error) {
        console.error('❌ Error fetching all questions:', error);
        throw error;
    }
}

// Delete exam (admin only)
export async function deleteExam(examId: string): Promise<void> {
    try {
        await authenticatedApiCall(`${API_ENDPOINTS.EXAM.DELETE}/${examId}`, { method: 'DELETE' });
    } catch (error) {
        console.error('❌ Error deleting exam:', error);
        throw error;
    }
}

// Deactivate user (admin only)
export async function deactivateUser(userId: string): Promise<void> {
    try {
        await authenticatedApiCall(`${API_ENDPOINTS.USERS.DEACTIVATE}/${userId}/deactivate`, { method: 'PATCH' });
    } catch (error) {
        console.error('❌ Error deactivating user:', error);
        throw error;
    }
}

// Get dashboard statistics
export async function getDashboardStats(): Promise<AdminDashboardStats> {
    try {
        // Fetch data from multiple endpoints
        const [examsResponse, usersResponse, questionsResponse] = await Promise.all([
            getAllExams({ pageSize: 1000 }), // Get all exams for stats
            getAllUsers({ pageSize: 1000 }),  // Get all users for stats
            getAllQuestions({ pageSize: 1000 }) // Get all questions for stats
        ]);

        const allExams = examsResponse.items.$values || [];
        const allUsers = usersResponse.items.$values || [];
        const allQuestions = questionsResponse.items.$values || [];

        // Calculate statistics
        const totalExams = allExams.length;
        const activeExams = allExams.filter(exam => exam.status === 'Active' || exam.status === 'Published').length;
        const totalUsers = allUsers.length;
        const activeUsers = allUsers.filter(user => user.status === 1).length; // Assuming 1 is active status
        const totalQuestions = allQuestions.length;

        // Calculate total attempts and average score (mock data for now since API doesn't provide this)
        const totalAttempts = allExams.reduce((sum, exam) => sum + (exam.attempts || 0), 0);
        const avgScore = allExams.filter(exam => (exam.avgScore || 0) > 0)
            .reduce((sum, exam, _, arr) => sum + (exam.avgScore || 0) / arr.length, 0);

        return {
            totalExams,
            activeExams,
            totalAttempts: totalAttempts || 0,
            totalQuestions,
            avgScore: Math.round(avgScore) || 0,
            totalUsers,
            activeUsers
        };
    } catch (error) {
        console.error('❌ Error fetching dashboard stats:', error);
        throw error;
    }
}
