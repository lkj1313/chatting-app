"use client";
import HeaderComponent from "./HeaderComponent";
import MainComponent from "./MainComponent";

const LayoutComponent: React.FC = () => {
  return (
    <div className="container">
      <HeaderComponent />
      <MainComponent />
    </div>
  );
};

export default LayoutComponent;
