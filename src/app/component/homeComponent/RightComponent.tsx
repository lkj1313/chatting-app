import ChatRoomComponent from "@/app/component/homeComponent/ChatRoomComponent";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";

const RightComponent = () => {
  const chatRoomId = useSelector(
    (state: RootState) => state.chatRoom.chatRoomId
  );
  return (
    <div
      className="p-0 col"
      style={{
        flexGrow: 1,
        height: "100%",

        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",

          boxSizing: "border-box",
        }}
      >
        {chatRoomId ? (
          <ChatRoomComponent chatRoomId={chatRoomId} />
        ) : (
          <div>대화방을 선택해주세요</div>
        )}
      </div>
    </div>
  );
};

export default RightComponent;
