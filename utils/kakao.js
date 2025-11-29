import { SolapiMessageService } from "solapi";

const messageService = new SolapiMessageService(
  process.env.SOLAPI_KEY,
  process.env.SOLAPI_SECRET
);

export async function sendKakao(to, text) {
  try {
    const result = await messageService.sendOne({
      to,
      from: process.env.SENDER_NUMBER,
      text
    });
    return result;
  } catch (err) {
    console.error("SMS 발송 오류:", err);
    return false;
  }
}
