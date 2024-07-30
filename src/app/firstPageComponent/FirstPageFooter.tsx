import React from "react";

interface FirstPageFooterProps {
  setActiveComponent: (component: string) => void;
}

const FirstPageFooter: React.FC<FirstPageFooterProps> = ({
  setActiveComponent,
}) => {
  const handleNavigation = (component: string) => {
    setActiveComponent(component);
  };

  return (
    <footer className="firstPageFooterDiv">
      <div className="row" style={{ height: "100%", margin: "0" }}>
        <div
          className="col-6 footer-button"
          role="button"
          onClick={() => handleNavigation("friend")}
        >
          <img src="/friendIcon.png" className="icon-img" alt="Friends" />
        </div>
        <div
          className="col-6 footer-button"
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
