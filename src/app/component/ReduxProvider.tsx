"use client"; // 클라이언트 컴포넌트로 지정

import React from "react";
import { Provider } from "react-redux";
import store from "../store/store";

const ReduxProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
