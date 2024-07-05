import React from "react";

const NavbarComponent = () => {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-dark"
      style={{ height: "60px" }}
    >
      <div className="container-fluid">
        <div className="me-3">
          <button className="homeFaviconButton">
            <a className="navbar-brand mx-auto" href="/">
              <img
                src="/blackplane.png"
                style={{ width: "30px", height: "30px" }}
              ></img>
            </a>
          </button>
        </div>
        <button
          className="navbar-toggler position-absolute end-0 me-3"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          style={{ marginLeft: "20px" }}
          className="collapse navbar-collapse"
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/">
                <p style={{ fontSize: "16px" }}>Home</p>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavbarComponent;
