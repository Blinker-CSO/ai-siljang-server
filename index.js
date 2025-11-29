import express from "express";
import bodyParser from "body-parser";
import { sendKakao } from "./utils/kakao.js";

const app = express();
app.use(bodyParser.json());

// 헬스 체크
app.get("/", (req, res) => {
  res.send("AI실장 서버 작동 중 🚀");
});

// GAS → Server Webhook
app.post("/webhook", async (req, res) => {
  try {
    const { message, source } = req.body;

    console.log("GAS로부터 받은 데이터:", req.body);

    const result = await sendKakao(
      process.env.ADMIN_PHONE,
      `[AI실장]\n${source}\n---\n${message}`
    );

    res.json({ ok: true, sent: result });
  } catch (error) {
    console.error("Webhook 오류:
