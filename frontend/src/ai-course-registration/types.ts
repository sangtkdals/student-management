
export interface Course {
  id: number;
  code: string;
  name: string;
  professor: string;
  credits: number;
  time: string;
  location: string;
  type: 'Major Requirement' | 'Major Elective' | 'General Elective';
  capacity: number;
  enrolled: number;
}

export interface User {
  studentId: string;
  name: string;
  major: string;
  year: number;
  maxCredits: number;
}

export interface AnalysisResult {
  summary: string;
  pros: string[];
  cons: string[];
  rating: number;
  keywords: string[];
}
