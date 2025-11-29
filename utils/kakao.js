import axios from "axios";

export async function sendKakao(to, text) {
  const REST_KEY = process.env.KAKAO_REST_API_KEY;
  const TEMPLATE_ID = process.env.KAKAO_TEMPLATE_ID;

  try {
    const res = await axios({
      url: "https://api-push.kakao.com/v1/push",
      method: "POST",
      headers: {
        Authorization: `KakaoAK ${REST_KEY}`,
        "Content-Type": "application/json"
      },
      data: {
        template_id: TEMPLATE_ID,
        messages: [
          {
            to: to,
            text: text
          }
        ]
      }
    });

    console.log("카카오톡 발송 성공:", res.data);
    return true;
  } catch (err) {
    console.error("카카오톡 발송 실패:", err.response?.data || err);
    return false;
  }
}
