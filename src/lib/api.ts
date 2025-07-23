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
        GENERATE_FROM_DROPDOWN: `${API_BASE_URL}/ExamSets/generate-exam-from-dropdown`,
        GENERATE_FROM_PROMPT: `${API_BASE_URL}/ExamSets/generate-exam-from-prompt`,
        GET_USER_EXAMS: `${API_BASE_URL}/ExamSets/get-exam-by-current-user`,
        GET_EXAM_QUESTIONS: `${API_BASE_URL}/ExamSets`,
        DOWNLOAD_WORD: `${API_BASE_URL}/ExamSets/download-file-word-exam`,
    },
    QUESTIONS: {
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
        console.log('🔍 Available localStorage keys:', Object.keys(localStorage));
        throw new Error('No access token found. Please login first.');
    }

    console.log('🔑 Using token for API call:', token.substring(0, 20) + '...');

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

        console.log('🔄 Generating exam with:', {
            ...requestData,
            difficulty: `${difficulty} (${DIFFICULTY_MAPPING[difficulty]})`
        });

        const response = await authenticatedApiCall(
            API_ENDPOINTS.EXAM.GENERATE_FROM_DROPDOWN,
            {
                method: 'POST',
                body: JSON.stringify(requestData)
            }
        );

        console.log('✅ Exam generated successfully:', response);
        return response.data;
    } catch (error) {
        console.error('❌ Error generating exam:', error);
        throw error;
    }
}

// Generate exam from prompt
export async function generateExamFromPrompt(prompt: string): Promise<any> {
    try {
        console.log('🔄 Generating exam from prompt:', prompt);

        const response = await authenticatedApiCall(
            API_ENDPOINTS.EXAM.GENERATE_FROM_PROMPT,
            {
                method: 'POST',
                body: JSON.stringify({ prompt })
            }
        );

        console.log('✅ Exam generated from prompt successfully:', response);
        return response.data;
    } catch (error) {
        console.error('❌ Error generating exam from prompt:', error);
        throw error;
    }
}

// Get user's exam history
export async function getUserExams(): Promise<ExamSet[]> {
    try {
        console.log('🔄 Fetching user exam history...');

        const response = await authenticatedApiCall(
            API_ENDPOINTS.EXAM.GET_USER_EXAMS,
            {
                method: 'GET'
            }
        ) as ApiResponse<ExamHistoryResponse>;

        console.log('✅ User exams fetched successfully:', response.data);
        
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
        console.log('🔄 Fetching exam questions for exam:', examId);

        const response = await authenticatedApiCall(
            `${API_ENDPOINTS.EXAM.GET_EXAM_QUESTIONS}/${examId}`,
            {
                method: 'GET'
            }
        ) as ApiResponse<any>;

        console.log('✅ Exam questions fetched successfully:', response.data);
        
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
        
        console.log('🔄 Transformed questions:', questions);
        return questions;
    } catch (error) {
        console.error('❌ Error fetching exam questions:', error);
        throw error;
    }
}

// OCR - Process image/PDF to extract questions
export async function processImageToQuestions(file: File): Promise<ExamQuestion[]> {
    try {
        console.log('🔄 Processing image/PDF for question extraction:', file.name);

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

        // Create FormData for file upload
        const formData = new FormData();
        formData.append('File', file);

        const response = await fetch(API_ENDPOINTS.QUESTIONS.PROCESS_IMAGE, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': '*/*'
            },
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ OCR processing failed:', response.status, errorText);
            throw new Error(`OCR processing failed: ${response.status} ${response.statusText}`);
        }

        const result = await response.json() as ApiResponse<{ $values: ExamQuestion[] }>;
        
        console.log('✅ OCR processing successful:', result.data);
        
        // Extract questions from the response
        const questions = result.data?.$values || [];
        return questions;
    } catch (error) {
        console.error('❌ Error processing image/PDF:', error);
        throw error;
    }
}

// Save question to database
export async function saveQuestion(questionData: SaveQuestionRequest): Promise<any> {
    try {
        console.log('🔄 Saving question to database:', questionData);

        const response = await authenticatedApiCall(
            API_ENDPOINTS.QUESTIONS.SAVE_QUESTION,
            {
                method: 'POST',
                body: JSON.stringify(questionData)
            }
        );

        console.log('✅ Question saved successfully:', response);
        return response.data;
    } catch (error) {
        console.error('❌ Error saving question:', error);
        throw error;
    }
}

// Download exam as Word document
export async function downloadExamWord(examSetId: string): Promise<void> {
    try {
        console.log('🔄 Downloading exam Word document for exam:', examSetId);

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

        console.log('✅ Exam downloaded successfully');
    } catch (error) {
        console.error('❌ Error downloading exam:', error);
        throw error;
    }
}
