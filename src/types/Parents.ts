export type SupervisorType = {
    _id: string;
    auth: {
        _id: string;
        fullName: string;
        userName: string;
        email: string;
        userType: "Supervisor" | string;
        fullAddress: string;
        profile: string;
        createdAt: string;
        updatedAt: string;
        __v: number;
        otp: string | null;
        image: string;
        emailNotification: boolean;
        notification: boolean;
        isBlocked: boolean;
    };
    employeeIds: {
        feedback?: {
            counts: {
                [key: string]: number;
            };
            total: number;
            average: number;
        };
        _id: string;
        auth: string;
        grade: string;
        code: string;
        createdAt: string;
        updatedAt: string;
        __v: number;
        subjects: string[];
        parent: string;
    }[];
    code: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
};

export const initialSupervisorData: SupervisorType = {
    _id: "N/A",
    auth: {
        _id: "N/A",
        fullName: "N/A",
        userName: "N/A",
        email: "N/A",
        userType: "Parent",
        fullAddress: "N/A",
        profile: "N/A",
        createdAt: "N/A",
        updatedAt: "N/A",
        __v: 0,
        otp: null,
        image: "N/A",
        emailNotification: false,
        notification: false,
        isBlocked: false
    },
    childIds: [
        {
            feedback: {
                counts: {},
                total: 0,
                average: 0
            },
            _id: "N/A",
            auth: "N/A",
            grade: "N/A",
            code: "N/A",
            createdAt: "N/A",
            updatedAt: "N/A",
            __v: 0,
            subjects: [],
            parent: "N/A"
        }
    ],
    code: "N/A",
    createdAt: "N/A",
    updatedAt: "N/A",
    __v: 0
};
