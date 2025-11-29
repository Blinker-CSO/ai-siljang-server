import axios from "axios";

export async function sendSMS(to, text) {
  try {
    const res = await axios.post(
      "https://api.solapi.com/messages/v4/send",
      {
        message: {
          to: to,
          from: process.env.SENDER_NUMBER,
          text: text
        }
      },
      {
        headers: {
          Authorization:
            `HMAC-SHA256 ApiKey=${process.env.SOLAPI_KEY}, Date=${new Date().toISOString()}`,
          "Content-Type": "application/json"
        }
      }
    );

    return true;
  } catch (error) {
    console.error("🔥 [SMS 전송 실패 상세]", {
      status: error.response?.status,
      data: error.response?.data,
      msg: error.message
    });

    return false;
  }
}
