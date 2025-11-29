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
    // 1. GAS가 보낸 데이터 받기
    const { message, source, phone } = req.body;
    console.log("📨 GAS → Server 데이터 수신:", req.body);

    // 2. 수신번호 결정 (GAS에서 보낸 번호 우선, 없으면 환경변수 사용)
    // GAS 코드에서 "phone"을 보냈으므로 이제 targetPhone에 값이 들어갑니다.
    const targetPhone = phone || process.env.ADMIN_PHONE;

    if (!targetPhone) {
      throw new Error("수신번호(phone)가 없습니다. GAS 코드나 환경변수를 확인하세요.");
    }

    const text = `[AI실장]\n${source}\n---\n${message}`;

    console.log(`🚀 SMS 발송 시도 중... (수신자: ${targetPhone})`);

    // 3. SMS 발송 (타임아웃 방지를 위해 결과 기다림)
    const result = await sendSMS(targetPhone, text);
    
    console.log("✅ SMS 발송 성공:", result);

    // 4. GAS에게 "성공했다"고 응답 (이게 없으면 GAS가 6분 기다리다 죽음)
    res.status(200).json({ ok: true, sent: result });

  } catch (err) {
    console.error("❌ 웹훅 처리 중 오류:", err.message);
    // 에러가 나도 GAS에게 "실패했다"고 알려줘야 함
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default app;
