// components/Logo.jsx
// ==================================
// Logo của EduLearn (icon + tên)
// ==================================

function Logo() {
    return (
        <div className="logo-wrap">
            {/* Dùng Google Material Symbols (load trong index.html) */}
            <span className="material-symbols-outlined logo-icon">
                auto_stories
            </span>
            <span className="logo-name">EduLearn</span>
        </div>
    );
}

export default Logo;
