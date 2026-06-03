const VN_DIGIT_WORDS: Record<string, string> = {
  khong: '0',
  ko: '0',
  linh: '0',
  mot: '1',
  hai: '2',
  ba: '3',
  bon: '4',
  tu: '4',
  nam: '5',
  lam: '5',
  sau: '6',
  bay: '7',
  tam: '8',
  chin: '9',
};

const VALID_VN_MOBILE_PREFIXES = [
  '32', '33', '34', '35', '36', '37', '38', '39',
  '52', '55', '56', '58', '59',
  '70', '76', '77', '78', '79',
  '81', '82', '83', '84', '85', '86', '87', '88', '89',
  '90', '91', '92', '93', '94', '95', '96', '97', '98', '99',
];

function stripVietnameseAccents(input: string): string {
  return input.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

/**
 * Đưa số về 9 chữ số quốc gia (sau mã 84), trả null nếu không hợp lệ.
 * Chấp nhận đầu vào dạng 0xxxxxxxxx, 84xxxxxxxxx, +84xxxxxxxxx.
 */
function toNationalNineDigits(digits: string): string | null {
  let d = digits;
  if (d.startsWith('84')) {
    d = d.slice(2);
  } else if (d.startsWith('0')) {
    d = d.slice(1);
  }
  if (d.length !== 9) {
    return null;
  }
  const prefix = d.slice(0, 2);
  if (!VALID_VN_MOBILE_PREFIXES.includes(prefix)) {
    return null;
  }
  return d;
}

/**
 * Chuẩn hóa SĐT về dạng 84xxxxxxxxx. Trả null nếu không nhận diện được.
 */
export function normalizePhone(rawInput: string): string | null {
  if (!rawInput) {
    return null;
  }
  const digitsOnly = rawInput.replace(/[^\d]/g, '');
  const national = toNationalNineDigits(digitsOnly);
  if (national) {
    return `84${national}`;
  }
  return null;
}

/**
 * Cố gắng bóc SĐT viết lóng bằng tiếng Việt (vd: "không chín tám ...") — fallback offline.
 * Không hoàn hảo; Claude API xử lý các trường hợp phức tạp hơn.
 */
export function extractPhoneFromText(text: string): string | null {
  const direct = matchDigitSequence(text);
  if (direct) {
    return direct;
  }

  const normalized = stripVietnameseAccents(text.toLowerCase());
  const tokens = normalized.split(/[^a-z0-9]+/).filter(Boolean);
  let buffer = '';
  for (const token of tokens) {
    if (/^\d+$/.test(token)) {
      buffer += token;
      continue;
    }
    const word = VN_DIGIT_WORDS[token];
    if (word !== undefined) {
      buffer += word;
      continue;
    }
    const found = tryBuffer(buffer);
    if (found) {
      return found;
    }
    buffer = '';
  }
  return tryBuffer(buffer);
}

function matchDigitSequence(text: string): string | null {
  const matches = text.match(/(?:\+?84|0)\d[\d\s.\-]{7,}\d/g);
  if (!matches) {
    return null;
  }
  for (const m of matches) {
    const normalized = normalizePhone(m);
    if (normalized) {
      return normalized;
    }
  }
  return null;
}

function tryBuffer(buffer: string): string | null {
  if (buffer.length < 9) {
    return null;
  }
  const candidates = [buffer, buffer.slice(0, 10), buffer.slice(0, 11), buffer.slice(-10), buffer.slice(-9)];
  for (const c of candidates) {
    const normalized = normalizePhone(c);
    if (normalized) {
      return normalized;
    }
  }
  return null;
}
