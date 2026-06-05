import '../../../styles/admin/AdminTopbar/AdminTopbar.css';

const AdminTopbar = ({title}) => {
    return (
        <header className="admin-topbar">
            <div className="admin-topbar-title">{title}</div>

            <div className="admin-search-box">
                <i className="ti ti-search"></i>
                <span>Tìm kiếm nhanh...</span>
            </div>

            <div className="admin-status-pill admin-pill-green">
                <span>● Hệ thống ổn định</span>
            </div>

        </header>
    );
};

export default AdminTopbar;
