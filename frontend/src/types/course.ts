export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  duration: number; // in hours
  level: 'beginner' | 'intermediate' | 'advanced';
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  content: string;
  videoUrl?: string;
  duration: number;
  order: number;
}

export interface UserCourse {
  id: string;
  userId: string;
  courseId: string;
  course: Course;
  enrolledAt: string;
  completedAt?: string;
  progress: number; // percentage
}
