type FeedbackCounts = {
    "1": number;
    "2": number;
    "3": number;
    "4": number;
    "5": number;
};

type Feedback = {
    counts: FeedbackCounts;
    total: number;
    average: number;
};

type Auth = {
    _id: string;
    fullName: string;
    userName: string;
    email: string;
    userType: string;
    fullAddress: string;
    profile: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    image: string;
    otp: string;
    emailNotification: boolean;
    notification: boolean;
    isBlocked: boolean;
};

type Grade = {
    _id: string;
    grade: string;
    students: string[];
    teachers: string[];
    subjects: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
};

type Subject = {
    _id: string;
    name: string;
    image: string;
    topics: any[]; // Specify the type if known
    grade: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    teachers: string[];
};

export type Students = {
    feedback: Feedback;
    _id: string;
    auth: Auth;
    grade: Grade;
    code: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    subjects: Subject[];
    parent: string;
};


export const initialStudentData: Students = {
    feedback: {
        counts: {
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 0,
            "5": 0
        },
        total: 0,
        average: 0
    },
    _id: "N/A",
    auth: {
        _id: "N/A",
        fullName: "N/A",
        userName: "N/A",
        email: "N/A",
        userType: "N/A",
        fullAddress: "N/A",
        profile: "N/A",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __v: 0,
        image: "N/A",
        otp: "N/A",
        emailNotification: false,
        notification: false,
        isBlocked: false
    },
    grade: {
        _id: "N/A",
        grade: "N/A",
        students: [],
        teachers: [],
        subjects: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __v: 0
    },
    code: "N/A",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0,
    subjects: [
        {
            _id: "N/A",
            name: "N/A",
            image: "N/A",
            topics: [], // Add specific structure if known
            grade: "N/A",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            __v: 0,
            teachers: []
        }
    ],
    parent: "N/A"
};
