import React, { useState } from 'react';
import '../../../../styles/admin/WebContentMgmt/QuotesSloganTab.css';

const DEFAULT_SLOGAN = 'Nền tảng Học tập & Đào tạo lập trình thế hệ mới';
const DEFAULT_QUOTES = [
  {
    id: 'quote-1',
    text: 'Học lập trình không phải là học cú pháp, mà là học cách giải quyết vấn đề.',
    author: 'Steve Jobs',
  },
  {
    id: 'quote-2',
    text: 'Trong thế giới công nghệ thay đổi liên tục, kỹ năng quan trọng nhất bạn cần sở hữu là kỹ năng tự học.',
    author: 'Bill Gates',
  },
  {
    id: 'quote-3',
    text: 'Mã nguồn chạy được chưa đủ, nó còn phải sạch và dễ hiểu đối với người khác.',
    author: 'Martin Fowler',
  },
];

const loadSlogan = () => {
  const saved = localStorage.getItem('web_content_slogan');
  return saved ? JSON.parse(saved) : DEFAULT_SLOGAN;
};

const loadQuotes = () => {
  const saved = localStorage.getItem('web_content_quotes');
  return saved ? JSON.parse(saved) : DEFAULT_QUOTES;
};

const QuotesSloganTab = ({ showToast }) => {
  const [slogan, setSlogan] = useState(loadSlogan);
  const [quotes, setQuotes] = useState(loadQuotes);
  const [editingQuote, setEditingQuote] = useState(null);
  const [quoteForm, setQuoteForm] = useState({ text: '', author: '' });

  const saveSlogan = () => {
    localStorage.setItem('web_content_slogan', JSON.stringify(slogan));
    showToast('Đã cập nhật slogan chính trang chủ');
  };

  const saveQuotes = (nextQuotes) => {
    setQuotes(nextQuotes);
    localStorage.setItem('web_content_quotes', JSON.stringify(nextQuotes));
  };

  const resetQuoteForm = () => {
    setEditingQuote(null);
    setQuoteForm({ text: '', author: '' });
  };

  const handleSaveQuoteSubmit = (event) => {
    event.preventDefault();

    if (!quoteForm.text || !quoteForm.author) {
      showToast('Vui lòng nhập trích dẫn và tác giả', 'danger');
      return;
    }

    if (editingQuote) {
      const updatedQuotes = quotes.map((quote) =>
        quote.id === editingQuote.id ? { ...quoteForm, id: quote.id } : quote,
      );
      saveQuotes(updatedQuotes);
      showToast('Đã cập nhật câu trích dẫn');
      resetQuoteForm();
      return;
    }

    const newQuote = {
      ...quoteForm,
      id: `quote-${Date.now()}`,
    };

    saveQuotes([...quotes, newQuote]);
    showToast('Đã thêm trích dẫn truyền cảm hứng mới');
    resetQuoteForm();
  };

  const handleEditQuote = (quote) => {
    setEditingQuote(quote);
    setQuoteForm({ text: quote.text, author: quote.author });
  };

  const handleDeleteQuote = (quoteId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa trích dẫn này?')) return;

    const filteredQuotes = quotes.filter((quote) => quote.id !== quoteId);
    saveQuotes(filteredQuotes);
    showToast('Đã xóa câu trích dẫn');
  };

  return (
    <div className="admin-grid-2 web-content-quotes-grid">
      <div className="web-content-quotes-stack">
        <div className="admin-card">
          <div className="admin-card-hd">
            <i className="ti ti-text-recognition"></i>
            Slogan chính của trang chủ
          </div>

          <div className="admin-card-body">
            <div className="admin-field">
              <textarea
                className="web-content-slogan-input"
                value={slogan}
                onChange={(event) => setSlogan(event.target.value)}
              />
            </div>

            <button className="admin-btn admin-btn-primary" type="button" onClick={saveSlogan}>
              <i className="ti ti-device-floppy"></i>
              Lưu Slogan
            </button>
          </div>
        </div>

        <div className="web-content-quotes-list">
          <div className="web-content-quotes-heading">Danh sách trích dẫn ({quotes.length})</div>

          {quotes.map((quote) => (
            <div key={quote.id} className="admin-card web-content-quote-card">
              <div className="web-content-quote-card-body">
                <div className="web-content-quote-text">"{quote.text}"</div>

                <div className="web-content-quote-footer">
                  <span className="web-content-quote-author">— Tác giả: {quote.author}</span>
                  <div className="web-content-quote-actions">
                    <button type="button" className="icon-btn" title="Sửa" onClick={() => handleEditQuote(quote)}>
                      <i className="ti ti-edit"></i>
                    </button>
                    <button
                      type="button"
                      className="icon-btn web-content-danger-action"
                      title="Xóa"
                      onClick={() => handleDeleteQuote(quote.id)}
                    >
                      <i className="ti ti-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-hd">
          <i className={`ti ti-${editingQuote ? 'edit' : 'quote'}`}></i>
          {editingQuote ? 'Sửa trích dẫn' : 'Thêm trích dẫn mới'}
        </div>

        <form className="admin-card-body" onSubmit={handleSaveQuoteSubmit}>
          <div className="admin-field">
            <label>Nội dung câu trích dẫn</label>
            <textarea
              className="web-content-quote-form-textarea"
              placeholder="VD: Không có con đường tắt nào để thành thạo lập trình..."
              value={quoteForm.text}
              onChange={(event) => setQuoteForm({ ...quoteForm, text: event.target.value })}
            />
          </div>

          <div className="admin-field">
            <label>Tác giả</label>
            <input
              placeholder="VD: Steve Jobs, Khuyết danh..."
              value={quoteForm.author}
              onChange={(event) => setQuoteForm({ ...quoteForm, author: event.target.value })}
            />
          </div>

          <div className="web-content-form-actions">
            <button className="admin-btn admin-btn-primary" type="submit">
              <i className="ti ti-device-floppy"></i>
              {editingQuote ? 'Cập nhật' : 'Thêm trích dẫn'}
            </button>

            {editingQuote && (
              <button className="admin-btn" type="button" onClick={resetQuoteForm}>
                Hủy bỏ
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuotesSloganTab;
