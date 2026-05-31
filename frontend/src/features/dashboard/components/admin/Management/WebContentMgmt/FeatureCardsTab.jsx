import React, { useState } from 'react';
import '../../../../styles/admin/WebContentMgmt/FeatureCardsTab.css';

const DEFAULT_CARDS = [
  {
    id: 'card-1',
    title: 'Xem khóa học công khai',
    desc: 'Khách có thể xem danh sách và chi tiết khóa học trước khi đăng ký.',
    icon: 'travel_explore',
    tone: 'blue',
  },
  {
    id: 'card-2',
    title: 'Đăng ký đúng luồng',
    desc: 'Khi bấm đăng ký, hệ thống kiểm tra đăng nhập rồi mới ghi danh.',
    icon: 'login',
    tone: 'green',
  },
  {
    id: 'card-3',
    title: 'Học theo chương bài',
    desc: 'Khóa học được tổ chức theo chương, bài học và tài liệu rõ ràng.',
    icon: 'account_tree',
    tone: 'amber',
  },
  {
    id: 'card-4',
    title: 'Quiz kiểm tra kiến thức',
    desc: 'Người học làm trắc nghiệm theo khóa học và xem lại kết quả.',
    icon: 'quiz',
    tone: 'rose',
  },
  {
    id: 'card-5',
    title: 'Coding challenge',
    desc: 'Luyện code với test case và chấm tự động qua Judge0.',
    icon: 'code',
    tone: 'blue',
  },
  {
    id: 'card-6',
    title: 'Theo dõi tiến độ',
    desc: 'Xem khóa đã đăng ký, bài học hoàn thành và kết quả học tập.',
    icon: 'monitoring',
    tone: 'green',
  },
  {
    id: 'card-7',
    title: 'Blog cộng đồng',
    desc: 'Đọc, viết, bình luận và chia sẻ kinh nghiệm học tập.',
    icon: 'forum',
    tone: 'amber',
  },
  {
    id: 'card-8',
    title: 'Phân quyền theo vai trò',
    desc: 'Student, Instructor và Admin có quyền truy cập riêng.',
    icon: 'admin_panel_settings',
    tone: 'rose',
  },
];

const loadCards = () => {
  const saved = localStorage.getItem('web_content_cards');
  if (!saved) return DEFAULT_CARDS;

  try {
    const parsed = JSON.parse(saved);
    if (parsed.length < 8) {
      localStorage.setItem('web_content_cards', JSON.stringify(DEFAULT_CARDS));
      return DEFAULT_CARDS;
    }
    return parsed;
  } catch (error) {
    console.error(error);
    return DEFAULT_CARDS;
  }
};

const FeatureCardsTab = ({ showToast }) => {
  const [cards, setCards] = useState(loadCards);

  const updateCard = (cardId, field, value) => {
    setCards((prev) =>
      prev.map((card) => (card.id === cardId ? { ...card, [field]: value } : card)),
    );
  };

  const saveCards = () => {
    localStorage.setItem('web_content_cards', JSON.stringify(cards));
    showToast('Đã lưu nội dung các thẻ tính năng');
  };

  return (
    <div className="admin-grid-3 web-content-cards-grid">
      {cards.map((card, index) => (
        <div key={card.id} className="admin-card web-content-card-editor">
          <div className="admin-card-hd">
            <i className={`ti ${card.icon || 'ti-circle-dot'} web-content-card-icon`}></i>
            Thẻ tính năng #{index + 1}
          </div>

          <div className="admin-card-body web-content-card-body">
            <div className="admin-field web-content-field-reset">
              <label>Tiêu đề thẻ</label>
              <input value={card.title} onChange={(event) => updateCard(card.id, 'title', event.target.value)} />
            </div>

            <div className="admin-field web-content-field-reset">
              <label>Mô tả chi tiết</label>
              <textarea
                className="web-content-card-textarea"
                value={card.desc}
                onChange={(event) => updateCard(card.id, 'desc', event.target.value)}
              />
            </div>

            <div className="admin-field web-content-field-reset">
              <label>Icon Class hoặc Google Icon Name</label>
              <input
                placeholder="VD: ti-code hoặc travel_explore"
                value={card.icon}
                onChange={(event) => updateCard(card.id, 'icon', event.target.value)}
              />
            </div>

            <button className="admin-btn admin-btn-primary web-content-card-save" type="button" onClick={saveCards}>
              <i className="ti ti-device-floppy"></i>
              Lưu thay đổi
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeatureCardsTab;
