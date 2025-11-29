import axios from "axios";

export async function sendSMS(to, text) {
  try {
    const response = await axios({
      method: "POST",
      url: "https://api.solapi.com/messages/v4/send",
      headers: {
        Authorization:
          "HMAC-SHA256 apiKey=" +
          process.env.SOLAPI_KEY +
          ", date=" +
          new Date().toUTCString() +
          ", salt=" +
          Math.random().toString(36).substring(2, 15) +
          ", signature=" +
          "dummy", // Solapi Node SDK 없이 간단한 호출 구조
      },
      data: {
        message: {
          to,
          from: process.env.SENDER_NUMBER,
          text,
        },
      },
    });

    console.log("SMS 전송 성공:", response.data);
    return true;
  } catch (e) {
    console.error("SMS 전송 실패:", e.message);
    return false;
  }
}
