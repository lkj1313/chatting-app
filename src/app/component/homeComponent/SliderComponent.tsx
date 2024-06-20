import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { db, auth } from "../../../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";

const Sidebar: React.FC = () => {
  const sidebarOpen = useSelector(
    (state: RootState) => state.container.sidebarOpen
  );
  const containerWidth = useSelector(
    (state: RootState) => state.container.containerWidth
  );
  const [profileImg, setProfileImg] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileImg = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const profileImgUrl = docSnap.data()?.profileImg;
            setProfileImg(profileImgUrl);
          }
        }
      } catch (error) {
        console.error("Error fetching profile image: ", error);
      }
    };

    // Firebase Auth 상태 변화 감지
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchProfileImg();
      } else {
        setProfileImg(null);
      }
    });

    return () => unsubscribe();
  }, []);
  return (
    <div
      className={`sidebar ${sidebarOpen ? "show" : ""}`}
      style={{ width: containerWidth * 0.2 }}
    >
      <div>
        <p>{profileImg}</p>
      </div>
    </div>
  );
};
export default Sidebar;
