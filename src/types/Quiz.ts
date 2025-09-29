export type QuizType = {
  type: string;
  _id: string;
  lesson: {
    name: string;
  },
  createdBy: {
    feedback: {
      counts: {
        [key: string]: number;
      };
      total: number;
      average: number;
    };
    _id: string;
    auth: string;
    subjects: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    grade: string[];
    students: string[];
  };
  questions: {
    _id: string;
    quiz: string;
    question: string;
    options: string[];
    answer: string;
    time: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
    score: number;
  }[];
  grade: {
    _id: string;
    grade: string;
    students: string[];
    teachers: string[];
    subjects: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  topic: {
    _id: string;
    name: string;
    image: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  subject: {
    _id: string;
    name: string;
    description: string;
    image: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    teachers: string[];
    topics: string[];
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export const initialQuizData: QuizType = {
  type: "N/A",
  _id: "N/A",
  lesson: {
    name: "N/A",
  },
  createdBy: {
    feedback: {
      counts: {},
      total: 0,
      average: 0,
    },
    _id: "N/A",
    auth: "N/A",
    subjects: [],
    createdAt: "N/A",
    updatedAt: "N/A",
    __v: 0,
    grade: [],
    students: [],
  },
  questions: [
    {
      _id: "N/A",
      quiz: "N/A",
      question: "N/A",
      options: [],
      answer: "N/A",
      time: 0,
      createdAt: "N/A",
      updatedAt: "N/A",
      __v: 0,
      score: 0,
    },
  ],
  grade: {
    _id: "N/A",
    grade: "N/A",
    students: [],
    teachers: [],
    subjects: [],
    createdAt: "N/A",
    updatedAt: "N/A",
    __v: 0,
  },
  topic: {
    _id: "N/A",
    name: "N/A",
    image: "N/A",
    createdAt: "N/A",
    updatedAt: "N/A",
    __v: 0,
  },
  subject: {
    _id: "N/A",
    name: "N/A",
    description: "N/A",
    image: "N/A",
    createdAt: "N/A",
    updatedAt: "N/A",
    __v: 0,
    teachers: [],
    topics: [],
  },
  createdAt: "N/A",
  updatedAt: "N/A",
  __v: 0,
};
