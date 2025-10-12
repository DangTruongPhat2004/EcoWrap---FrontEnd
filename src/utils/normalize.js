export const normalizeEmail = (s) =>
  s
    ?.normalize("NFKC")
    // bỏ zero-width/bidi + ký tự bao ngoài phổ biến " ' < > ( ) [ ]
    ?.replace(
      /[\u200B-\u200D\u200E\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g,
      ""
    )
    ?.replace(/^[\s"'<>()[\]]+|[\s"'<>()[\]]+$/g, "")
    ?.trim()
    ?.toLowerCase() ?? "";

export const normalizePhoneVN = (s) => s?.replace(/[^\d+]/g, "") ?? "";
