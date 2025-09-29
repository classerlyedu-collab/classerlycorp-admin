interface FeedbackCounts {
    [key: string]: number; // Dynamic keys for feedback counts
}

interface Feedback {
    counts: FeedbackCounts;
    total: number;
    average: number;
}

interface Teacher {
    feedback: Feedback;
    _id: string;
    auth: string; // ID or reference to the auth
    grade: string[]; // Array of grade IDs
    students: string[]; // Array of student IDs
    subjects: string[]; // Array of subject IDs
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    __v: number;
}

interface Grade {
    _id: string;
    grade: string; // e.g., "Grade 9"
    students: string[]; // Array of student IDs
    teachers: string[]; // Array of teacher IDs
    subjects: string[]; // Array of subject IDs
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    __v: number;
}

export interface SubjectType {
    _id: string;
    name: string;
    image: string; // URL to the image
    topics: string[]; // Array of topic IDs
    grade: Grade; // Grade details
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    __v: number;
    teachers: Teacher[]; // Array of teachers
}