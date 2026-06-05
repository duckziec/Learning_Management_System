import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import dashboardApi from '../../../../../services/dashboard.api';
import { useToast } from '../../../../../components/ui/Toast';
import { buildAppErrorState, getAppErrorRoute } from '../../../../../utils/appError';
import { formatDateVN } from '../../../../../utils/dateTime';

const UserManagement = () => {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;
  const location = useLocation();

  const fetchUsers = async (pageIndex = page, selectedRole = role, keyword = search) => {
    setLoading(true);
    setError('');
    try {
      const data = await dashboardApi.getUsers({
        page: pageIndex,
        size: pageSize,
        role: selectedRole || undefined,
        keyword: keyword.trim() || undefined,
      });
      setUsers(data?.content || []);
      setTotalElements(Number(data?.totalElements || 0));
      setTotalPages(Number(data?.totalPages || 0));
      setPage(Number(data?.number || pageIndex));
    } catch (err) {
      setError(buildAppErrorState(err, {
        title: 'Không thể tải danh sách người dùng',
        fallbackPath: '/admin/home',
      }));
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(0, role, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilter = () => {
    fetchUsers(0, role, search);
  };

  const handleToggleActive = async (userId) => {
    try {
      const updatedUser = await dashboardApi.toggleUserActive(userId);
      setUsers((prev) =>
        prev.map((item) => (item.userId === userId ? { ...item, ...updatedUser } : item)),
      );
    } catch (err) {
      console.error('Failed to toggle user status:', err);
      toast.error('Không thể cập nhật trạng thái người dùng. Vui lòng thử lại.');
    }
  };

  const rolePillClass = (userRole) => {
    if (userRole === 'ADMIN') return 'admin-pill-yellow';
    if (userRole === 'INSTRUCTOR') return '';
    return 'admin-pill-blue';
  };

  const formatDate = (value) => {
    if (!value) return '—';
    return formatDateVN(value) || '—';
  };

  const getInitials = (name) => {
    if (!name) return 'NA';
    return name
      .trim()
      .split(/\s+/)
      .slice(-2)
      .map((part) => part[0]?.toUpperCase() || '')
      .join('');
  };

  return (
    error ? <Navigate to={getAppErrorRoute(location.pathname)} replace state={error} /> :
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="admin-inline-flex" style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center' }}>
        <button className="admin-btn" onClick={handleFilter}><i className="ti ti-refresh"></i> Làm mới</button>
        <select
          className="admin-field"
          style={{
            width: '170px',
            background: 'var(--admin-card-hover)',
            border: '1px solid var(--admin-border)',
            borderRadius: '8px',
            padding: '8px 12px',
            color: 'var(--admin-text)',
          }}
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Tất cả vai trò</option>
          <option value="STUDENT">STUDENT</option>
          <option value="INSTRUCTOR">INSTRUCTOR</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <div style={{ marginLeft: 'auto' }}>
          <div className="admin-search-box" style={{ width: '250px' }}>
            <i className="ti ti-search"></i>
            <input 
              style={{ background: 'none', border: 'none', color: 'inherit', outline: 'none', width: '100%' }} 
              placeholder="Tìm tên, username, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleFilter();
              }}
            />
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-hd">
          <i className="ti ti-users"></i> 
          Danh sách người dùng ({totalElements.toLocaleString()})
        </div>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Người dùng</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>OAuth</th>
                <th>Ngày tham gia</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} style={{ color: 'var(--admin-muted)' }}>Đang tải dữ liệu...</td>
                </tr>
              )}
              {!loading && !error && users.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ color: 'var(--admin-muted)' }}>Không có người dùng phù hợp.</td>
                </tr>
              )}
              {!loading && !error && users.map((user) => (
                <tr key={user.userId}>
                  <td>
                    <span className="admin-avatar">{getInitials(user.fullname || user.username)}</span>
                    {user.fullname || user.username || 'N/A'}
                  </td>
                  <td style={{ color: 'var(--admin-muted)' }}>{user.email || '—'}</td>
                  <td>
                    <span
                      className={`admin-status-pill ${rolePillClass(user.role)}`}
                      style={user.role === 'INSTRUCTOR'
                        ? { background: 'rgba(188, 140, 255, 0.1)', color: 'var(--admin-purple)', border: '1px solid rgba(188, 140, 255, 0.2)' }
                        : undefined}
                    >
                      {user.role || '—'}
                    </span>
                  </td>
                  <td>{user.authProvider || 'LOCAL'}</td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>
                    <span className={`admin-status-pill ${user.active ? 'admin-pill-green' : 'admin-pill-red'}`}>
                      {user.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`admin-btn ${user.active ? 'admin-btn-danger' : 'admin-btn-primary'}`}
                      style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                      onClick={() => handleToggleActive(user.userId)}
                    >
                      <i className={`ti ${user.active ? 'ti-lock' : 'ti-lock-open'}`}></i>
                      {user.active ? 'Khóa' : 'Kích hoạt'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-inline-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: 'var(--admin-muted)', fontSize: '0.85rem' }}>
          Trang {Math.min(page + 1, Math.max(totalPages, 1))}/{Math.max(totalPages, 1)}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="admin-btn"
            disabled={page <= 0 || loading}
            onClick={() => fetchUsers(Math.max(page - 1, 0), role, search)}
          >
            <i className="ti ti-chevron-left"></i> Trước
          </button>
          <button
            className="admin-btn"
            disabled={loading || totalPages === 0 || page >= totalPages - 1}
            onClick={() => fetchUsers(page + 1, role, search)}
          >
            Sau <i className="ti ti-chevron-right"></i>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default UserManagement;
