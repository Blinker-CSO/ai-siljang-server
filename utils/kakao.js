import axios from "axios";
import crypto from "crypto"; // 암호화 모듈 필수

export async function sendSMS(to, text) {
  try {
    // 1. 환경변수 가져오기
    const apiKey = process.env.SOLAPI_KEY;
    const apiSecret = process.env.SOLAPI_SECRET; // 이게 꼭 있어야 함!
    const senderNumber = process.env.SENDER_NUMBER || process.env.COOL_SMS_FROM;

    if (!apiKey || !apiSecret) {
      throw new Error("SOLAPI_KEY 또는 SOLAPI_SECRET 환경변수가 없습니다!");
    }

    // 2. 인증 서명 생성 (Solapi/CoolSMS 필수 규격)
    const date = new Date().toISOString();
    const salt = crypto.randomBytes(16).toString("hex");
    const signature = crypto
      .createHmac("sha256", apiSecret)
      .update(date + salt)
      .digest("hex");

    console.log(`📨 SMS 발송 시도: ${to} (발신: ${senderNumber})`);

    // 3. API 요청 보내기
    const res = await axios.post(
      "https://api.solapi.com/messages/v4/send",
      {
        message: {
          to: to,
          from: senderNumber, // 하이픈 없는 숫자만
          text: text
        }
      },
      {
        headers: {
          // 정확한 인증 헤더 포맷
          Authorization: `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ SMS 전송 성공! ID:", res.data.groupId);
    return true;

  } catch (error) {
    // 에러 내용을 상세히 로그에 남김
    console.error("🔥 SMS 전송 실패:", error.response?.data || error.message);
    
    // index.js가 실패를 알 수 있도록 false 반환 대신 에러를 던짐 (선택)
    // 여기선 일단 false 리턴 유지하되 로그를 확실히 남김
    return false;
  }
}
