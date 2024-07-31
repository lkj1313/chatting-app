"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { participantInfo } from "@/app/store/participantModalSlice";
import { participantModalOpen } from "@/app/store/uiSlice";

// Friend 인터페이스 정의
interface Friend {
  uid: string;
  nickname: string;
  profileImg: string;
  email: string;
  statusMessage: string | null;
}

// 친구 목록 가져오기
const getFriends = async (userUid: string) => {
  const userDocRef = doc(db, "users", userUid);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    return userDoc.data().friends || [];
  }
  return [];
};

// 사용자 정보 가져오기
const getUserInfo = async (uid: string) => {
  const userDocRef = doc(db, "users", uid);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    return userDoc.data();
  }
  return null;
};

const FriendList: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  // 친구 목록을 가져오는 함수
  const fetchFriends = useCallback(async () => {
    if (!currentUser?.uid) return;
    try {
      const friendUids = await getFriends(currentUser.uid);
      const friendList: Friend[] = await Promise.all(
        friendUids.map(async (uid: string) => {
          const friendData = await getUserInfo(uid);
          if (friendData) {
            return {
              uid,
              nickname: friendData.nickname,
              profileImg: friendData.profileImg,
              email: friendData.email,
              statusMessage: friendData.statusMessage,
            };
          }
          return null;
        })
      );
      setFriends(friendList.filter((friend) => friend !== null) as Friend[]);
    } catch (error) {
      console.error("Error fetching friends: ", error);
    }
  }, [currentUser]);

  // 컴포넌트가 마운트될 때 친구 목록을 가져옴
  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  // 친구를 클릭했을 때 동작하는 함수
  const handleFriendClick = useCallback(
    (friend: Friend) => {
      dispatch(participantInfo(friend));
      dispatch(participantModalOpen());
    },
    [dispatch]
  );

  // 친구 목록을 렌더링
  const friendItems = useMemo(() => {
    return friends.map((friend) => (
      <div className="container chatBox chatRow" key={friend.uid}>
        <div className="container" style={{ height: "70px", padding: "0px" }}>
          <div
            className="row"
            style={{
              display: "flex",
              flexDirection: "row",
              margin: "0",
              height: "100%",
              cursor: "pointer",
            }}
            onClick={() => handleFriendClick(friend)}
          >
            <div
              className="col-3"
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0 0 0 5px",
                height: "100%",
              }}
            >
              <button className="chatRoomButton">
                {friend.profileImg ? (
                  <img src={friend.profileImg} alt={friend.nickname} />
                ) : friend.nickname ? (
                  <span
                    style={{
                      color: "black",
                      fontSize: "16px",
                      textAlign: "center",
                    }}
                  >
                    {friend.nickname[0]}
                  </span>
                ) : (
                  <span
                    style={{
                      color: "black",
                      fontSize: "16px",
                      textAlign: "center",
                    }}
                  >
                    N/A
                  </span>
                )}
              </button>
            </div>
            <div className="col-9" style={{ height: "100%", padding: "0" }}>
              <div className="row" style={{ height: "60%" }}>
                <p style={{ margin: "0", fontSize: "20px" }}>
                  <strong>{friend.nickname}</strong>
                </p>
              </div>
              <div className="row" style={{ height: "40%" }}>
                <p>{friend.statusMessage}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ));
  }, [friends, handleFriendClick]);

  return (
    <div className="friendListContainer">
      {friends.length > 0 ? friendItems : <p>No friends available</p>}
    </div>
  );
};

export default React.memo(FriendList);
