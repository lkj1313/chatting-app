"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LoadingPage = () => {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);
  return (
    <div className="loadingPageContainer">
      <img className="loadingPageFavicon" src="/favicon.png" alt="Logo" />
    </div>
  );
};

export default LoadingPage;
