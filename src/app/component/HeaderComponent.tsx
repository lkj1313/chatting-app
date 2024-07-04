import React from "react";

const NavbarComponent = () => {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-dark"
      style={{ height: "50px" }}
    >
      <div className="container-fluid">
        <div className="me-3">
          <a className="navbar-brand mx-auto" href="#">
            Navbar
          </a>
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
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Link
              </a>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Dropdown
              </a>
              <ul className="dropdown-menu bg-dark">
                <li>
                  <a className="dropdown-item text-white" href="#">
                    Action
                  </a>
                </li>
                <li>
                  <a className="dropdown-item text-white" href="#">
                    Another action
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider bg-light" />
                </li>
                <li>
                  <a className="dropdown-item text-white" href="#">
                    Something else here
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a className="nav-link disabled" aria-disabled="true">
                Disabled
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavbarComponent;
