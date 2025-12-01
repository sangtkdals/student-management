import type { Course as AppCourse } from "../types";

// Re-exporting Course with adjusted properties for local component usage if needed
// For now, we can just re-export it. Or create a new specific type.
// Let's make it compatible.
export type Course = AppCourse & {
  id: number | string;
  code: string;
  name: string;
  professor: string;
  credit: number;
  time: string;
  location: string;
  type: string;
  capacity: number;
  enrolled: number;
};

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
