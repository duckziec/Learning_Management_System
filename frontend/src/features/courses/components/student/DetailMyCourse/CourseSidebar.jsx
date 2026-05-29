import React, { useState } from 'react';
import '../../../styles/student/DetailMyCourse/CourseSidebar.css';

const SidebarItem = ({ item, level = 0, activeLessonId, onLessonClick }) => {
  const [isOpen, setIsOpen] = useState(level === 0 || item.expanded);
  const isFolder = item.type === 'chapter' || item.type === 'section' || (item.items && item.items.length > 0);
  const hasChildren = item.items && item.items.length > 0;

  return (
    <div className={`sidebar-item-wrapper level-${level}`}>
      <div 
        className={`sidebar-item-row ${item.type}-row ${item.id === activeLessonId ? 'active' : ''}`}
        onClick={() => isFolder ? setIsOpen(!isOpen) : onLessonClick(item)}
      >
        <div className="sidebar-item-main">
          {isFolder ? (
            <span className="material-symbols-outlined toggle-icon">
              {isOpen ? 'expand_less' : 'expand_more'}
            </span>
          ) : (
            <input
              type="checkbox"
              checked={item.completed}
              readOnly
              className="sidebar-lesson-checkbox"
              onClick={(e) => e.stopPropagation()}
            />
          )}
          
          <div className="sidebar-item-info">
            <p className={`sidebar-item-title ${item.completed ? 'completed' : ''}`}>
              {item.title}
            </p>
            {item.type === 'lesson' && (
              <div className="sidebar-lesson-meta">
                <span className="material-symbols-outlined">play_circle</span>
                <span>{item.duration}</span>
              </div>
            )}
            {isFolder && item.summary && (
              <p className="sidebar-folder-summary">{item.summary}</p>
            )}
          </div>
        </div>
      </div>

      {isFolder && isOpen && hasChildren && (
        <div className="sidebar-item-children">
          {item.items.map((child) => (
            <SidebarItem 
              key={child.id} 
              item={child} 
              level={level + 1} 
              activeLessonId={activeLessonId}
              onLessonClick={onLessonClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CourseSidebar = ({ sections = [], currentLesson, progress = 0 }) => {
  // Map sections to the new recursive format if needed
  const items = sections.map(s => ({
    ...s,
    type: s.type || (s.lessons ? 'section' : 'chapter'),
    items: s.items || s.lessons || []
  }));

  const [activeLessonId, setActiveLessonId] = useState(() => {
    const findActive = (list) => {
      for (const it of list) {
        if (it.title === currentLesson) return it.id;
        if (it.items) {
          const res = findActive(it.items);
          if (res) return res;
        }
      }
      return null;
    };
    return findActive(items) || items[0]?.items?.[0]?.id || null;
  });

  const handleLessonClick = (lesson) => {
    setActiveLessonId(lesson.id);
    // Add logic to change video/content here if needed
  };

  return (
    <aside className="course-sidebar">
      <div className="course-sidebar__header">
        <h2 className="course-sidebar__title">Course Content</h2>
      </div>

      <div className="course-sidebar__content custom-scrollbar">
        {items.map((item) => (
          <SidebarItem 
            key={item.id} 
            item={item} 
            activeLessonId={activeLessonId}
            onLessonClick={handleLessonClick}
          />
        ))}
      </div>
    </aside>
  );
};

export default CourseSidebar;