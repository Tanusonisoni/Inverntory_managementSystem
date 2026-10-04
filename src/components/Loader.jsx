const Loader = ({ label = "Loading..." }) => (
  <div className="loader-wrap" role="status" aria-live="polite">
    <div className="loader" />
    <span>{label}</span>
  </div>
);

export default Loader;
