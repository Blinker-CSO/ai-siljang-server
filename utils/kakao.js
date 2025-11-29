import axios from "axios";

export async function sendSMS(to, text) {
  try {
    const res = await axios({
      method: "post",
      url: "https://api.solapi.com/messages/v4/send",
      headers: {
        Authorization:
          "HMAC-SHA256 ApiKey=" +
          process.env.SOLAPI_KEY +
          ", Date=" +
          new Date().toISOString(),
        "Content-Type": "application/json"
      },
      data: {
        message: {
          to: to,
          from: process.env.SENDER_NUMBER,
          text: text
        }
      }
    });

    return true;
  } catch (error) {
    console.error("🔥 [SMS 전송 실패 상세]", {
      status: error.response?.status,
      data: error.response?.data
    });

    return false;
  }
}
