// Dummy data for the E-Learning Dashboard

export const dummyUser = {
  userId: "user_001",
  name: "John Doe",
  email: "john.doe@example.com",
  role: "student",
  createdAt: "2024-01-15T10:30:00Z",
  avatar: "https://via.placeholder.com/150/4F46E5/FFFFFF?text=JD"
};

export const dummySubjects = [
  {
    subjectId: "sub_001",
    name: "Computer Science",
    description: "Programming, algorithms, and software engineering",
    color: "#3B82F6",
    totalPdfs: 12,
    completedPdfs: 8,
    totalPages: 1245,
    readPages: 892
  },
  {
    subjectId: "sub_002",
    name: "Mathematics",
    description: "Calculus, algebra, and discrete mathematics",
    color: "#10B981",
    totalPdfs: 8,
    completedPdfs: 5,
    totalPages: 876,
    readPages: 542
  },
  {
    subjectId: "sub_003",
    name: "Data Science",
    description: "Statistics, machine learning, and data analysis",
    color: "#F59E0B",
    totalPdfs: 15,
    completedPdfs: 6,
    totalPages: 1876,
    readPages: 743
  },
  {
    subjectId: "sub_004",
    name: "Web Development",
    description: "Frontend, backend, and full-stack development",
    color: "#EF4444",
    totalPdfs: 10,
    completedPdfs: 7,
    totalPages: 987,
    readPages: 765
  }
];

export const dummyPdfs = [
  {
    pdfId: "pdf_001",
    subjectId: "sub_001",
    filename: "Introduction to Algorithms.pdf",
    filePath: "/pdfs/intro-algorithms.pdf",
    totalPages: 156,
    fileSize: 4500000,
    uploadedAt: "2024-01-20T14:30:00Z",
    thumbnail: "https://via.placeholder.com/200x280/3B82F6/FFFFFF?text=ALGO"
  },
  {
    pdfId: "pdf_002",
    subjectId: "sub_001",
    filename: "Data Structures Handbook.pdf",
    filePath: "/pdfs/data-structures.pdf",
    totalPages: 234,
    fileSize: 6700000,
    uploadedAt: "2024-01-22T09:15:00Z",
    thumbnail: "https://via.placeholder.com/200x280/3B82F6/FFFFFF?text=DS"
  },
  {
    pdfId: "pdf_003",
    subjectId: "sub_002",
    filename: "Calculus Complete Guide.pdf",
    filePath: "/pdfs/calculus-guide.pdf",
    totalPages: 298,
    fileSize: 8900000,
    uploadedAt: "2024-01-25T11:45:00Z",
    thumbnail: "https://via.placeholder.com/200x280/10B981/FFFFFF?text=CALC"
  },
  {
    pdfId: "pdf_004",
    subjectId: "sub_003",
    filename: "Machine Learning Fundamentals.pdf",
    filePath: "/pdfs/ml-fundamentals.pdf",
    totalPages: 345,
    fileSize: 12300000,
    uploadedAt: "2024-01-28T16:20:00Z",
    thumbnail: "https://via.placeholder.com/200x280/F59E0B/FFFFFF?text=ML"
  },
  {
    pdfId: "pdf_005",
    subjectId: "sub_004",
    filename: "React.js Complete Tutorial.pdf",
    filePath: "/pdfs/react-tutorial.pdf",
    totalPages: 189,
    fileSize: 5600000,
    uploadedAt: "2024-02-01T13:10:00Z",
    thumbnail: "https://via.placeholder.com/200x280/EF4444/FFFFFF?text=REACT"
  }
];

