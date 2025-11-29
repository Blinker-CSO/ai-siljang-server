import express from "express";
import bodyParser from "body-parser";
import { sendSMS } from "./utils/kakao.js";

const app = express();
app.use(bodyParser.json());

// 헬스 체크
app.get("/", (req, res) => {
  res.send("AI실장 서버 작동 중 🚀");
});

// 웹훅 처리
app.post("/webhook", async (req, res) => {
  try {
    const { message, source } = req.body;

    console.log("GAS → Server:", req.body);

    const text = `[AI실장]\n${source}\n---\n${message}`;

    const result = await sendSMS(
      process.env.ADMIN_PHONE, // << 무조건 명구님 번호로 보냄!
      text
    );

    res.json({ ok: true, sent: result });
  } catch (err) {
    console.error("웹훅 오류:", err.message);
    res.json({ ok: false, error: err.message });
  }
});

export default app;
