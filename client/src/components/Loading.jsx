import PropTypes from "prop-types";

function Loading({ top = 10, width = 54, height = 54 }) {
  return (
    <div className="loader-wrapper">
      <div
        className="loader"
        style={{ width: `${width}px`, height: `${height}px`, top: `${top}px` }}
      >
        <div className="bar1"></div>
        <div className="bar2"></div>
        <div className="bar3"></div>
        <div className="bar4"></div>
        <div className="bar5"></div>
        <div className="bar6"></div>
        <div className="bar7"></div>
        <div className="bar8"></div>
        <div className="bar9"></div>
        <div className="bar10"></div>
        <div className="bar11"></div>
        <div className="bar12"></div>
      </div>
    </div>
  );
}

Loading.propTypes = {
  top: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default Loading;
