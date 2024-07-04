import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/style/global.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ReduxProvider from "./component/reduxProvider/ReduxProvider";
import LayoutContainer from "./component/homeComponent/LayOutComponent";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
  icons: {
    icon: "/favicon.png", // 여기서 아이콘 파일 경로를 설정합니다.
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>{children}</ReduxProvider>
        <ToastContainer
          position="top-center"
          limit={1}
          transition={Bounce}
          closeOnClick
          hideProgressBar={false}
          draggable
          pauseOnHover={false}
        />
      </body>
    </html>
  );
}
