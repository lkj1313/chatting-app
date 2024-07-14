import React from "react";
import { useRouter } from "next/navigation";

const FirstPageFooter = () => {
  const route = useRouter();
  return (
    <div className=" firstPageFooterDiv ">
      <div className="row" style={{ height: "100%", margin: "0" }}>
        <div
          className="col-6"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0",
            margin: "0",
            width: "50%",
            height: "100%",
            borderRight: "1px solid white",
          }}
          role="button"
          onClick={() => {
            route.push("/friendpage");
          }}
        >
          <img src="/friendIcon.png" style={{ height: "50%" }}></img>
        </div>
        <div
          className="col-6"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0",
            margin: "0",
            width: "50%",
            height: "100%",
          }}
          role="button"
          onClick={() => {
            route.push("/");
          }}
        >
          <img src="/comment.png" style={{ height: "50%" }}></img>
        </div>
      </div>
    </div>
  );
};

export default FirstPageFooter;
