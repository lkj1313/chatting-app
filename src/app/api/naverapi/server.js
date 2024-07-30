import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors"; // CORS 미들웨어 추가

// ES 모듈에서 __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// dotenv 설정 - .env 파일 경로를 명시적으로 지정
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const app = express();

// CORS 설정
app.use(cors());

const client_id = process.env.NAVER_ID;
const client_secret = process.env.NAVER_PASSWORD;

const state = "RANDOM_STATE";
const redirectURI = encodeURI("http://localhost:3000/loadingpage");
let api_url = "";

app.get("/", (req, res) => {
  res.send("Welcome to the Naver Login App");
});

app.get("/naverlogin", (req, res) => {
  // 네이버 로그인 URL 구성
  api_url =
    "https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=" +
    client_id +
    "&redirect_uri=" +
    redirectURI +
    "&state=" +
    state;
  res.json({ url: api_url }); // JSON 형식으로 응답
});

app.get("/callback", async (req, res) => {
  const code = req.query.code;
  const state = req.query.state;
  // 토큰 요청 URL 구성
  api_url =
    "https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=" +
    client_id +
    "&client_secret=" +
    client_secret +
    "&redirect_uri=" +
    redirectURI +
    "&code=" +
    code +
    "&state=" +
    state;

  try {
    const response = await fetch(api_url, {
      method: "GET",
      headers: {
        "X-Naver-Client-Id": client_id,
        "X-Naver-Client-Secret": client_secret,
      },
    });
    const body = await response.json();
    res.writeHead(200, { "Content-Type": "application/json;charset=utf-8" });
    res.end(JSON.stringify(body));
  } catch (error) {
    res.status(500).end();
    console.log("error = " + error);
  }
});

app.listen(4000, () => {
  console.log("http://127.0.0.1:4000/naverlogin app listening on port 4000!");
});
