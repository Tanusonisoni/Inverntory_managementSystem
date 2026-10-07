const StatsCard = ({ title, value, subtitle, tone = "default" }) => (
  <div className={`stats-card tone-${tone}`}>
    <div className="stats-label">{title}</div>
    <div className="stats-value">{value}</div>
    {subtitle ? <div className="stats-subtitle">{subtitle}</div> : null}
  </div>
);

export default StatsCard;
