import '../../../styles/student/DetailMyCourse/VideoPlayer.css';

/**
 * VideoPlayer Component
 *
 * Props:
 * - video: Object containing video data from database
 *   - thumbnail: string - URL of video thumbnail image
 *   - title: string - Video title for alt text
 *   - duration: string - Total video duration (e.g., "12:45")
 *   - currentTime: string - Current playback time (e.g., "05:12")
 *   - progress: number - Progress percentage (0-100)
 *
 * Example usage with database data:
 * const videoData = {
 *   thumbnail: "https://example.com/thumbnail.jpg",
 *   title: "Lesson 1: Introduction",
 *   duration: "15:30",
 *   currentTime: "08:45",
 *   progress: 58
 * };
 * <VideoPlayer video={videoData} />
 */
const VideoPlayer = ({ video }) => {
  // Default values if video data is not provided
  const {
    thumbnail = "https://lh3.googleusercontent.com/aida-public/AB6AXuDaHd9ra1_Ofw_XRbJkIWKtD5i1p-K-5dBfiUXD4OWAKckzxPTXQQ1smEK_rX2dP-PR5T9kGkET_jIBpMTBcSaWGDziQvqLz5IAsWvcDijSQ8CB16sHRfVZJRIb8dSJVSc0hcZUEgjq9xzx7goh0zsZIz1B2896J4FW9mVPNIP3xx9JEToSpDBm5r2G8QK5wlTvahccc9HTmbqqa0wjjj0h1swMqw6kzZDlbnXJ4x6YYMEQC1Ls6KFxq5BwVQFWRFgA9tO8pkS_W_0",
    title = "Course Video",
    duration = "12:45",
    currentTime = "05:12",
    progress = 33 // percentage
  } = video || {};

  return (
    <div className="video-player">
      <div className="video-player__container">
        <img
          alt={`${title} - Video Thumbnail`}
          className="video-player__thumbnail"
          src={thumbnail}
        />
        <div className="video-player__info">
          <div>
            <p className="video-player__eyebrow">Current Lesson</p>
            <h2 className="video-player__heading">{title}</h2>
          </div>
          <span className="video-player__badge">{duration}</span>
        </div>
        <div className="video-player__overlay">
          <button className="video-player__play-button">
            <span className="material-symbols-outlined video-player__play-icon">play_arrow</span>
          </button>
        </div>
        <div className="video-player__controls">
          <div className="video-player__progress-container">
            <div className="video-player__progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="video-player__controls-row">
            <div className="video-player__controls-group">
              <span className="material-symbols-outlined video-player__control-button">play_arrow</span>
              <span className="material-symbols-outlined video-player__control-button">skip_next</span>
              <span className="material-symbols-outlined video-player__control-button">volume_up</span>
              <span className="video-player__time">{currentTime} / {duration}</span>
            </div>
            <div className="video-player__controls-group">
              <span className="video-player__speed">1x</span>
              <span className="material-symbols-outlined video-player__control-button">settings</span>
              <span className="material-symbols-outlined video-player__control-button">fullscreen</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;