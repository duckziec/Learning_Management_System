import {useNavigate} from 'react-router-dom';
import '../../../styles/student/ExerciseHub/TopicCard.css';

const TopicCard = ({topic}) => {
    const navigate = useNavigate();

    const getBadgeStyle = (topicId) => {
        const styles = {
            default: {background: '#dcfce7', color: '#166534'}
        };
        return styles[topicId] || styles.default;
    };

    return (
        <div className="topic-card">
            <div className="topic-image">
                <img src={topic.image} alt={topic.title}/>
            </div>
            <div className="topic-content">
        <span
            className={`topic-badge ${topic.id === 'java' ? 'status-draft' : 'status-published'}`}
            style={getBadgeStyle(topic.id)}
        >
          {topic.level}
        </span>
                <h3 className="topic-title">{topic.title}</h3>
                <p className="topic-desc">{topic.description}</p>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                }}>
          <span style={{fontSize: '12px', color: '#94a3b8'}}>

            {topic.time}
          </span>
                </div>
                <button
                    className="solve-btn"
                    onClick={() => navigate(`/exercises/code/${topic.slug}`)}
                >
                    Luyện tập ngay
                </button>
            </div>
        </div>
    );
};

export default TopicCard;
