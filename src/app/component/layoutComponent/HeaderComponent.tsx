"use client"; // 클라이언트 컴포넌트로 지정

import { useDispatch } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { openSidebar } from "@/app/store/uiSlice";

const HeaderComponent = () => {
  const dispatch = useDispatch();

  return (
    <div className="container" style={{ padding: "0" }}>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            Home
          </a>
          <button
            className="navbar-toggler ms-auto"
            type="button"
            onClick={() => dispatch(openSidebar())}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <button
                  className="btn btn-dark"
                  onClick={() => dispatch(openSidebar())}
                  aria-label="Toggle sidebar"
                >
                  <span className="navbar-toggler-icon"></span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default HeaderComponent;
