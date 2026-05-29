import { useState, useRef, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { courseApi } from "../../../../../services/course.api";
import { identityApi } from "../../../../../services/identity.api";
import { buildAppErrorState, getAppErrorRoute } from "../../../../../utils/appError";
import { COURSE_DISPLAY_SORT, sortCoursesByDisplayOrder } from "../../../../../utils/courseOrder";
import Search from "../../../../courses/components/student/ListCourse/Search.jsx";
import Sidebar from "../../../../courses/components/student/ListCourse/Sidebar.jsx";
import CourseResultsHeader from "../../../../courses/components/student/ListCourse/CourseResultHeader.jsx";
import CourseGrid from "../../../../courses/components/student/ListCourse/CourseGrid.jsx";
import Pagination from "../../../../courses/components/student/ListCourse/Pagination.jsx";
import NoResults from "../../../../courses/components/student/ListCourse/NoResult.jsx";
import SkeletonCourseCard from "../../../../courses/components/student/ListCourse/SkeletonCourseCard.jsx";
import "../../../styles/student/ListCourse/ListCourseContent.css";

const LEVEL_MAP = {
    BEGINNER: 'Cơ bản',
    INTERMEDIATE: 'Trung cấp',
    ADVANCED: 'Nâng cao',
};

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop";
const COURSES_PER_PAGE = 6;

export default function ListCourseContent() {
    const location = useLocation();
    const [sidebarCourses, setSidebarCourses] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [displayedCourses, setDisplayedCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [blockingError, setBlockingError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Tất cả danh mục");
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [selectedLevels, setSelectedLevels] = useState([]);

    const courseSectionRef = useRef(null);

    useEffect(() => {
        const init = async () => {
            try {
                const [categoriesRes, coursesRes] = await Promise.all([
                    courseApi.getCategories(),
                    courseApi.getAll({ status: 'PUBLIC', size: 1000, sort: COURSE_DISPLAY_SORT }),
                ]);

                setAllCategories(categoriesRes || []);
                const list = sortCoursesByDisplayOrder(coursesRes.data.data.content || []);
                setSidebarCourses(list.map((course) => ({
                    category: course.categories?.[0]?.name || 'Khác',
                })));
                setBlockingError(null);
            } catch (err) {
                console.error('Init failed:', err);
                setBlockingError(buildAppErrorState(err, {
                    title: 'Không thể tải danh sách khóa học',
                    fallbackPath: '/list-course',
                }));
            }
        };

        init();
    }, []);

    useEffect(() => {
        const fetchCourses = async () => {
            setIsLoading(true);
            setBlockingError(null);
            try {
                const params = {
                    status: 'PUBLIC',
                    page: currentPage - 1,
                    size: COURSES_PER_PAGE,
                    sort: COURSE_DISPLAY_SORT,
                };
                if (searchQuery) params.keyword = searchQuery;
                if (selectedCategoryId) params.categoryId = selectedCategoryId;
                if (selectedLevels.length > 0) params.level = selectedLevels;

                const res = await courseApi.getAll(params);
                const pageData = res.data.data;
                const courseList = sortCoursesByDisplayOrder(pageData.content || []);

                setTotalPages(pageData.totalPages || 0);
                setTotalElements(pageData.totalElements || 0);

                const uniqueInstructorIds = [...new Set(courseList.map((course) => course.instructorId).filter(Boolean))];
                console.log('[ListCourse] instructorIds to fetch:', uniqueInstructorIds);
                const [instructorProfiles, lessonsCounts] = await Promise.all([
                    Promise.all(uniqueInstructorIds.map((id) => identityApi.getPublicProfile(id).catch((err) => {
                        console.warn('[ListCourse] getPublicProfile failed for', id, err?.response?.status);
                        return null;
                    }))),
                    Promise.all(courseList.map((course) => courseApi.getLessonsCount(course.id).catch(() => 0))),
                ]);

                const instructorMap = {};
                uniqueInstructorIds.forEach((id, index) => {
                    instructorMap[id] = instructorProfiles[index]?.fullname || "Giảng viên";
                });

                setDisplayedCourses(courseList.map((course, index) => ({
                    id: course.id,
                    title: course.title,
                    description: course.description || "Chưa có mô tả",
                    instructor: instructorMap[course.instructorId] || "Giảng viên",
                    image: course.thumbnailUrl || FALLBACK_IMAGE,
                    duration: course.duration != null ? `${course.duration} tháng` : null,
                    lessons: lessonsCounts[index] || 0,
                    exercises: course.exerciseCount ?? 0,
                    level: LEVEL_MAP[course.level] || course.level || 'Cơ bản',
                    category: course.categories?.[0]?.name || 'Khác',
                })));
            } catch (err) {
                console.error("Failed to fetch courses:", err);
                setBlockingError(buildAppErrorState(err, {
                    title: 'Không thể tải danh sách khóa học',
                    fallbackPath: '/list-course',
                }));
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, [currentPage, searchQuery, selectedCategoryId, selectedLevels.join(',')]);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category.name);
        setSelectedCategoryId(category.id === 0 ? null : category.id);
        setCurrentPage(1);
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const handleSidebarFilters = (filters) => {
        setSelectedLevels(filters.level || []);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        courseSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleSortChange = () => {};

    if (blockingError) {
        return <Navigate to={getAppErrorRoute(location.pathname)} replace state={blockingError} />;
    }

    return (
        <div className="list-course-content-wrapper">
            <Search onSearch={handleSearch} />

            <div className="list-course-content">
                <aside className="list-course-sidebar">
                    <Sidebar
                        onFiltersChange={handleSidebarFilters}
                        onCategoryChange={handleCategoryChange}
                        categories={allCategories}
                        courses={sidebarCourses}
                    />
                </aside>

                <main className="list-course-main" ref={courseSectionRef}>
                    <CourseResultsHeader
                        selectedCategory={selectedCategory}
                        resultsCount={totalElements}
                        onSortChange={handleSortChange}
                    />

                    {isLoading ? (
                        <div className="course-grid">
                            {Array.from({ length: COURSES_PER_PAGE }).map((_, index) => (
                                <SkeletonCourseCard key={index} />
                            ))}
                        </div>
                    ) : (
                        <>
                            <CourseGrid courses={displayedCourses} />

                            {totalPages > 1 && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            )}

                            {totalElements === 0 && <NoResults />}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
