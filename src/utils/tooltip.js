import React from "react";

const Tooltip = ({ text, children, position = "right" }) => {
  const positions = {
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  };

  const arrows = {
    right:
      "left-0 top-1/2 -translate-x-full -translate-y-1/2 border-r-gray-800",
    left: "right-0 top-1/2 translate-x-full -translate-y-1/2 border-l-gray-800",
    top: "bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-t-gray-800",
    bottom:
      "top-0 left-1/2 -translate-x-1/2 -translate-y-full border-b-gray-800",
  };

  return (
    <div className="group relative flex items-center justify-center">
      {children}
      <div
        className={`absolute ${positions[position]} px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg`}
      >
        {text}
        <div
          className={`absolute border-4 border-transparent ${arrows[position]}`}
        ></div>
      </div>
    </div>
  );
};

export default Tooltip;
