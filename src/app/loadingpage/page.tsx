"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useViewportHeight from "../component/useViewportHeight";

const LoadingPage = () => {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);
  return (
    <div className="loadingPageContainer">
      <img className="loadingPageFavicon" src="/favicon.png" alt="Logo" />
    </div>
  );
};

export default LoadingPage;
