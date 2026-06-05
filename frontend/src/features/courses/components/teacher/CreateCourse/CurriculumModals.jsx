import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTimes, faLayerGroup, faFolderOpen,
    faVideo, faBook,
    faFileAlt, faCheckCircle, faTimesCircle,
    faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { courseApi } from '../../../../../services/course.api';
import '../../../styles/teacher/CreateCourse/curriculumModals.css';

/* ── Shared modal shell ── */
const Modal = ({ isOpen, onClose, title, icon, children, onSubmit, submitLabel, submitDisabled }) => {
    if (!isOpen) return null;

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
    };

    return (
        <div className="modal-overlay" onKeyDown={handleKeyDown}>
            <div className="modal-content">
                <div className="modal-header">
                    <div className="modal-title-row">
                        {icon && <FontAwesomeIcon icon={icon} className="modal-title-icon" />}
                        <h2>{title}</h2>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
                <div className="modal-body">{children}</div>
                <div className="modal-footer">
                    <button className="btn-modal-cancel" onClick={onClose}>Hủy</button>
                    <button className="btn-modal-submit" onClick={onSubmit} disabled={submitDisabled}>
                        {submitLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ── Chapter modal (add / edit) ── */
export const ChapterSettingsModal = ({ isOpen, onClose, chapterData, onSave }) => {
    const [title, setTitle] = useState('');

    useEffect(() => {
        if (isOpen) setTitle(chapterData?.title || '');
    }, [isOpen, chapterData]);

    const handleSubmit = () => {
        if (!title.trim()) return;
        onSave(title.trim());
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={chapterData ? 'Chỉnh sửa chương' : 'Thêm chương mới'}
            icon={faLayerGroup}
            onSubmit={handleSubmit}
            submitLabel={chapterData ? 'Lưu thay đổi' : 'Thêm chương'}
        >
            <div className="form-field">
                <label>Tên chương</label>
                <input
                    autoFocus
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder="VD: Giới thiệu về thiết kế UI/UX"
                />
            </div>
        </Modal>
    );
};

/* ── Section modal (add / edit) ── */
export const AddSectionModal = ({ isOpen, onClose, sectionData, onSave }) => {
    const [title, setTitle] = useState('');

    useEffect(() => {
        if (isOpen) setTitle(sectionData?.title || '');
    }, [isOpen, sectionData]);

    const handleSubmit = () => {
        if (!title.trim()) return;
        onSave(title.trim());
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={sectionData ? 'Chỉnh sửa mục' : 'Thêm mục mới'}
            icon={faFolderOpen}
            onSubmit={handleSubmit}
            submitLabel={sectionData ? 'Lưu thay đổi' : 'Thêm mục'}
        >
            <div className="form-field">
                <label>Tên mục</label>
                <input
                    autoFocus
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder="VD: Các nguyên tắc cốt lõi"
                />
            </div>
        </Modal>
    );
};

/* ── Content type config ── */
const CONTENT_TYPES = [
    { key: 'video',    label: 'Video',    icon: faVideo, accept: 'video/*',                           folder: 'lessons/videos' },
    { key: 'document', label: 'Tài liệu', icon: faBook,  accept: '.pdf,.doc,.docx,.ppt,.pptx,.xlsx', folder: 'lessons/documents' },
];

/* ── File upload area ── */
const FileUpload = ({ contentType, existingUrl, onUploaded, onRemoved, onUploadingChange }) => {
    const [uploadState, setUploadState] = useState('idle'); // idle | uploading | done | error
    const [progress, setProgress] = useState(0);
    const [fileName, setFileName] = useState('');
    const [fileUrl, setFileUrl] = useState(existingUrl || null);
    const fileInputRef = useRef(null);
    const xhrRef = useRef(null);
    const cancelledRef = useRef(false); // true khi user chủ động hủy hoặc component unmount

    const typeConfig = CONTENT_TYPES.find(t => t.key === contentType);

    // Abort XHR khi component unmount (modal đóng trong lúc đang upload)
    useEffect(() => {
        return () => {
            if (xhrRef.current) {
                cancelledRef.current = true;
                xhrRef.current.abort();
            }
        };
    }, []);

    useEffect(() => {
        // Reset when content type changes
        setUploadState(existingUrl ? 'done' : 'idle');
        setFileUrl(existingUrl || null);
        setFileName(existingUrl ? existingUrl.split('/').pop() : '');
        setProgress(0);
    }, [contentType, existingUrl]);

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        cancelledRef.current = false;
        setFileName(file.name);
        setUploadState('uploading');
        setProgress(0);
        onUploadingChange?.(true);

        try {
            const { presignedUrl, publicUrl } = await courseApi.getPresignedUrl(
                file.name, file.type, typeConfig.folder
            );

            await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhrRef.current = xhr;
                xhr.upload.onprogress = (ev) => {
                    if (ev.lengthComputable) setProgress(Math.round((ev.loaded / ev.total) * 100));
                };
                xhr.onload  = () => xhr.status < 300 ? resolve() : reject(new Error(`Upload failed: ${xhr.status}`));
                xhr.onerror = () => reject(new Error('Network error'));
                xhr.onabort = () => reject(new Error('aborted'));
                xhr.open('PUT', presignedUrl);
                xhr.setRequestHeader('Content-Type', file.type);
                xhr.send(file);
            });

            // Không làm gì nếu đã bị cancel (user hủy hoặc modal đóng)
            if (cancelledRef.current) return;

            setFileUrl(publicUrl);
            setUploadState('done');
            onUploadingChange?.(false);
            onUploaded?.(publicUrl, file.type);
        } catch (err) {
            if (cancelledRef.current) return; // bị cancel chủ động, không cần xử lý
            console.error('Upload error:', err);
            setUploadState('error');
            onUploadingChange?.(false);
        }
    };

    // Hủy upload đang chạy (nhấn "Hủy" trên thanh tiến trình)
    const handleRemove = () => {
        cancelledRef.current = true;
        if (xhrRef.current) xhrRef.current.abort();
        onUploadingChange?.(false);
        onRemoved?.(fileUrl);
        setFileUrl(null);
        setFileName('');
        setUploadState('idle');
        setProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    if (uploadState === 'done' && fileUrl) {
        return (
            <div className="upload-done-row">
                <FontAwesomeIcon icon={faCheckCircle} className="upload-done-icon" />
                <span className="upload-done-name" title={fileName}>{fileName || fileUrl.split('/').pop()}</span>
                <button type="button" className="upload-remove-btn" onClick={handleRemove} title="Xóa file">
                    <FontAwesomeIcon icon={faTimesCircle} />
                </button>
            </div>
        );
    }

    if (uploadState === 'uploading') {
        return (
            <div className="upload-progress-wrap">
                <div className="upload-progress-name">
                    <FontAwesomeIcon icon={faSpinner} spin />
                    <span>{fileName}</span>
                </div>
                <div className="upload-progress-bar-track">
                    <div className="upload-progress-bar-fill" style={{ width: `${progress}%` }} />
                </div>
                <span className="upload-progress-pct">{progress}%</span>
                <button type="button" className="upload-remove-btn" onClick={handleRemove}>Hủy</button>
            </div>
        );
    }

    if (uploadState === 'error') {
        return (
            <div className="upload-error-row">
                <FontAwesomeIcon icon={faTimesCircle} className="upload-error-icon" />
                <span>Tải lên thất bại</span>
                <button type="button" className="upload-retry-btn" onClick={() => setUploadState('idle')}>Thử lại</button>
            </div>
        );
    }

    return (
        <div className="upload-dropzone" onClick={() => fileInputRef.current?.click()}>
            <FontAwesomeIcon icon={contentType === 'video' ? faVideo : faFileAlt} className="upload-dropzone-icon" />
            <span className="upload-dropzone-label">
                {contentType === 'video' ? 'Chọn file video' : 'Chọn tài liệu'}
            </span>
            <span className="upload-dropzone-hint">
                {contentType === 'video' ? 'MP4, MOV, WebM' : 'PDF, DOCX, PPTX, XLSX'}
            </span>
            <input
                ref={fileInputRef}
                type="file"
                accept={typeConfig?.accept}
                className="upload-file-input"
                onChange={handleFileChange}
            />
        </div>
    );
};

