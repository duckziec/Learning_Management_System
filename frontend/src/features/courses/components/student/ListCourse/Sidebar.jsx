import { useState } from 'react';
import "../../../styles/student/ListCourse/Sidebar.css";

const CATEGORY_ICONS = {
    "Development": "code",
    "Design": "brush",
    "Business": "business_center",
    "Marketing": "campaign",
    "Data Science": "analytics"
};

export default function Sidebar({ onFiltersChange, onCategoryChange, categories = [], courses = [] }) {
    const [filters, setFilters] = useState({
        level: []
    });
    const [activeCategory, setActiveCategory] = useState("Tất cả danh mục");
    const [categorySearchTerm, setCategorySearchTerm] = useState("");

    const levels = [
        { value: "BEGINNER", label: "Cơ bản" },
        { value: "INTERMEDIATE", label: "Trung cấp" },
        { value: "ADVANCED", label: "Nâng cao" },
    ];

    // Tạo danh sách danh mục để hiển thị
    const displayCategories = [
        {
            id: 0,
            name: "Tất cả danh mục",
            icon: "grid_view",
            description: "Xem tất cả khóa học",
            courseCount: courses.length
        },
        ...categories.map(cat => ({
            id: cat.id,
            name: cat.name,
            icon: CATEGORY_ICONS[cat.name] || "folder",
            description: `Khóa học ${cat.name}`,
            courseCount: courses.filter(c => c.category === cat.name).length
        }))
    ];

    // Lọc danh mục dựa trên từ khóa tìm kiếm
    const filteredCategories = displayCategories.filter(cat => 
        cat.name.toLowerCase().includes(categorySearchTerm.toLowerCase())
    );

    // Handle level checkbox changes
    const handleLevelChange = (levelValue, checked) => {
        const currentLevels = filters.level || [];
        const newLevels = checked 
            ? [...currentLevels, levelValue]
            : currentLevels.filter(l => l !== levelValue);
            
        const newFilters = { ...filters, level: newLevels };
        setFilters(newFilters);
        onFiltersChange(newFilters);
    };

    // Handle category selection
    const handleCategorySelect = (category) => {
        setActiveCategory(category.name);
        onCategoryChange?.(category);
    };

    // Clear all filters
    const clearAllFilters = () => {
        const defaultFilters = {
            level: []
        };
        setFilters(defaultFilters);
        setActiveCategory("Tất cả danh mục");
        onFiltersChange(defaultFilters);
        onCategoryChange?.(displayCategories[0]);
    };

    const hasActiveFilters = (filters.level && filters.level.length > 0) || activeCategory !== "Tất cả danh mục";

    return (
        <aside className="sidebar">
            <div className="sidebar__header">
                <h3 className="sidebar__title">
                    <span className="material-symbols-outlined">filter_list</span>
                    Bộ lọc
                </h3>
                {hasActiveFilters && (
                    <button
                        className="sidebar__clear-btn"
                        onClick={clearAllFilters}
                        title="Xóa tất cả bộ lọc"
                    >
                        <span className="material-symbols-outlined">clear</span>
                        Xóa tất cả
                    </button>
                )}
            </div>

            {/* Category Filter */}
            <div className="filter-group category-group">
                <h4 className="filter-group__title">
                    <span className="material-symbols-outlined">category</span>
                    Danh mục
                </h4>

                {/* Search Input cho Category */}
                {displayCategories.length > 5 && (
                    <div className="sidebar__category-search" style={{ marginBottom: '12px', position: 'relative' }}>
                        <span className="material-symbols-outlined" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', color: '#6b7280' }}>search</span>
                        <input 
                            type="text" 
                            placeholder="Tìm danh mục..." 
                            value={categorySearchTerm}
                            onChange={(e) => setCategorySearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '8px 10px 8px 34px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s' }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--primary-color, #1a73e8)'}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />
                    </div>
                )}

                <div className="category-choices" style={{ maxHeight: '280px', overflowY: 'auto', paddingRight: '4px' }}>
                    {filteredCategories.length > 0 ? filteredCategories.map((category) => (
                        <button
                            key={category.id}
                            className={`category-choice ${activeCategory === category.name ? 'category-choice--active' : ''}`}
                            onClick={() => handleCategorySelect(category)}
                            title={category.description}
                        >
                            <span className="material-symbols-outlined category-choice__icon">
                                {category.icon}
                            </span>
                            <span className="category-choice__text">
                                {category.name}
                            </span>
                            <span className="category-choice__count">{category.courseCount}</span>
                        </button>
                    )) : (
                        <p style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center', margin: '10px 0' }}>Không tìm thấy danh mục "{categorySearchTerm}"</p>
                    )}
                </div>
            </div>

            {/* Level Filter */}
            <div className="filter-group">
                <h4 className="filter-group__title">
                    <span className="material-symbols-outlined">school</span>
                    Trình độ
                </h4>
                <div className="filter-options">
                    {levels.map((level) => (
                        <label key={level.value} className="filter-option">
                            <input
                                className="filter-option__checkbox"
                                type="checkbox"
                                checked={filters.level?.includes(level.value) || false}
                                onChange={(e) => handleLevelChange(level.value, e.target.checked)}
                            />
                            <div className={`level ${filters.level?.includes(level.value) ? 'level--active' : ''}`} style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '4px 0'}}>
                                <span className="level__label" style={{fontSize: '14px', color: '#4b5563'}}>{level.label}</span>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* Active Filters Summary */}
            {hasActiveFilters && (
                <div className="sidebar__summary">
                    <h4 className="sidebar__summary-title">Đang lọc theo:</h4>
                    <div className="sidebar__summary-tags">
                        {filters.level && filters.level.map(level => (
                            <span key={level} className="filter-tag">
                                {level}
                                <button
                                    className="filter-tag__remove"
                                    onClick={() => handleLevelChange(level, false)}
                                    title="Xóa bộ lọc trình độ"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </span>
                        ))}
                        {activeCategory !== "Tất cả danh mục" && (
                            <span className="filter-tag">
                                {activeCategory}
                                <button
                                    className="filter-tag__remove"
                                    onClick={() => handleCategorySelect(displayCategories[0])}
                                    title="Xóa bộ lọc danh mục"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </span>
                        )}
                    </div>
                </div>
            )}
        </aside>
    );
}