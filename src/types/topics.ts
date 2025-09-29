export interface TopicType {
    _id: string;
    name: string;
    image: string;
    subject: string;
    difficulty: string;
    type: string;
    lessons: string[];
    quizes: string[];
    practices: string[];
    createdAt: string; // ISO date string format
    updatedAt: string; // ISO date string format
    __v: number;
};
