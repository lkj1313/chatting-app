import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { setSidebarOpen, setLeftWidth } from "@/app/store/containerSlice";

const LeftComponent: React.FC = () => {
  const dispatch = useDispatch();
  const containerWidth = useSelector(
    (state: RootState) => state.container.containerWidth
  );
  const leftWidth = useSelector(
    (state: RootState) => state.container.leftWidth
  );

  const toggleWidth = () => {
    const minWidth = containerWidth * 0.08;
    const maxWidth = containerWidth * 0.15;
    const newWidth = leftWidth === minWidth ? maxWidth : minWidth;
    dispatch(setLeftWidth(newWidth));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: leftWidth,
        transition: "width 0.3s ease",
        borderRight: "1px solid #ccc",
        boxSizing: "border-box",
        padding: "0 20px",
        position: "relative",
      }}
    >
      <div
        style={{
          marginTop: "20px",
          width: "100%",
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <button
          className="hamburger"
          onClick={() => dispatch(setSidebarOpen(true))}
        >
          <img style={{ width: "40px" }} src="/Hamburger_icon.png" />
        </button>
      </div>
      <div
        className="resizable-handle"
        onClick={toggleWidth}
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "7px",
          cursor: "pointer",
          backgroundColor: "#007bff",
        }}
      />
    </div>
  );
};

export default LeftComponent;
