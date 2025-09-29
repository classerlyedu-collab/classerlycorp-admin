interface FeedbackCounts {
    [key: string]: number; // Dynamic keys for feedback counts
}

interface Feedback {
    counts: FeedbackCounts;
    total: number;
    average: number;
}

interface Auth {
    _id: string;
    fullName: string;
    userName: string;
    email: string;
    userType: string;
    fullAddress: string;
    profile: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    __v: number;
    image: string; // URL to the image
    emailNotification: boolean;
    notification: boolean;
    isBlocked: boolean;
}

export interface TeacherType {
    feedback: Feedback;
    _id: string;
    auth: Auth;
    subjects: string[]; // Array of subject IDs
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    __v: number;
    grade: string[]; // Array of grade IDs
    students: string[]; // Array of student IDs
}