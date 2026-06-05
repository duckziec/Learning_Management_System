import {useEffect, useRef, useState} from 'react';
import {Navigate} from 'react-router-dom';
import {courseApi} from '../../../../../services/course.api';
import {buildAppErrorState} from '../../../../../utils/appError';
import {getCourseRouteSlug} from '../../../../../utils/courseSlug';
import AnimatedPage from '../../../../../components/ui/AnimatedPage';
import ExerciseHero from '../../components/student/ExerciseHub/ExerciseHero';
import TopicCard from '../../components/student/ExerciseHub/TopicCard';
import SectionHeader from '../../components/student/ExerciseHub/SectionHeader';
import Pagination from '../../../../courses/components/student/ListCourse/Pagination';

import '../../../shared/styles/ExerciseShared.css';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80';
const COURSES_PER_PAGE = 6;

function courseToTopicCard(course) {
    return {
        id: course.id,
        slug: getCourseRouteSlug(course),
        title: course.title,
        description: course.description || '',
        image: course.thumbnailUrl || DEFAULT_IMAGE,
        level: 'Đã đăng ký',
        icon: 'code',
        count: 0,
    };
}

export default function ExerciseHubPage() {
    const [topics, setTopics] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const sectionRef = useRef(null);
    const handleScrollToTopics = () => {
        sectionRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'});
    };

    useEffect(() => {
        let cancelled = false;
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const courses = await courseApi.getEnrolled();
                if (cancelled) return;
                const mapped = (Array.isArray(courses) ? courses : []).map(courseToTopicCard);
                setTopics(mapped);
                setCurrentPage(1);
            } catch (err) {
                if (!cancelled) {
                    setError(buildAppErrorState(err, {
                        title: 'Không thể tải chủ đề luyện tập',
                        fallbackPath: '/dashboard',
                    }));
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        fetchCourses();
        return () => {
            cancelled = true;
        };
    }, []);

    const totalPages = Math.ceil(topics.length / COURSES_PER_PAGE);
    const startIndex = (currentPage - 1) * COURSES_PER_PAGE;
    const currentTopics = topics.slice(startIndex, startIndex + COURSES_PER_PAGE);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        sectionRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'});
    };

    if (loading) {
        return (
            <AnimatedPage>
                <div className="exercise-page"
                     style={{display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh'}}>
                    <p style={{color: '#64748b'}}>Đang tải danh sách khoá học...</p>
                </div>
            </AnimatedPage>
        );
    }

    if (error) {
        return <Navigate to="/error" replace state={error}/>;
    }

    return (
        <AnimatedPage>
            <div className="exercise-page">
                <ExerciseHero onButtonClick={handleScrollToTopics}/>

                <div ref={sectionRef}>
                    <SectionHeader
                        icon="code_blocks"
                        title="Chủ đề luyện tập"
                    />
                </div>

                {topics.length > 0 ? (
                    <>
                        <div className="topic-grid">
                            {currentTopics.map(topic => (
                                <TopicCard key={topic.id} topic={topic}/>
                            ))}
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                ) : (
                    <div style={{textAlign: 'center', padding: '64px', color: '#64748b'}}>
                        <p>Bạn chưa đăng ký khoá học nào. Hãy tham gia khoá học để bắt đầu luyện tập.</p>
                    </div>
                )}
            </div>
        </AnimatedPage>
    );
}
