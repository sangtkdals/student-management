import { useState, useMemo } from "react";
import { Course } from "../types";

export const useCourses = (allCourses: Course[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");

  const filteredCourses = useMemo(() => {
    return allCourses.filter((course) => {
      const subject = course.subject;
      const matchesType = filterType === "All" || (subject && subject.subjectType === filterType);
      const matchesSearch =
        searchTerm === "" ||
        (course.subjectName && course.subjectName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (course.professorName && course.professorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        course.courseCode.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [allCourses, searchTerm, filterType]);

  return {
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filteredCourses,
  };
};
