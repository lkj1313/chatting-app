import React from "react";

const FirstPageFooter = () => {
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
        >
          <img src="/comment.png" style={{ height: "50%" }}></img>
        </div>
      </div>
    </div>
  );
};

export default FirstPageFooter;
