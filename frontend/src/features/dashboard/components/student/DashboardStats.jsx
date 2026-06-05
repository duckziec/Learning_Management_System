import '../../styles/student/DashboardStats.css';

export default function DashboardStats({ stats }) {
  if (!stats) return null;
  
  return (
    <div className="stats-grid">
      {stats.map((stat, idx) => (
        <div key={idx} className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: stat.color, color: stat.textColor }}>
            <span className="material-symbols-outlined">{stat.icon}</span>
          </div>
          <div className="stat-info">
            <p className="label">{stat.label}</p>
            <p className="value">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
