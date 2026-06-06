import React from "react"
import CourseCard from "../../../../../components/ui/CourseCard"
import "../../../styles/student/ListCourse/CourseGrid.css";

export default function CourseGrid({ courses }) {
    return (
        <div className="course-grid">
            {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
            ))}
        </div>
    )
}   