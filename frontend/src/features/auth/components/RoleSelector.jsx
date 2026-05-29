import React from 'react';
import '../styles/RoleSelectionModal.css';

function RoleSelector({ selectedRole, onSelect }) {
    const roles = [
        {
            id: 'student',
            label: 'Học viên',
            icon: 'school',
            description: 'Tôi muốn học tập và tham gia các khóa học.'
        },
        {
            id: 'instructor',
            label: 'Giảng viên',
            icon: 'cast_for_education',
            description: 'Tôi muốn dạy và tạo các khóa học.'
        }
    ];

    return (
        <div className="role-cards-grid">
            {roles.map((role) => (
                <div
                    key={role.id}
                    className={`role-card ${selectedRole?.toLowerCase() === role.id ? 'active' : ''}`}
                    onClick={() => onSelect(role.id)}
                >
                    <div className="role-icon">
                        <span className="material-symbols-outlined">{role.icon}</span>
                    </div>
                    <h3>{role.label}</h3>
                    <p>{role.description}</p>
                    <div className="active-indicator">
                        <span className="material-symbols-outlined">check</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default RoleSelector;