export const dummyProgress = [
  {
    progressId: "prog_001",
    userId: "user_001",
    pdfId: "pdf_001",
    pagesRead: 120,
    totalTimeSpent: 7200, // seconds
    lastPageRead: 120,
    completionPercentage: 77,
    lastAccessed: "2024-02-05T18:30:00Z"
  },
  {
    progressId: "prog_002",
    userId: "user_001",
    pdfId: "pdf_002",
    pagesRead: 156,
    totalTimeSpent: 9600,
    lastPageRead: 156,
    completionPercentage: 67,
    lastAccessed: "2024-02-04T20:15:00Z"
  },
  {
    progressId: "prog_003",
    userId: "user_001",
    pdfId: "pdf_003",
    pagesRead: 89,
    totalTimeSpent: 5400,
    lastPageRead: 89,
    completionPercentage: 30,
    lastAccessed: "2024-02-03T14:45:00Z"
  },
  {
    progressId: "prog_004",
    userId: "user_001",
    pdfId: "pdf_004",
    pagesRead: 67,
    totalTimeSpent: 4800,
    lastPageRead: 67,
    completionPercentage: 19,
    lastAccessed: "2024-02-02T16:20:00Z"
  },
  {
    progressId: "prog_005",
    userId: "user_001",
    pdfId: "pdf_005",
    pagesRead: 145,
    totalTimeSpent: 8700,
    lastPageRead: 145,
    completionPercentage: 77,
    lastAccessed: "2024-02-05T21:00:00Z"
  }
];

export const dummyQuestions = [
  {
    questionId: "q_001",
    userId: "user_001",
    pdfId: "pdf_001",
    questionText: "What is the time complexity of quicksort algorithm?",
    answerText: "The average time complexity of quicksort is O(n log n), but in the worst case (when the pivot is always the smallest or largest element), it can be O(n²). However, with good pivot selection strategies like random pivot or median-of-three, the worst case is rare in practice.",
    pageContext: 45,
    confidenceScore: 0.92,
    timestamp: "2024-02-05T15:30:00Z"
  },
  {
    questionId: "q_002",
    userId: "user_001",
    pdfId: "pdf_002",
    questionText: "Explain the difference between a stack and a queue.",
    answerText: "A stack is a Last-In-First-Out (LIFO) data structure where elements are added and removed from the same end (top). A queue is a First-In-First-Out (FIFO) data structure where elements are added at one end (rear) and removed from the other end (front). Stacks are useful for function calls and expression evaluation, while queues are used for scheduling and breadth-first search.",
    pageContext: 23,
    confidenceScore: 0.95,
    timestamp: "2024-02-04T14:20:00Z"
  },
  {
    questionId: "q_003",
    userId: "user_001",
    pdfId: "pdf_003",
    questionText: "How do you find the derivative of x²?",
    answerText: "The derivative of x² with respect to x is 2x. This follows from the power rule: if f(x) = x^n, then f'(x) = nx^(n-1). So for x², we get 2x^(2-1) = 2x^1 = 2x.",
    pageContext: 67,
    confidenceScore: 0.98,
    timestamp: "2024-02-03T11:45:00Z"
  }
];

export const dummyChartData = {
  weeklyProgress: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Pages Read',
        data: [12, 19, 8, 15, 22, 18, 25],
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        fill: true
      }
    ]
  },
  subjectProgress: {
    labels: ['Computer Science', 'Mathematics', 'Data Science', 'Web Development'],
    datasets: [
      {
        data: [77, 62, 40, 85],
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
        borderWidth: 0
      }
    ]
  },
  readingTime: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Hours Studied',
        data: [15, 22, 18, 28],
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
        fill: true
      }
    ]
  }
};

export const dummyRecentActivity = [
  {
    id: 1,
    type: 'reading',
    title: 'Continued reading React.js Complete Tutorial',
    subtitle: 'Web Development • Page 145 of 189',
    time: '2 hours ago',
    icon: 'BookOpen'
  },
  {
    id: 2,
    type: 'question',
    title: 'Asked question about quicksort complexity',
    subtitle: 'Introduction to Algorithms • Page 45',
    time: '4 hours ago',
    icon: 'MessageCircle'
  },
  {
    id: 3,
    type: 'completion',
    title: 'Completed Data Structures Handbook',
    subtitle: 'Computer Science • 234 pages',
    time: '1 day ago',
    icon: 'CheckCircle'
  },
  {
    id: 4,
    type: 'upload',
    title: 'Uploaded new PDF: Machine Learning Fundamentals',
    subtitle: 'Data Science • 345 pages',
    time: '2 days ago',
    icon: 'Upload'
  }
];