import React from "react";

interface FirstPageFooterProps {
  activeComponent: string;
  setActiveComponent: (component: string) => void;
}

const FirstPageFooter: React.FC<FirstPageFooterProps> = ({
  activeComponent,
  setActiveComponent,
}) => {
  const handleNavigation = (component: string) => {
    setActiveComponent(component);
  };

  return (
    <footer className="firstPageFooterDiv">
      <div className="row">
        <div
          className={`col-6 footer-button ${
            activeComponent === "friend" ? "active" : ""
          }`}
          role="button"
          onClick={() => handleNavigation("friend")}
        >
          <img src="/friendIcon.png" className="icon-img" alt="Friends" />
        </div>
        <div
          className={`col-6 footer-button ${
            activeComponent === "main" ? "active" : ""
          }`}
          role="button"
          onClick={() => handleNavigation("main")}
        >
          <img src="/comment.png" className="icon-img" alt="Comments" />
        </div>
      </div>
    </footer>
  );
};

export default React.memo(FirstPageFooter);
