import React from "react";
import { useRouter } from "next/navigation";

const FirstPageFooter = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <footer className="firstPageFooterDiv">
      <div className="row" style={{ height: "100%", margin: "0" }}>
        <div
          className="col-6 footer-button"
          role="button"
          onClick={() => handleNavigation("/friendpage")}
        >
          <img src="/friendIcon.png" className="icon-img" alt="Friends" />
        </div>
        <div
          className="col-6 footer-button"
          role="button"
          onClick={() => handleNavigation("/")}
        >
          <img src="/comment.png" className="icon-img" alt="Comments" />
        </div>
      </div>
    </footer>
  );
};

export default React.memo(FirstPageFooter);
