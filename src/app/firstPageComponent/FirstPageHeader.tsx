"use client"; // 클라이언트 컴포넌트로 지정
import React from "react";
import { useDispatch } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Button } from "react-bootstrap";
import { openSidebar, closeSidebar } from "@/app/store/uiSlice";

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

export default React.memo(FirstPageHeader);