/* ── Content part modal (add / edit lesson) ── */
export const AddContentPartModal = ({ isOpen, onClose, partData, onSave, onFileUploaded, onFileRemoved }) => {
    const [title, setTitle]             = useState('');
    const [contentType, setContentType] = useState('video');
    const [fileUrl, setFileUrl]         = useState(null);
    const [fileType, setFileType]       = useState(null);
    const [replacedUrl, setReplacedUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setTitle(partData?.title || '');
            setContentType(partData?.contentType || 'video');
            setFileUrl(partData?.fileUrl || null);
            setFileType(null);
            setReplacedUrl(null);
            setIsUploading(false);
        }
    }, [isOpen, partData]);

    const handleContentTypeChange = (key) => {
        setContentType(key);
        // Switching type clears the current file
        if (fileUrl) {
            setReplacedUrl(fileUrl);
            setFileUrl(null);
        }
    };

    const handleFileUploaded = (url, mimeType) => {
        setFileUrl(url);
        setFileType(mimeType);
        onFileUploaded?.(url);
    };

    const handleFileRemoved = (url) => {
        if (url === fileUrl) {
            setReplacedUrl(url);
            setFileUrl(null);
        }
    };

    // Khi hủy: xóa file đã upload trong session này (chưa được lưu vào lesson)
    const handleCancel = () => {
        if (fileUrl && fileUrl !== partData?.fileUrl) {
            onFileRemoved?.(fileUrl);
        }
        onClose();
    };

    const handleSubmit = () => {
        if (!title.trim()) return;
        onSave({ title: title.trim(), contentType, fileUrl, fileType, replacedUrl });
        onClose();
    };

    const needsFile = true; // video và document đều cần file

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleCancel}
            title={partData ? 'Chỉnh sửa bài học' : 'Thêm bài học mới'}
            onSubmit={handleSubmit}
            submitLabel={partData ? 'Lưu thay đổi' : 'Thêm bài học'}
            submitDisabled={!title.trim() || isUploading}
        >
            {/* Content type tabs */}
            <div className="modal-type-tabs">
                {CONTENT_TYPES.map(({ key, label, icon }) => (
                    <button
                        key={key}
                        type="button"
                        className={`modal-type-tab ${contentType === key ? 'active' : ''} ${isUploading ? 'disabled' : ''}`}
                        onClick={() => !isUploading && handleContentTypeChange(key)}
                        disabled={isUploading}
                        title={isUploading ? 'Đang tải lên, vui lòng chờ...' : ''}
                    >
                        <FontAwesomeIcon icon={icon} />
                        {label}
                    </button>
                ))}
            </div>

            <div className="form-field">
                <label>Tên bài học</label>
                <input
                    autoFocus
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder="VD: Nguyên tắc thiết kế nâng cao"
                />
            </div>

            {needsFile && (
                <div className="form-field">
                    <label>{contentType === 'video' ? 'File video' : 'File tài liệu'}</label>
                    <FileUpload
                        contentType={contentType}
                        existingUrl={fileUrl}
                        onUploaded={handleFileUploaded}
                        onRemoved={handleFileRemoved}
                        onUploadingChange={setIsUploading}
                    />
                </div>
            )}
        </Modal>
    );
};
