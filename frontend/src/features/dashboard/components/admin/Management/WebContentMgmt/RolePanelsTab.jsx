import React, { useState } from 'react';
import '../../../../styles/admin/WebContentMgmt/RolePanelsTab.css';

const DEFAULT_ROLES = {
  student: {
    icon: 'school',
    eyebrow: 'Student',
    title: 'Dành cho học viên',
    items: [
      'Tìm kiếm và lọc khóa học theo danh mục, cấp độ, từ khóa.',
      'Xem mô tả, giảng viên, số bài học, bài tập và cấu trúc khóa học.',
      'Quản lý khóa học đã đăng ký và tiếp tục học trên dashboard.',
      'Làm quiz, coding challenge và xem kết quả luyện tập.',
      'Viết blog, bình luận và trao đổi kiến thức với cộng đồng.',
    ],
  },
  instructor: {
    icon: 'co_present',
    eyebrow: 'Instructor',
    title: 'Dành cho giảng viên',
    items: [
      'Tạo và cập nhật khóa học, thumbnail, level, danh mục.',
      'Xây dựng chương, bài học, học liệu và cấu trúc nội dung.',
      'Quản lý học viên, số lượng đăng ký và tình trạng tham gia.',
      'Tạo quiz, câu hỏi, bài coding, starter code và test case.',
      'Theo dõi submission, kết quả quiz/code và hoạt động học viên.',
    ],
  },
};

const DEFAULT_ABOUT_ROLES = {
  student: {
    icon: 'school',
    title: 'Học viên',
    items: [
      'Xem khóa học public mà không cần đăng nhập.',
      'Đăng nhập để đăng ký khóa học và lưu tiến độ.',
      'Học theo chương mục, bài học và tài liệu.',
      'Làm quiz, coding challenge và xem kết quả.',
      'Theo dõi khóa học đã đăng ký trên dashboard cá nhân.',
      'Tham gia blog để đọc, viết và trao đổi kiến thức.',
    ],
  },
  instructor: {
    icon: 'co_present',
    title: 'Giảng viên',
    items: [
      'Quản lý khóa học do mình phụ trách.',
      'Tạo cấu trúc chương, bài học và nội dung học liệu.',
      'Quản lý học viên trong khóa học.',
      'Tạo quiz, câu hỏi và bài kiểm tra.',
      'Tạo bài lập trình, test case và cấu hình chấm code.',
      'Theo dõi kết quả học tập, submission và hoạt động của học viên.',
    ],
  },
};

const loadRoles = () => {
  const saved = localStorage.getItem('web_content_roles');
  return saved ? JSON.parse(saved) : DEFAULT_ROLES;
};

const loadAboutRoles = () => {
  const saved = localStorage.getItem('web_content_about_roles');
  return saved ? JSON.parse(saved) : DEFAULT_ABOUT_ROLES;
};

const RoleEditorCard = ({
  heading,
  iconClass,
  panel,
  showEyebrow,
  columnClassName,
  itemsLabel,
  onFieldChange,
  onItemChange,
}) => (
  <div className="admin-card web-content-role-card">
    <div className="admin-card-hd">
      <i className={`${iconClass} web-content-role-heading-icon`}></i>
      {heading}
    </div>

    <div className="admin-card-body web-content-role-card-body">
      <div className={columnClassName}>
        <div className="admin-field web-content-field-reset">
          <label>Icon Google</label>
          <input value={panel.icon} onChange={(event) => onFieldChange('icon', event.target.value)} />
        </div>

        {showEyebrow && (
          <div className="admin-field web-content-field-reset">
            <label>Nhãn phụ (Eyebrow)</label>
            <input value={panel.eyebrow} onChange={(event) => onFieldChange('eyebrow', event.target.value)} />
          </div>
        )}

        <div className="admin-field web-content-field-reset">
          <label>Tiêu đề chính</label>
          <input value={panel.title} onChange={(event) => onFieldChange('title', event.target.value)} />
        </div>
      </div>

      <div className="web-content-role-items-label">{itemsLabel}</div>

      {panel.items.map((item, index) => (
        <div key={index} className="admin-field web-content-field-reset">
          <label>Dòng #{index + 1}</label>
          <input value={item} onChange={(event) => onItemChange(index, event.target.value)} />
        </div>
      ))}
    </div>
  </div>
);

