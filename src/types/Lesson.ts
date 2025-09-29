export type LessonType = {
  readby: string[];          // Array of user IDs or names who have read the lesson
  _id: string;               // Unique identifier for the lesson
  name: string;              // Name of the lesson
  image: string;             // Filename or path for the lesson image
  content: string;           // URL or link to the lesson content
  words: number;             // Word count of the lesson content
  lang: string;              // Language of the lesson (e.g., "Eng" for English)
  pages: number;             // Page count of the lesson content
  topic: string;             // ID of the associated topic
  createdAt: string;         // Creation timestamp (ISO string)
  updatedAt: string;         // Last update timestamp (ISO string)
  __v: number;               // Version key for MongoDB (usually incremented with updates)
};

export const intialLessonData = {
  "readby": [],
  "_id": "N/A",
  "name": "N/A",
  "image": "N/A",
  "content": "N/A",
  "words": 0,
  "lang": "N/A",
  "pages": 0,
  "topic": "N/A",
  "createdAt": "1970-01-01T00:00:00.000Z",
  "updatedAt": "1970-01-01T00:00:00.000Z",
  "__v": 0
};