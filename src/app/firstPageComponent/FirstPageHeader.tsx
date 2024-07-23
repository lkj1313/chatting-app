"use client"; // 클라이언트 컴포넌트로 지정

import { useDispatch, useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Button } from "react-bootstrap";
import { openSidebar, closeSidebar } from "@/app/store/uiSlice";
import Sidebar from "./Sidebar"; // Sidebar 컴포넌트 임포트
import { RootState } from "@/app/store/store";

const FirstPageHeader = () => {
  const dispatch = useDispatch();

  return (
    <header
      className="firstPageHeaderDiv"
      style={{
        padding: "0",
        margin: "0",
        height: "56px",
        position: "relative",
      }}
    >
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        style={{
          height: "100%",
          padding: "10px",
          display: "flex",
          justifyContent: "end",
        }}
      >
        <Button
          variant="dark"
          onClick={() => dispatch(openSidebar())}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </Button>
      </Navbar>
    </header>
  );
};

export default FirstPageHeader;