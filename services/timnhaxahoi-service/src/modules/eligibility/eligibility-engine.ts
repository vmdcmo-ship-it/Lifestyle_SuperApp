import { LeadSegment } from '../../entities/lead-segment.enum';
import type { HousingProject } from '../../entities/housing-project.entity';

/** Payload chuẩn hóa từ form 11 câu (số thứ tự theo SPEC). */
export interface QuizAnswersPayload {
  priorityGroup: number;
  residenceStatus: number;
  incomeBracket: number;
  housingStatus: number;
  priorityProjectIds: string[];
  ownCapitalMillion: number;
  borrowedCapitalMillion: number;
  loanPreference: number;
  maxMonthlyPaymentMillion: number;
  consultationFocus: number;
}

export interface EligibilityResult {
  segment: LeadSegment;
  score: number;
  userMessage: string;
}

function estimatedTotalMillion(projects: HousingProject[]): number {
  if (projects.length === 0) {
    return 1200;
  }
  const totals = projects.map((p) => (p.pricePerM2 * p.typicalAreaM2) / 1_000_000);
  const sum = totals.reduce((a, b) => a + b, 0);
  return sum / totals.length;
}

/**
 * Rule engine MVP — đồng bộ với SPEC §11 (bảng truth). Điều chỉnh công thức điểm trong PR sau.
 */
export function evaluateEligibility(
  answers: QuizAnswersPayload,
  selectedProjects: HousingProject[],
): EligibilityResult {
  const totalPrice = estimatedTotalMillion(selectedProjects);
  const ownRatio =
    totalPrice > 0 ? answers.ownCapitalMillion / totalPrice : 0;

  let score = 35;
  if (answers.priorityGroup >= 1 && answers.priorityGroup <= 4) {
    score += 15;
  }
  if (answers.residenceStatus === 1 || answers.residenceStatus === 2) {
    score += 15;
  }
  if (answers.incomeBracket === 1 || answers.incomeBracket === 2) {
    score += 10;
  }
  if (answers.housingStatus === 1 || answers.housingStatus === 2) {
    score += 10;
  }
  if (answers.priorityProjectIds.length > 0) {
    score += 5;
  }
  score += Math.min(20, Math.round(ownRatio * 100));

  if (answers.incomeBracket === 3) {
    return {
      segment: LeadSegment.ORANGE_SPECIAL,
      score: Math.min(100, Math.max(score, 55)),
      userMessage:
        'Thu nhập của bạn vượt ngưỡng phổ biến của NOXH. Đội ngũ sẽ liên hệ để tư vấn hồ sơ phù hợp và các lựa chọn an cư.',
    };
  }

  if (answers.priorityGroup === 5) {
    return {
      segment: LeadSegment.RED,
      score: Math.min(score, 45),
      userMessage:
        'Theo thông tin khai báo, bạn không thuộc các nhóm ưu tiên NOXH thông thường. Chúng tôi có thể tư vấn hướng an cư khác phù hợp hơn.',
    };
  }

  if (answers.housingStatus === 3) {
    return {
      segment: LeadSegment.RED,
      score: Math.min(score, 40),
      userMessage:
        'Theo thông tin nhà ở hiện tại, bạn có thể chưa thuộc diện đăng ký NOXH tại thời điểm này. Đội ngũ có thể gợi ý lộ trình chuẩn bị cho đợt sau.',
    };
  }

  if (answers.residenceStatus === 3) {
    return {
      segment: LeadSegment.YELLOW,
      score: Math.min(100, score),
      userMessage:
        'Bạn cần bổ sung chứng minh cư trú tại địa phương (hộ khẩu thường trú hoặc tạm trú + BHXH). Chuyên viên sẽ hướng dẫn hồ sơ cụ thể.',
    };
  }

  if (answers.priorityProjectIds.length === 0) {
    return {
      segment: LeadSegment.YELLOW,
      score: Math.min(100, score),
      userMessage: 'Vui lòng chọn tối đa 3 dự án ưu tiên từ danh sách đang mở bán để nhận phân tích chính xác hơn.',
    };
  }

  const legalCoreOk =
    answers.priorityGroup >= 1 &&
    answers.priorityGroup <= 4 &&
    (answers.residenceStatus === 1 || answers.residenceStatus === 2) &&
    (answers.incomeBracket === 1 || answers.incomeBracket === 2) &&
    (answers.housingStatus === 1 || answers.housingStatus === 2);

  if (legalCoreOk && ownRatio >= 0.2) {
    return {
      segment: LeadSegment.GREEN,
      score: Math.min(100, Math.max(score, 78)),
      userMessage:
        'Hồ sơ sơ bộ phù hợp điều kiện NOXH và tỷ lệ vốn tự có đạt mức tham chiếu. Chúng tôi sẽ liên hệ qua SĐT/Zalo và email để hoàn thiện bước tiếp theo.',
    };
  }

  if (legalCoreOk) {
    return {
      segment: LeadSegment.YELLOW,
      score: Math.min(100, score),
      userMessage:
        'Điều kiện pháp lý cơ bản phù hợp; cần rà soát thêm nguồn vốn và khả năng trả góp. Chuyên viên sẽ tư vấn chi tiết.',
    };
  }

  return {
    segment: LeadSegment.RED,
    score: Math.min(score, 55),
    userMessage:
      'Kết quả sơ bộ cho thấy cần điều chỉnh một số điều kiện. Đội ngũ vẫn có thể hỗ trợ bạn lộ trình chuẩn bị.',
  };
}
