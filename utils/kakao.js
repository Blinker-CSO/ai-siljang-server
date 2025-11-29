import { SolapiMessageService } from "solapi";

const messageService = new SolapiMessageService(
  "NCSN0EQ2GDDQLPJT",     // SOLAPI_KEY
  "NNMVVFALJRUHTHJYAPAAN1O3YTQOQLDX"  // SOLAPI_SECRET
);

export async function sendKakao(to, text) {
  try {
    const result = await messageService.sendOne({
      to,
      from: "01077778518",   // 발신번호 (하이픈 없이)
      text
    });

    console.log("📨 문자 발송 성공:", result);
    return result;
  } catch (err) {
    console.error("❌ 문자 발송 오류:", err);
    return false;
  }
}