const RolePanelsTab = ({ showToast }) => {
  const [roles, setRoles] = useState(loadRoles);
  const [aboutRoles, setAboutRoles] = useState(loadAboutRoles);
  const [roleSubTab, setRoleSubTab] = useState('home');

  const saveRoles = () => {
    localStorage.setItem('web_content_roles', JSON.stringify(roles));
    showToast('Đã lưu nội dung bộ công cụ học viên & giảng viên trang chủ');
  };

  const saveAboutRoles = () => {
    localStorage.setItem('web_content_about_roles', JSON.stringify(aboutRoles));
    showToast('Đã lưu nội dung vai trò trang About Us');
  };

  const updatePanelField = (setter, groupKey, field, value) => {
    setter((prev) => ({
      ...prev,
      [groupKey]: {
        ...prev[groupKey],
        [field]: value,
      },
    }));
  };

  const updatePanelItem = (setter, groupKey, itemIndex, value) => {
    setter((prev) => {
      const nextItems = [...prev[groupKey].items];
      nextItems[itemIndex] = value;

      return {
        ...prev,
        [groupKey]: {
          ...prev[groupKey],
          items: nextItems,
        },
      };
    });
  };

  return (
    <div className="web-content-role-layout">
      <div className="web-content-role-subtabs">
        <button
          type="button"
          className={`admin-btn ${roleSubTab === 'home' ? 'admin-btn-primary' : ''}`}
          onClick={() => setRoleSubTab('home')}
        >
          Bộ công cụ Trang chủ
        </button>
        <button
          type="button"
          className={`admin-btn ${roleSubTab === 'about' ? 'admin-btn-primary' : ''}`}
          onClick={() => setRoleSubTab('about')}
        >
          Bộ công cụ trang About Us
        </button>
      </div>

      {roleSubTab === 'home' ? (
        <div className="admin-grid-2 web-content-role-grid">
          <RoleEditorCard
            heading="Trang chủ: Bộ công cụ Học viên (Student)"
            iconClass="ti ti-school"
            panel={roles.student}
            showEyebrow
            columnClassName="admin-grid-3"
            itemsLabel="Các dòng mô tả (tối đa 5 dòng):"
            onFieldChange={(field, value) => updatePanelField(setRoles, 'student', field, value)}
            onItemChange={(index, value) => updatePanelItem(setRoles, 'student', index, value)}
          />

          <RoleEditorCard
            heading="Trang chủ: Bộ công cụ Giảng viên (Instructor)"
            iconClass="ti ti-presentation"
            panel={roles.instructor}
            showEyebrow
            columnClassName="admin-grid-3"
            itemsLabel="Các dòng mô tả (tối đa 5 dòng):"
            onFieldChange={(field, value) => updatePanelField(setRoles, 'instructor', field, value)}
            onItemChange={(index, value) => updatePanelItem(setRoles, 'instructor', index, value)}
          />

          <div className="web-content-role-save-row">
            <button className="admin-btn admin-btn-primary web-content-role-save-button" type="button" onClick={saveRoles}>
              <i className="ti ti-device-floppy"></i>
              Lưu thay đổi bộ công cụ Trang chủ
            </button>
          </div>
        </div>
      ) : (
        <div className="admin-grid-2 web-content-role-grid">
          <RoleEditorCard
            heading="About Us: Bộ công cụ Học viên"
            iconClass="ti ti-school"
            panel={aboutRoles.student}
            columnClassName="admin-grid-2"
            itemsLabel="Các dòng mô tả (tối đa 6 dòng):"
            onFieldChange={(field, value) => updatePanelField(setAboutRoles, 'student', field, value)}
            onItemChange={(index, value) => updatePanelItem(setAboutRoles, 'student', index, value)}
          />

          <RoleEditorCard
            heading="About Us: Bộ công cụ Giảng viên"
            iconClass="ti ti-presentation"
            panel={aboutRoles.instructor}
            columnClassName="admin-grid-2"
            itemsLabel="Các dòng mô tả (tối đa 6 dòng):"
            onFieldChange={(field, value) => updatePanelField(setAboutRoles, 'instructor', field, value)}
            onItemChange={(index, value) => updatePanelItem(setAboutRoles, 'instructor', index, value)}
          />

          <div className="web-content-role-save-row">
            <button
              className="admin-btn admin-btn-primary web-content-role-save-button"
              type="button"
              onClick={saveAboutRoles}
            >
              <i className="ti ti-device-floppy"></i>
              Lưu thay đổi bộ công cụ trang About Us
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolePanelsTab;
